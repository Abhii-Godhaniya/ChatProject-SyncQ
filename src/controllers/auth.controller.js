import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import  {v2 as cloudinary} from "cloudinary";
import fs from "fs";

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body;
   try{
    //HAsh password
    
    if(!fullName || !email || !password){
        return res.status(400).json({message : "All fields are required"});
    }
    if (password.length < 8){
        return res.status(400).json({message : "Password must be at least 8 Character"});
    }
    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({message:"User already exixts"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser =await User.create({
        fullName:fullName,
        email:email,
        password:hashedPassword
    })
    if(newUser){
        //generate gwt token
        await newUser.save();
        generateToken(newUser._id,res)
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        })
    }else{
        res.status(400).json({message:"Invalid user data"});
    }
   }catch(err){
        console.log("Error in signup controller",err);
        res.status(500).json({message:"Internal Server Error"});
   }
};
export const login =async (req,res)=>{
   
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Invalid email and password" });
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    }catch(err){
        console.log("Error in login controller",err);
        res.status(500).json({message:"Internal Server Error"});
    }
};
export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0 })
        res.status(200).json({message:"Logout successfully"});
    }catch(err){
        res.status(400).json({message:"Internal server error"});
    }
};
export const updateProfile = async (req,res)=>{
    try{
        const {fullName, profilePic,bio}  = req.body;
        const userId  = req.user._id;
        const updateFields = {};
        if(fullName){
            if (fullName.length < 2) {
                return res.status(400).json({ message: "Name must be at least 2 characters" });
            }
            updateFields.fullName = fullName;
        }
        if(bio){
            updateFields.bio = bio;
        }
        if (profilePic) {
            
          }
          const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true , select:"-password"});
          if(!updatedUser){
            return res.status(404).json({ message: "User not found" });
          }
          res.status(200).json(updatedUser);

    }catch(err){
        console.log("Error in update profile",err.message);
        return res.status(500).json({message : "Internal server error"});
    }
}
export const checkAuthenticate = (req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("Error in checkauth controller",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const deleteAccount = async (req,res)=>{
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        await User.findByIdAndDelete(userId);
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Account deleted succesfully"});
    }catch(err){
        console.log("Error in deleting account",err.message);
        res.status(500).json({message:"Internal server error"});
    }
}
export const updateProfilePicture = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          message: "No file uploaded or invalid file format" 
        });
      }
      if (!cloudinary.config().api_secret) {
        console.error('Current Cloudinary config:', cloudinary.config());
        throw new Error('Cloudinary not properly configured');
      }
    
      // 2. Validate file type
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validMimeTypes.includes(req.file.mimetype)) {
         await fs.promises.unlink(req.file.path); // Delete temp file
        return res.status(400).json({ 
          message: "Only JPEG, PNG, or GIF images are allowed" 
        });
      }
  
      // 3. Validate file size (e.g., 2MB limit)
      if (req.file.size > 10 * 1024 * 1024) {
        await fs.promises.unlink(req.file.path);
        return res.status(400).json({ 
          message: "Image size must be less than 2MB" 
        });
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile-pictures',
        width: 500,
        height: 500,
        crop: 'fill'
      })
      await fs.promises.unlink(req.file.path);
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profilePic: result.secure_url },
        { new: true }
      ).select('-password'); // Exclude sensitive data
  
      res.status(200).json({
        profilePic: result.secure_url,
        message: "Profile picture updated successfully"
      });
  
    } catch (err) {
      console.error('Profile picture error:', err);
      
      if (req.file) {
        try {
          await fs.promises.unlink(req.file.path);
        } catch (cleanupErr) {
          console.error('Cleanup failed:', cleanupErr);
        }
      }
  
      return res.status(500).json({ 
        message: "Server error while updating profile picture" 
      });
    }
  };
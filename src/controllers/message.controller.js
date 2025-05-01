import User from "../models/user.model.js";
import Message from "../models/msg.model.js";
export const  getUsers = async(req,res)=>{
        try{
            const loginUserId = req.user_id;
            const filteredUsers = await User.find({_id:{$ne:loginUserId}}).select("-password");
            res.status(200).json(filteredUsers);

        }catch(err){
            console.log("Error in getUser",err.message);
            res.status(500).json({message:"Internal server error"});
        }
}
//read operation
export const getMessage = async (req,res)=>{
    try{
        const { id:userToChatId}  = req.params;
        const { myId } = req.user._id;

        const messages = await Message.find({
            $or:[
                {sender:myId, receiver:userToChatId},
                {receiver:myId, receiver:userToChatId}
            ]
        })
        res.status(200).json(messages);
    }catch(err){
        console.log("Error in get message Controller",err.messages);
        res.status(500).json({Error:"Internal server error"});
    }
}
//create message
export const sendMessage = async (req,res)=>{
    try{
        const { text,image ,vedio ,emoji } = req.body;
        const { id:receiverId} = req.params;
        const senderId = req.user._id;
        const file = req.file;
        if(!receiverId){
            res.status(400).json({Error:"Receiver ID is required"});
        }
        let fileUrl = null;
        if(file){
            const uploadResponse = await cloudinary.uploader.upload(file.buffer,{
                folder:"message",resource_type:file.mimetype.startsWith("image")?"image" : "vedio",
            });
            fileUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text,
            image:fileUrl,
            emoji ,
            timestamp: Date.now()
        });
        await newMessage.save();
    }catch(err){
        console.log("Error sending message",err.message);
        res.status(500).json({message:"Internal server error" });
    }
}
//update message
export const updateMessage = async(req,res)=>{
    try{
        const{id:messageId} = req.params;
        const { text, emoji} = req.body;
        const userId = req.user._id;
        const message = await message.findById(messageId);

        if(!message){
            return res.status(404).json({message: "Message not found"});
        }
        if(message.sender.toString()!== userId.toString()){
            return res.status(403).json({message: "Unathourized to update the message"});
        }
        if(text) message.text = text;
        if(emoji) message.emoji = emoji;
        message.edited = true;

        const updateMessage = await message.save();
        res.status(200).json(updateMessage);
    }catch(err){
        console.log("Error in updating message",message.err);
        res.status(500).json({message:"Internal server error" });
    }
}
//delete message
export const deleteMessage = async(req,res)=>{
    try{
        const{id:messageId} = req.params;
        const userId = req.user._id;
        const message = await message.findById(messageId);

        if(!message){
            return res.status(404).json({message: "Message not found"});
        }
        if(message.sender.toString()!== userId.toString()){
            return res.status(403).json({message: "Unathourized to update the message"});
        }
        const deleteMessage = await message.deleteOne();
        res.status(200).json({message: "Deleted successfully"});
    }catch(err){
        console.log("Error in deleting message",message.err);
        res.status(500).json({message:"Internal server error" });
    }

}

import express from "express";
import {signup,login,logout,checkAuthenticate,deleteAccount, updateProfilePicture} from "../controllers/auth.controller.js";
const router = express.Router();
import passport from "../lib/passport.js";
import { protectRoute } from "../middleware/auth.protectroute.js";
import { updateProfile  } from "../controllers/auth.controller.js";
import upload from "../lib/multer.js";
import "../lib/cloudinary.js"

router.post("/signup",signup);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",

    session: false,
  }),
  (req, res) => {

    const token = generateJWT(req.user._id); 

    res.cookie("token", token, 
        { httpOnly: true, maxAge: 86400000 });

    res.redirect("http://localhost:3000/dashboard"); 
  }
);

router.post("/login",login);

router.post("/logout",logout);

router.put("/updateProfile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuthenticate)

router.delete("/delete",protectRoute,deleteAccount);

router.put("/updateProfilePic",protectRoute,upload.single("profilePic"),updateProfilePicture)

export default router;

import mongoose from "mongoose";
//  userSchema
const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true, // allows to be optional if we support multiple auth types
        },
        email:{
            type:String,
            required: true,
            unique: true
        },
        fullName:{
            type: String,
            requred: true
        },
        password:{
            type: String,
            minLength: 8
        },
        profilePic: {
            type: String,
            default: ""
        },

    },
    {
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    {
        timestamps: true
    }
);
//user model
const User = mongoose.model("User",userSchema);

export default User;
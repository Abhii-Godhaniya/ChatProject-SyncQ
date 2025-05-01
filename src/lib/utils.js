import jwt from "jsonwebtoken";
export const generateToken = (userId,res) => {
     // Define a secret key (store this in an environment variable)
     const secretKey = process.env.JWT_SECRET ||"my_Secret_Key";
 
    const token = jwt.sign({userId}, secretKey, {
        expiresIn: "7d", // Token will expire in 1 hour
    });
    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true ,// prevents XSS attacks 
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });
    return token;
}
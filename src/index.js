import express from "express";
const app = express();
import { connectDB } from "./lib/db.js";
import passport from "passport";
import cookieParser from "cookie-parser"
import cors from 'cors';
import "./lib/passport.js";
import './config.js';
import "./lib/cloudinary.js";

const PORT = process.env.PORT;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

app.use("/api/auth",authRoutes);
app.use("/api/auth",messageRoutes);

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

app.listen(PORT,()=>{
    console.log(`app is listening on PORT : ${PORT}`);
    connectDB();
});

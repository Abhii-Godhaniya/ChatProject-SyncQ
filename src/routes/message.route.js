import express from "express";
import { protectRoute } from "../middleware/auth.protectroute.js";
import { getUsers,getMessage,sendMessage,updateMessage,deleteMessage} from "../controllers/message.controller.js";
import upload from "../lib/multer.js";
const router = express.Router();

router.get("/users",protectRoute,getUsers);
router.get("/:id",protectRoute,getMessage);
router.post("/send/:id",protectRoute,upload.single("file"),sendMessage);
router.put("/update/:id",protectRoute,updateMessage);
router.delete("/delete/:id",protectRoute,deleteMessage);

export default router;
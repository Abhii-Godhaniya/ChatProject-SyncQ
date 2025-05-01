import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);  // Create the directory if it doesn't exist
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      }
});
const upload = multer({
    storage
});
export default upload;
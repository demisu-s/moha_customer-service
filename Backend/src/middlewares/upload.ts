// middlewares/upload.ts
import multer from "multer";

const storage = multer.memoryStorage(); // or diskStorage if saving files

export const upload = multer({ storage });

import multer from "multer"
import fs from "fs"

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads")
}


const upload = multer({
    storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
}),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(
      file.mimetype
    );
    cb(ok ? null : new Error("Unsupported file type"), ok);
  },
})

export default upload
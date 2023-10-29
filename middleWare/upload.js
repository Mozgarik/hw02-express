import multer from "multer";
import path from "path"


const destination = path.resolve("temp")

const storage = multer.diskStorage({
        destination,
        filename: (req, file, cb) => {
        cb(null, file.originalname)
        const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePreffix}_${file.originalname}`;
        cb(null, filename)
    }
})

const upload = multer({
    storage,
})

export default upload
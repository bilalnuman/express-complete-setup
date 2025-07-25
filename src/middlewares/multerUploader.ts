import multer from 'multer';
import path from 'path';
import { RequestHandler } from 'express';
import fs from 'fs';


const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const folder = req.uploadFolder || 'uploads';
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${ext}`);
    },
});


export const createUploader = (
    isMultiple: boolean = false,
    useMemoryStorage: boolean = true
): RequestHandler => {
    const storage = useMemoryStorage ? multer.memoryStorage() : diskStorage;
    const upload = multer({ storage });
    return isMultiple ? upload.array('files') : upload.single('file');
};




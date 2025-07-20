
import multer from 'multer';
import path from 'path';
import { RequestHandler } from 'express';

import fs from 'fs';

const storage = multer.diskStorage({
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
    }
});

export const createUploader = (isMultiple: boolean = false): RequestHandler => {
    const upload = multer({ 
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
        },
    });
    return isMultiple ? upload.array('files') : upload.single('file');
};


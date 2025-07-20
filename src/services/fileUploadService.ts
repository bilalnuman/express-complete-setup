import fs from 'fs';
import path from 'path';

interface UploadOptions {
    allowedTypes: string[];
    folder: string;
    isMultiple?: boolean;
    oldFiles?: string[];
}

export class FileUploadService {
    static removeOldFiles(oldFiles?: string[]) {
        if (!oldFiles || oldFiles.length === 0) return;
        oldFiles.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
    }

    static validateFileType(file: Express.Multer.File, allowedTypes: string[]) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedTypes.includes(ext)) {
            throw new Error(`Invalid file type: ${ext}`);
        }
    }

    static handleUpload(files: Express.Multer.File[] | Express.Multer.File, options: UploadOptions) {
        const allFiles = Array.isArray(files) ? files : [files];
        allFiles.forEach(file => this.validateFileType(file, options.allowedTypes));
        this.removeOldFiles(options.oldFiles);
        return allFiles.map(f => ({
            filename: f.filename,
            path: f.path,
            mimetype: f.mimetype,
        }));
    }
}

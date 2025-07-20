import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { z } from 'zod';


const fileSchema = z.object({
    originalname: z.string().min(1, 'File name is required'),
    mimetype: z.string().refine(
        val => ['image/png', 'image/jpeg', 'application/pdf'].includes(val),
        { message: 'Only PNG, JPEG, and PDF files are allowed' }
    ),
    size: z.number().max(5 * 100 * 1024, 'Maximum file size is 5MB'),
    buffer: z.instanceof(Buffer),
});

export const uploadFiles = (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded, please select at least one file',
            });
        }

        const folder = req.uploadFolder || 'uploads';
        const uploadedResults: {
            originalName: string;
            status: string;
            message?: string;
            fileName: string;
        }[] = [];

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        for (const file of files) {
            const parsed = fileSchema.safeParse(file);

            if (!parsed.success) {
                uploadedResults.push({
                    originalName: file.originalname,
                    status: 'failed',
                    message: parsed.error.issues[0].message,
                    fileName: '',
                });
                continue;
            }

            const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
            const ext = path.extname(file.originalname);
            const fileName = `${hash}${ext}`;
            const filePath = path.join(folder, fileName);

            if (fs.existsSync(filePath)) {
                uploadedResults.push({
                    originalName: file.originalname,
                    status: 'already exists',
                    message: `File ${file.originalname} already exists`,
                    fileName,
                });
            } else {
                fs.writeFileSync(filePath, file.buffer);
                uploadedResults.push({
                    originalName: file.originalname,
                    status: 'uploaded',
                    message: `File ${file.originalname} has been uploaded`,
                    fileName,
                });
            }
        }

        const hasSuccess = uploadedResults.some(result =>
            result.status === 'uploaded' || result.status === 'already exists'
        );

        return res.status(hasSuccess ? 201 : 400).json({
            success: hasSuccess,
            message: 'Files processed',
            files: uploadedResults,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: err,
        });
    }
};
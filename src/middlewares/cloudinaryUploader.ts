
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../config/cloudinary';

// export const cloudUploader = (isMultiple: boolean = false) => {
//     const storage = new CloudinaryStorage({
//         cloudinary,
//         params: {
//             folder: 'uploads',
//             allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
//             transformation: [{ quality: "auto" }]
//         }
//     });

//     const upload = multer({ storage });
//     return isMultiple ? upload.array('files') : upload.single('file');
// };

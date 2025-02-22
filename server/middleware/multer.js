import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/");
        return {
            folder: 'Kafefolio', // Folder name in Cloudinary
            resource_type: isVideo ? 'video' : 'image', // Specify resource type
            allowed_formats: isVideo 
                ? ['mp4', 'mov', 'avi', 'webm'] // Allowed video formats
                : ['jpg', 'png', 'jpeg', 'webp', 'avif'], // Allowed image formats
        };
    },
});

export const upload = multer({ storage });
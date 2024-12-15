// src/middleware/upload.middleware.ts

import multer from 'multer';
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

// TypeScript Type Override
interface CloudinaryStorageWithFolder extends Options {
  params: Options['params'] & {
    folder?: string;
  };
}

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products' as string, // Override to specify folder
    resource_type: 'auto',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  }
  
} as CloudinaryStorageWithFolder);

export const upload = multer({ storage });

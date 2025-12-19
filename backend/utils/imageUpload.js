import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadToCloudinary = async (filePath, folder = 'uploads') => {
  try {
    const { v2: cloudinaryLib } = await import('cloudinary');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary not configured');
    }

    if (!cloudinaryLib.config().cloud_name) {
      cloudinaryLib.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }

    const result = await cloudinaryLib.uploader.upload(filePath, {
      folder: `hamrotask/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Resize large images
        { quality: 'auto' },
      ],
    });

    return result.secure_url;
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('Cloudinary package not installed');
    }
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !imageUrl?.includes('cloudinary.com')) {
      return;
    }
    
    const { v2: cloudinaryLib } = await import('cloudinary');
  
    if (!cloudinaryLib.config().cloud_name) {
      cloudinaryLib.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
    
    const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.[^.]+$/);
    if (publicIdMatch) {
      await cloudinaryLib.uploader.destroy(publicIdMatch[1]);
    }
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      console.error('Cloudinary delete error:', error);
    }
  }
};

export const multerStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'temp');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
  }
});

export const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export const processImageUpload = async (req, folder = 'uploads') => {
  if (!req.file) return null;

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const cloudUrl = await uploadToCloudinary(req.file.path, folder);
      await fs.unlink(req.file.path).catch(() => {});
      return cloudUrl;
    } catch (error) {
      console.error('Cloud upload failed, using local:', error.message);
    }
  }

  const finalFolder = path.join(process.cwd(), 'uploads', folder);
  const filename = path.basename(req.file.path);
  const localPath = path.join(finalFolder, filename);
  
  try {
    await fs.mkdir(finalFolder, { recursive: true });
    await fs.rename(req.file.path, localPath);
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error('Failed to move file:', error);
    return `/uploads/temp/${filename}`;
  }
};


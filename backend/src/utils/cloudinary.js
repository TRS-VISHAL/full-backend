import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { apiError } from './apiError.js';

// CLOUDINARY_NAME = alpha-
// CLOUDINARY_API_KEY = 885515477733642
// CLOUDINARY_API_SECRET = 212hdjhIxgaPQPrdeFe2BHdA-ec

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
     return null
    };
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    console.log(uploadResult);
    console.log(`file uploaded successfully ${uploadResult.url}`);
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath)
  }
};

export { uploadOnCloudinary };

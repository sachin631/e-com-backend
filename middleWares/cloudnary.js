// import { v2 as cloudinary } from "cloudinary";
const cloudinary = require("cloudinary").v2;
const fs=require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploaderr =async (filePath)=> {
  try {
    if (!filePath) {
    return  res.status(401).json({ message: "filePath not found", success: false });
    }
    const cloudRes = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    //delete file from server after uploded on cloudinary
    fs.unlinkSync(filePath);
    
    return cloudRes;

  } catch (error) {
    //delete the file from server if there is any error while uploding on cloudinary
    fs.unlinkSync(filePath);
    res
      .status(error.status || 500)
      .json({
        error: error.message,
        message: "file not upload on cloudinary please try again",
      });
  }
}

cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { resource_type: "auto" }
);


module.exports=cloudinaryUploaderr;
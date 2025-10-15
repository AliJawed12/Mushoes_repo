/* testupload.js */

import cloudinary from "./cloudinary-connection.js";

const uploadImage = async () => {
  try {
    const result = await cloudinary.uploader.upload("../images/mushoes-logo.PNG", {
      folder: "mushoes-logos"
    });

    console.log("Image Uploaded", result.secure_url);
  } catch (error) {
    console.log("upload failed ", error);
  }
};

uploadImage();
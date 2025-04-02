const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME;

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
// const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME;

// export const uploadToCloudinary = async (file) => {
//   if (!file) {
//     throw new Error("No file provided for upload.");
//   }

//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

//   try {
//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Cloudinary upload failed: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data.public_id; // Return only the unique public_id
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error.message);
//     throw error;
//   }
// };

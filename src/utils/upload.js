import axios from "axios";
import { API_URL } from "../configs/url";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr");

  try {
    const res = await axios.post("https://api.cloudinary.com/v1_1/dvbnpdo51/upload", data);

    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;


export const uploadMedia = async (file, onProgress) => {
  if (!file) throw new Error("No file provided");

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvbnpdo51/video/upload",
      data,
      {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        },
      }
    );
    return res.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw err;
  }
};



export const uploadToS3 = async (file, onProgress) => {
  try {
    // 1. Ask backend for signed URL
    const res = await fetch(
      `${API_URL}/api/file/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${file.type}`
    );

    if (!res.ok) throw new Error("Failed to get signed URL");

    const { uploadUrl, fileKey } = await res.json();

    // 2. Upload file directly to S3 with progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const fileUrl = `https://trader-store.s3.eu-north-1.amazonaws.com/${fileKey}`;
          resolve({ fileUrl, fileKey });
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Upload error"));

      xhr.send(file);
    });
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw err;
  }
};

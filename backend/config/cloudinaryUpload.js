import cloudinary from "./cloudinary.js";
export const uploadToCloudinary = (buffer) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blog_users" },
                (err, result) => {
                if (err) return reject(err);
                resolve(result);
                }
            );
            stream.end(buffer);
        }); 
        };
//cloudinary does not contain promise support , it supports old way of asynchronous promises  
//thats why we need to convert callback into a promise 
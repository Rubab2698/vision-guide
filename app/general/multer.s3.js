const {DeleteObjectCommand ,S3Client} = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require("dotenv").config();


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY

});

const myBucket = process.env.AWS_BUCKET_NAME;
console.log(myBucket)
const allowedMediaFormats = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];


const uploadToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: myBucket,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (allowedMediaFormats.includes(file.mimetype)) {
            // Allow the upload
            cb(null, true);
        } else {
            // Reject the upload
            cb(new Error('Invalid file format. Only JPG and PNG images and  mp4 videos are allowed.'));
        }
    }
});
// const uploadToS3 = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: myBucket, 
//         acl: 'public-read',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         key: function (req, file, cb) {
//             cb(null, file.originalname);
//         }
//     })
// });
const deleteImage = async function (key) {
    try {
        const deleteParams = {
            Bucket: myBucket,
            Key: key,
        };
        const deleteCommand = new DeleteObjectCommand(deleteParams);
        const x = await s3.send(deleteCommand);
        console.log(`x:${x}`)
        return key;
    } catch (error) {
        console.error('Error updating image:', error);
        throw error; 
    }
}


module.exports = {
    deleteImage,
    uploadToS3
}






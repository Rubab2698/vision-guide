const { deleteImage } = require('./multer.s3')

const img_del = (doc) => {
    const href = doc.image;
    const segments = new URL(href).pathname.split('/');
    const imageName = segments.pop()
    // console.log(imageName);
    deleteImage(imageName);
    return imageName
}


module.exports = img_del
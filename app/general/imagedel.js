const { deleteImage } = require('./multer.s3')

const file_del = (href) => {
    if(href){
        const segments = new URL(href).pathname.split('/');
        const fileName = segments.pop()
        // console.log(imageName);
        deleteImage(fileName);
        return fileName
    }else{
        return null;
    }

}


module.exports = file_del
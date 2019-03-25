import cloudinary from 'cloudinary';
import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';

// configure cloudinary
cloudinary.config({
    cloud_name: 'dfupaaz9h',
    api_key: '597377239584466',
    api_secret: '6JeSp8D94uXUfMx9a-vH-KyiQ6I',
});

const cloudStorage = cloudinaryStorage({
    cloudinary,
    folder: 'ts-node-app',
    allowedFormats: ['jpg', 'jpeg', 'png'],
    filename(req, file, callback) {
        callback(undefined, file.url);
    },
});

const cloudinaryUploader = multer({ storage: cloudStorage }).single('image');

export { cloudinaryUploader };

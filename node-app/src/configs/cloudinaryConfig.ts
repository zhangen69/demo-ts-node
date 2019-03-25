import { config, uploader } from 'cloudinary';

const cloudinaryConfig = () => {
    config({
        cloud_name: 'dfupaaz9h',
        api_key: '597377239584466',
        api_secret: '6JeSp8D94uXUfMx9a-vH-KyiQ6I',
    });
};

export { cloudinaryConfig, uploader };

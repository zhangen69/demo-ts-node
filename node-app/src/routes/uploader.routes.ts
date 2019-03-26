import express from 'express';

// import middlewares
import { checkAuth } from '../middlewares/checkAuth';
import { cloudinaryUploader } from '../middlewares/cloudinary.uploader';
import { multerUploader } from '../middlewares/multer.uploader';

const router = express.Router();

router.post('/multer/upload', checkAuth, multerUploader, (req, res) => {
    const url = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    res.status(200).json({ message: 'upload success', url });
});

router.post('/cloudinary/upload', checkAuth, cloudinaryUploader, (req, res) => {
    res.status(200).json({ messge: 'upload success', url: req.file.url });
});

export default router;

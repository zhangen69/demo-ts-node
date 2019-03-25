import express from 'express';
import path from 'path';

// import middlewares
import { cloudinaryUploader } from '../middlewares/cloudinary.uploader';
import { multerUploader } from '../middlewares/multer.uploader';

const router = express.Router();

router.post('/multer/upload', multerUploader, (req, res) => {
    const url = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    res.status(200).json({ message: 'upload success', url });
});

router.post('/cloudinary/upload', cloudinaryUploader, (req, res) => {
    res.status(200).json({ messge: 'upload success', url: req.file.url });
});

export default router;

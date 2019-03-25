import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import configs from '../configs/app.configs';

// import routes
import NgAppRoutes from '../routes/ng-app.routes';
import productRoutes from '../routes/product.routes';
import uploaderRoutes from '../routes/uploader.routes';

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// apply uploader routes
router.use(uploaderRoutes);

// apply service routes
router.use('/service', productRoutes);

// apply ng-app routes, public folders
router.use(NgAppRoutes);

// mongodb connection
mongoose.connect(configs.mongoose.connection, { useNewUrlParser: true })
    .then(() => { console.log('Connected to MongoDB!'); })
    .catch(() => { console.log('Connection failed!'); });

export default router;

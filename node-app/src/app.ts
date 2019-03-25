import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

// import routes
import productRoutes from './routes/product.routes';

// configure cloudinary
cloudinary.config({
    cloud_name: 'dfupaaz9h',
    api_key: '597377239584466',
    api_secret: '6JeSp8D94uXUfMx9a-vH-KyiQ6I',
});

// configure multer
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid MIME type');
        if (isValid) {
            error = null;
        }
        callback(error, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + extension);
    },
});

const upload = multer({ storage }).single('image');

// initialize app
const app = express();
const port = process.env.PORT || 3000;

// setup app configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// apply service routes
app.use('/service', productRoutes);

// upload image route
app.post('/image/upload', upload, (req, res) => {
    const url = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    res.status(200).json({ message: 'upload success', url });
});

// fetch image route
app.use('/images', express.static(path.join(__dirname, 'images')));

// WARNING: THIS CODE MUST BE LAST FOR WEB APIs
// apply ng-app routes
app.use('/', express.static(path.join(__dirname, 'ng-app')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'ng-app', 'index.html'));
});

// mongodb connection
mongoose
    .connect('mongodb+srv://jacob:dvyohzFHpCIK85MY@node-app-yfxfw.gcp.mongodb.net/demo_db?retryWrites=true', { useNewUrlParser: true })
    .then(() => { console.log('Connected to MongoDB!'); })
    .catch(() => { console.log('Connection failed!'); });

const server = http.createServer(app);

server.listen(port);

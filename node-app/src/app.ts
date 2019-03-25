import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import path from 'path';

// import routes
import productRoutes from './routes/product.routes';

// configure cloudinary
cloudinary.config({
    cloud_name: 'dfupaaz9h',
    api_key: '597377239584466',
    api_secret: '6JeSp8D94uXUfMx9a-vH-KyiQ6I',
});

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

// apply ng-app routes
app.use('/', express.static(path.join(__dirname, 'ng-app')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'ng-app', 'index.html'));
});

// upload route
app.post('/upload', (req, res) => {
    console.log(req.body);
    // cloudinary.uploader.upload()
});

// mongodb connection
mongoose
    .connect('mongodb+srv://jacob:dvyohzFHpCIK85MY@node-app-yfxfw.gcp.mongodb.net/demo_db?retryWrites=true', { useNewUrlParser: true })
    .then(() => { console.log('Connected to MongoDB!'); })
    .catch(() => { console.log('Connection failed!'); });

const server = http.createServer(app);

server.listen(port);

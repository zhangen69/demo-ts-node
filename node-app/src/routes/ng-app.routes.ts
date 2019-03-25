import express from 'express';
import path from 'path';

const router = express.Router();

// configure public folders
router.use('/images', express.static(path.join(__dirname, '../images')));

// configure ng-app
router.use('/', express.static(path.join(__dirname, '../ng-app')));
router.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../ng-app', 'index.html'));
});

export default router;

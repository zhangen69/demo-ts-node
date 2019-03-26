import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();

// scenarios for users
/**
 * 1. Register > check [username] and [email] has duplicated/existed or not
 * 2. Login & Logout
 * 3. Update Profile [update_info], [upload_image]
 * 4. Change Password
 * 5. Forgot Password > Received Email > Verify Token > Change Password
*/
// scenarios for admin
/**
 * 1. List all users (filterable)
 * 2. Update user info (fetch & update)
 * 3. Reset User Password (send email to the user's email)
 * 4. Lock/Unlock User
 * 5. Create a new user
*/

router.post('/register', (req, res) => {
    UserController.register(req.body).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/login', (req, res) => {});
router.post('/logout', (req, res) => {});
router.put('/changePassword', (req, res) => {});
router.get('/fetchProfile', (req, res) => {});
router.put('/updateProfile', (req, res) => {});
router.post('/emailConfirmed', (req, res) => {});
router.post('/forgotPassword', (req, res) => {});
router.post('/verifyResetPasswordToken', (req, res) => {});
router.get('/', (req, res) => {});
router.post('/', (req, res) => {});
router.get('/:id', (req, res) => {});
router.put('/', (req, res) => {});
router.post('/lock', (req, res) => {});
router.post('/unlock', (req, res) => {});
router.post('/resetPassword', (req, res) => {});

export default router;

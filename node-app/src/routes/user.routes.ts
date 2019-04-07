import express from 'express';
import { UserController } from '../controllers/user.controller';
import { checkAuth } from '../middlewares/checkAuth';

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

router.post('/login', (req, res) => {
    UserController.login(req.body).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/logout', (req, res) => {});

router.post('/changePassword', checkAuth, (req, res) => {
    if (req.auth.isAuth) {
        req.body.username = req.auth.user.username;
    }

    UserController.changePassword(req.body, req.auth).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.get('/fetchProfile', checkAuth, (req, res) => {
    if (!req.auth.isAuth) {
        res.status(401).json({ message: 'Access Denied' });
    }

    UserController.fetchProfile(req.auth.user._id).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.put('/updateProfile', checkAuth, (req, res) => {
    UserController.updateProfile(req.body).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/emailConfirmed', (req, res) => {});

router.post('/forgotPassword', (req, res) => {
    UserController.forgotPassword(req.body).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/verifyResetPasswordToken', (req, res) => {
    UserController.verifyResetPasswordToken(req.body).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.get('/', checkAuth, (req, res) => {
    const queryModel = req.query.queryModel ? JSON.parse(req.query.queryModel) : {};

    UserController.fetchAll(queryModel, req.auth).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.get('/:id', checkAuth, (req, res) => {
    UserController.fetch(req.params.id).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/', checkAuth, (req, res) => {
    UserController.register(req.body).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.put('/', checkAuth, (req, res) => {
    UserController.update(req.body, req.auth).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/lock', checkAuth, (req, res) => {
    UserController.lock(req.body, req.auth).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/unlock', checkAuth, (req, res) => {
    UserController.unlock(req.body, req.auth).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

router.post('/resetPassword', (req, res) => {
    UserController.resetPassword(req.body).then((result: any) => {
        res.status(result.status).json(result);
    }).catch((result: any) => {
        res.status(result.status).json(result);
    });
});

export default router;

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');



// validation runner middleware
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    next();
};

// Signup (frontend posts to /api/s)
router.post(
    '/s',
    body('fullName').isLength({ min: 2 }).withMessage('Full name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('phone').optional().isMobilePhone('any').withMessage('Valid phone number'),
    body('city').optional().isLength({ min: 2 }).withMessage('City name too short'),
    runValidation,
    userController.signup
);

// Login (frontend posts to /api/)
router.post(
    '/',
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 1 }).withMessage('Password required'),
    runValidation,
    userController.login
);

// Forgot password
router.post('/forgot-password', userController.forgotPassword);

// helper to combine auth + isAdmin safely into a single middleware
const adminOnly = (req, res, next) => {
    try {
        auth(req, res, (err) => {
            if (err) return next(err);
            isAdmin(req, res, next);
        });
    } catch (err) {
        next(err);
    }
};

// CRUD - protected routes for admin or authenticated users
router.get('/users', adminOnly, userController.listUsers);
router.get('/users/:id', auth, param('id').isMongoId(), userController.getUser);
router.put('/users/:id', auth, param('id').isMongoId(), userController.updateUser);
router.delete('/users/:id', auth, param('id').isMongoId(), userController.deleteUser);

module.exports = router;
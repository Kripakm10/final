const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { auth, isAdmin } = require('../middleware/auth');



const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  next();
};

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

router.post(
  '/',
  auth,
  body('firstName').isLength({ min: 2 }).withMessage('First name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').isMobilePhone('any').withMessage('Valid phone required'),
  body('department').isLength({ min: 2 }).withMessage('Department required'),
  body('lat').optional().isFloat().withMessage('lat must be a number'),
  body('lng').optional().isFloat().withMessage('lng must be a number'),
  runValidation,
  registrationController.createRegistration
);

// admin listing (protected)
router.get('/', adminOnly, registrationController.listRegistrations);

// my registrations
router.get('/mine', auth, registrationController.listMineRegistrations);

// update and delete (admin)
router.put('/:id', adminOnly, registrationController.updateRegistration);
router.delete('/:id', adminOnly, registrationController.deleteRegistration);

module.exports = router;

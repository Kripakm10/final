const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const wasteController = require('../controllers/wasteController');
const { auth, isAdmin } = require('../middleware/auth');

// debug: ensure middleware/handlers are functions
console.log('wasteRoute: auth=', typeof auth, 'isAdmin=', typeof isAdmin, 'listWastes=', typeof wasteController.listWastes);

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
  body('name').isLength({ min: 2 }).withMessage('Full name required'),
  body('address').isLength({ min: 5 }).withMessage('Address too short'),
  body('contact').isMobilePhone('any').withMessage('Valid contact number required'),
  body('wasteType').isLength({ min: 3 }).withMessage('Select a waste type'),
  body('lat').optional().isFloat().withMessage('lat must be a number'),
  body('lng').optional().isFloat().withMessage('lng must be a number'),
  runValidation,
  wasteController.createWaste
);

// admin listing (protected)
router.get('/', adminOnly, wasteController.listWastes);

// my submissions (authenticated)
router.get('/mine', auth, wasteController.listMine);

// update (admin)
router.put('/:id', adminOnly, wasteController.updateWaste);

// schedule (admin)
router.post('/:id/schedule', adminOnly, wasteController.scheduleWaste);

// report not collected (user)
router.post('/:id/report', auth, wasteController.reportNotCollected);

// delete (admin)
// delete (admin)
router.delete('/:id', adminOnly, wasteController.deleteWaste);

// Worker / Assignment Routes
router.get('/assigned', auth, wasteController.listAssignedWaste); // Worker sees their tasks
router.post('/:id/assign', adminOnly, wasteController.assignWaste); // Admin assigns
router.post('/:id/verify', auth, wasteController.verifyWaste); // Worker verifies

module.exports = router;
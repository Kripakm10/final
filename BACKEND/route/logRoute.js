const express = require('express');
const router = express.Router();
const { listLogs } = require('../controllers/logController');
const { auth, isAdmin } = require('../middleware/auth');



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

// admin listing (protected)
router.get('/', adminOnly, listLogs);

module.exports = router;
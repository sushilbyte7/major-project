const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.route('/')
    .get(getServices)
    .post(protect, adminOnly, createService);

router.route('/:id')
    .get(getService)
    .put(protect, adminOnly, updateService)
    .delete(protect, adminOnly, deleteService);

module.exports = router;

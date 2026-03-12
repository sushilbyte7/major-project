const express = require('express');
const router = express.Router();
const { getProviders, getProvider, createProvider, updateProvider, deleteProvider } = require('../controllers/providerController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.route('/')
    .get(getProviders)
    .post(protect, adminOnly, createProvider);

router.route('/:id')
    .get(getProvider)
    .put(protect, adminOnly, updateProvider)
    .delete(protect, adminOnly, deleteProvider);

module.exports = router;

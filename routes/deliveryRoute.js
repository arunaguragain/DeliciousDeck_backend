const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authorization');
const { createDelivery, getDeliveries } = require('../controllers/deliveryController');

// Create delivery route
router.post('/create', authMiddleware, async (req, res) => {
    await createDelivery(req, res);
});

// Get deliveries for a specific order
router.get('/:orderId', authMiddleware, async (req, res) => {
    await getDeliveries(req, res);
});

module.exports = router;

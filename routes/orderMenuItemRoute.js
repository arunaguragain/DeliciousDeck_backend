const express = require('express');
const router = express.Router();
const  authMiddleware = require('../middleware/authorization');
const { createOrderMenuItem, getOrderMenuItems } = require('../controllers/orderItemController');

// Create order menu item route
router.post('/create', authMiddleware, async (req, res) => {
    await createOrderMenuItem(req, res);
});

// Get order items by orderId
router.get('/:orderId', authMiddleware, async (req, res) => {
    await getOrderMenuItems(req, res);
});

module.exports = router;

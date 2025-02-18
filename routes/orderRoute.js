const express = require('express');
const router = express.Router();
const authMiddleware  = require('../middleware/authorization');
const { createOrder, getOrders } = require('../controllers/orderController');

// Create order route
router.post('/create', authMiddleware, async (req, res) => {
    await createOrder(req, res);
});

// Get all orders for a customer
router.get('/', authMiddleware, async (req, res) => {
    await getOrders(req, res);
});

module.exports = router;

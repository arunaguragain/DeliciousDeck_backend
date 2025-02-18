const  Order  = require('../model/Order.js');

// Create an order
const createOrder = async (req, res) => {
    try {
        const { CustomeruserId, orderDate, totalAmount, status, quantity } = req.body;
        const order = await Order.create({ CustomeruserId, orderDate, totalAmount, status, quantity });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
};

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
};

// Get a specific order
const getOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order', error: err.message });
    }
};

// Update an order
const updateOrder = async (req, res) => {
    try {
        const { status, totalAmount, quantity } = req.body;
        const order = await Order.findByPk(req.params.id);
        if (order) {
            order.status = status;
            order.totalAmount = totalAmount;
            order.quantity = quantity;
            await order.save();
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating order', error: err.message });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (order) {
            await order.destroy();
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting order', error: err.message });
    }
};

module.exports = { createOrder, getOrders, getOrder, updateOrder, deleteOrder };

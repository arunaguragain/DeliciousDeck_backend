const  OrderMenuItem = require('../model/OrderMenuItem.js');

// Create an order-menu item relationship
const createOrderMenuItem = async (req, res) => {
    try {
        const { MenuItemitemID, OrderorderId } = req.body;
        const orderMenuItem = await OrderMenuItem.create({ MenuItemitemID, OrderorderId });
        res.status(201).json(orderMenuItem);
    } catch (err) {
        res.status(500).json({ message: 'Error creating order-menu item relation', error: err.message });
    }
};

module.exports = { createOrderMenuItem };

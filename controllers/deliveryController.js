const  Delivery  = require('../model/Delivery.js');

// Create a delivery
const createDelivery = async (req, res) => {
    try {
        const { status, estimatedTime, OrderorderId } = req.body;
        const delivery = await Delivery.create({ status, estimatedTime, OrderorderId });
        res.status(201).json(delivery);
    } catch (err) {
        res.status(500).json({ message: 'Error creating delivery', error: err.message });
    }
};

// Get all deliveries
const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll();
        res.status(200).json(deliveries);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
    }
};

// Get a specific delivery
const getDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);
        if (delivery) {
            res.status(200).json(delivery);
        } else {
            res.status(404).json({ message: 'Delivery not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching delivery', error: err.message });
    }
};

// Update a delivery
const updateDelivery = async (req, res) => {
    try {
        const { status, estimatedTime } = req.body;
        const delivery = await Delivery.findByPk(req.params.id);
        if (delivery) {
            delivery.status = status;
            delivery.estimatedTime = estimatedTime;
            await delivery.save();
            res.status(200).json(delivery);
        } else {
            res.status(404).json({ message: 'Delivery not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating delivery', error: err.message });
    }
};

// Delete a delivery
const deleteDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);
        if (delivery) {
            await delivery.destroy();
            res.status(200).json({ message: 'Delivery deleted successfully' });
        } else {
            res.status(404).json({ message: 'Delivery not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting delivery', error: err.message });
    }
};

module.exports = { createDelivery, getDeliveries, getDelivery, updateDelivery, deleteDelivery };

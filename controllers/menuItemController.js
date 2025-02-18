const MenuItem  = require('../model/MenuItem.js');

// Create a menu item
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, CustomeruserId } = req.body;
        const menuItem = await MenuItem.create({ name, description, price, category, CustomeruserId });
        res.status(201).json(menuItem);
    } catch (err) {
        res.status(500).json({ message: 'Error creating menu item', error: err.message });
    }
};

// Get all menu items
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll();
        res.status(200).json(menuItems);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching menu items', error: err.message });
    }
};

// Get a specific menu item
const getMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (menuItem) {
            res.status(200).json(menuItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching menu item', error: err.message });
    }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (menuItem) {
            menuItem.name = name;
            menuItem.description = description;
            menuItem.price = price;
            menuItem.category = category;
            await menuItem.save();
            res.status(200).json(menuItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating menu item', error: err.message });
    }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (menuItem) {
            await menuItem.destroy();
            res.status(200).json({ message: 'Menu item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting menu item', error: err.message });
    }
};

module.exports = { createMenuItem, getMenuItems, getMenuItem, updateMenuItem, deleteMenuItem };

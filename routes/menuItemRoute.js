const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/authorization');
const { createMenuItem, getMenuItems } = require('../controllers/menuItemController');

// Create menu item route
router.post('/create', authMiddleware, async (req, res) => {
    await createMenuItem(req, res);
});

// Get all menu items
router.get('/', authMiddleware, async (req, res) => {
    await getMenuItems(req, res);
});

module.exports = router;

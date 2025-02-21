const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/authorization');
const { createMenuItem, getMenuItems, getMenuItem, deleteMenuItem  } = require('../controllers/menuItemController');

router.get('/', getMenuItems);

// Public route: Get a specific menu item
router.get('/:id', getMenuItem);

// Protected route: Create a new menu item (Requires Authentication)
router.post('/create', authMiddleware(), createMenuItem);



// Protected route: Delete a menu item (Requires Authentication)
router.delete('/:id', authMiddleware(), deleteMenuItem);

module.exports = router;

const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/authorization');
const { createMenuItem, getMenuItems, getMenuItem, deleteMenuItem  } = require('../controllers/menuItemController');

router.get('/', getMenuItems);

router.get('/:id', getMenuItem);

router.post('/create', authMiddleware(), createMenuItem);

router.delete('/:id', authMiddleware(), deleteMenuItem);

module.exports = router;

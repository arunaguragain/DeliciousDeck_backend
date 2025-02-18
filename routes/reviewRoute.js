const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/authorization');
const { createReview, getReviews } = require('../controllers/reviewController');

// Create review route
router.post('/create', authMiddleware, async (req, res) => {
    await createReview(req, res);
});

// Get reviews for a customer
router.get('/', authMiddleware, async (req, res) => {
    await getReviews(req, res);
});

module.exports = router;

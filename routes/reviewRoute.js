const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authorization');
const { createReview, getReviews, getReview, updateReview, deleteReview } = require('../controllers/reviewController');

// Create review route
router.post('/create', authMiddleware, async (req, res) => {
    await createReview(req, res);
});

// Get all reviews
router.get('/', authMiddleware, async (req, res) => {
    await getReviews(req, res);
});

// Get a specific review by ID
router.get('/:id', authMiddleware, async (req, res) => {
    await getReview(req, res);
});

// Update a specific review by ID
router.put('/:id', authMiddleware, async (req, res) => {
    await updateReview(req, res);
});

// Delete a specific review by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    await deleteReview(req, res);
});

module.exports = router;

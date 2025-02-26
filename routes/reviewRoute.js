const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authorization');
const { createReview, getReviews, getReview, updateReview, deleteReview } = require('../controllers/reviewController');

router.post('/create', authMiddleware(), async (req, res) => {
    await createReview(req, res);
});

router.get('/', authMiddleware(), async (req, res) => {
    await getReviews(req, res);
});

router.get('/:id', authMiddleware(), async (req, res) => {
    await getReview(req, res);
});

router.put('/:id', authMiddleware(), async (req, res) => {
    await updateReview(req, res);
});
router.delete('/:id', authMiddleware(), async (req, res) => {
    await deleteReview(req, res);
});

module.exports = router;

const express = require('express');
const authMidleware = require('../middlewares/authMiddleware');
const category = require('../controllers/category');

const router = express.Router();

router.get('/category/:id', category.getById);
router.post('/category', authMidleware, category.create);
router.get('/category', category.getAll);

module.exports = router;
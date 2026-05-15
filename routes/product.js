const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { getAll, create, getById } = require('../controllers/product');

const router = express.Router();

router.post('/products', authMiddleware, create);
router.get('/products', getAll);
router.get('/product/:id', getById);

module.exports = router;

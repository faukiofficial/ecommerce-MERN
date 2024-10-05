const router = require('express').Router();
const OrderController = require('../controllers/OrderController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/checkout', authMiddleware(['user']), OrderController.getCart);

router.post('/complete-order', authMiddleware(['user', 'admin']), OrderController.addToCart);

module.exports = router;
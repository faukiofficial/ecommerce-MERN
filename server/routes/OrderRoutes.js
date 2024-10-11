const router = require('express').Router();
const OrderController = require('../controllers/OrderController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/checkout', authMiddleware(['user']), OrderController.createOrder);
router.get('/all', authMiddleware(['admin']), OrderController.getAllOrders);
router.get('/user-orders', authMiddleware(['user', 'admin']), OrderController.getUserOrders);



// router.post('/complete-order', authMiddleware(['user', 'admin']), OrderController.addToCart);

module.exports = router;
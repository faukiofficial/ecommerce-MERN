const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');

// Create an order (Checkout)
exports.Checkout = async (req, res) => {
  const { userId } = req.user;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    // Calculate total price
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.salePrice * item.quantity;
    }, 0);

    // Create new order
    const newOrder = new Order({
      userId,
      items: cart.items,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status to 'completed'
exports.CompleteOreder = async (req, res) => {
    const { orderId } = req.body;
    try {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
  
      order.status = 'completed';
      order.paymentStatus = 'paid';
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

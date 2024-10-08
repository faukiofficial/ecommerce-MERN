const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'process', 'ondelivery', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
});

module.exports = mongoose.model('Order', orderSchema);

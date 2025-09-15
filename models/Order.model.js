const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      quantity: Number,
    }
  ],
  total: Number,
  paymentMethod: { type: String, enum: ['cash', 'card'] },
  status: { type: String, default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

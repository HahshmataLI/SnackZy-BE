const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: String,
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model('Item', itemSchema);

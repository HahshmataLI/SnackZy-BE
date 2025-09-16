const Order = require('../models/Order.model');

exports.createOrder = async (req, res) => {
  const { items, total, paymentMethod } = req.body;
  const order = new Order({
    items,
    total,
    paymentMethod,
    createdBy: req.user._id
  });
  await order.save();
  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ createdBy: req.user._id }).populate('items.item');
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('items.item createdBy');
  res.json(orders);
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.item')
      .populate('createdBy', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only allow access if admin or the one who created it
    if (req.user.role !== 'admin' && order.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getFilteredOrders = async (req, res) => {
  try {
    const { status, paymentMethod } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const orders = await Order.find(filter)
      .populate('items.item')
      .populate('createdBy', 'name email');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllOrdersPaginated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const orders = await Order.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('items.item')
      .populate('createdBy', 'name email');

    const total = await Order.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      orders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
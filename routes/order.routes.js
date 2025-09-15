const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder, getOrderById, getFilteredOrders, getAllOrdersPaginated } = require('../controllers/order.controller');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/filter', protect, adminOnly, getFilteredOrders);
router.get('/all', protect, adminOnly, getAllOrdersPaginated);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;

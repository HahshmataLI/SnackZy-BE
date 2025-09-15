const router = require('express').Router();
const { createCategory, getCategories,createItem, getMenu } = require('../controllers/menu.controller');
const { protect, adminOnly } = require('../middleware/auth');

// router.post('/category', protect, adminOnly, createCategory);
router.post('/categories', protect, adminOnly, createCategory); 
// router.post('/item', protect, adminOnly, createItem);
const upload = require('../utils/upload');

router.post('/item', protect, adminOnly, upload.single('image'), createItem);

router.get('/items', getMenu);
router.get('/categories', getCategories);
module.exports = router;

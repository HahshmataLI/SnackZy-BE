const Item = require('../models/Item.model');
const Category = require('../models/Category.model');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

exports.createItem = async (req, res) => {
  try {
    console.log('BODY:', req.body);     // ✅ add this
    console.log('FILE:', req.file);     // ✅ add this

    const { name, price, category, available } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const item = new Item({
      name,
      price: parseFloat(price),
      category,
      available: available === 'true',
      image
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('❌ Error creating item:', err);
    res.status(500).json({ message: 'Server error while creating item' });
  }
};


exports.getMenu = async (req, res) => {
  try {
    const items = await Item.find().populate('category', 'name');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

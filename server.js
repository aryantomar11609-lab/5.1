const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();
const app = express();
app.use(express.json());

 
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ Connection error:', err));

// ----------------- CRUD ROUTES -----------------

// CREATE Product (POST)
app.post('/products', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newProduct = new Product({ name, price, category });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err.message });
  }
});

 
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// UPDATE Product by ID (PUT)
app.put('/products/:id', async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Error updating product', error: err.message });
  }
});

 
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({
      message: 'Product deleted',
      product: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

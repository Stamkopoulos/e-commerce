import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Admin only. Needs authentication from clerk
export const createProduct = async (req, res) => {
  try {
    const { name, image, description, price, stock, category } = req.body;

    const newProduct = await Product.create({
      name,
      image,
      description,
      price,
      stock,
      category,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Admin only. Needs authentication from clerk
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, image, description, price, stock, category } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, image, description, price, stock, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Admin only. Needs authentication from clerk
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const {
      gender,
      category,
      color,
      size,
      minPrice,
      maxPrice,
      search,
      sort, // "price_asc", "price_desc", "latest"
    } = req.query;

    // Build dynamic filter object
    let filters = {};

    if (gender) filters.gender = gender; // /api/products?gender=men
    if (category) filters.category = category; // /api/products?category=jackets

    // /api/products?minPrice=30&maxPrice=100
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice); // greater than or equal
      if (maxPrice) filters.price.$lte = Number(maxPrice); // less than or equal
    }

    // SEARCH (name + description) /api/products?search=shirt
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } }, //regex: Regular expression search (used to search text inside strings, like name or color)
        { description: { $regex: search, $options: "i" } }, //$options : "i" --> case insensitive search, ignore lowercase/uppercase
      ];
    }

    // /api/products?color=black
    if (color) filters["variants.color"] = { $regex: new RegExp(color, "i") }; //Create a regex object for case insensitive search

    // /api/products?size=M
    if (size) {
      filters["variants.sizes"] = {
        $elemMatch: { size: size.toUpperCase(), quantity: { $gt: 0 } }, // $elemMatch: Match inside arrays of objects
      }; // This is used when a field is an array of objects
    }

    let query = Product.find(filters);

    // Sorting --> /api/products?gender=men&category=jackets&sort=price_desc
    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "latest") query = query.sort({ createdAt: -1 });

    const products = await query;

    res.json({ totalResults: products.length, results: products });
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
    const { name, description, price, category, gender, variants } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      gender,
      variants,
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
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

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

import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const { MONGODB_URI } = process.env;

const CATEGORY_MAP = {
  jeans: ["jean", "denim"],
  tshirts: ["t-shirt", "tshirt", "shirt", "tee"],
  trousers: ["trouser", "pants"],
  jackets: ["jacket", "coat"],
  hoodies: ["hoodie", "hooded", "sweatshirt"],
};

// Automatically detect category based on title + description
function detectCategory(product) {
  const text = `${product.title} ${product.description}`.toLowerCase();

  for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some((k) => text.includes(k))) return cat;
  }

  return "other";
}

const fetchClothes = async () => {
  const urls = [
    "https://fakestoreapi.com/products/category/men's clothing",
    "https://fakestoreapi.com/products/category/women's clothing",
  ];

  let allProducts = [];

  for (const url of urls) {
    const res = await axios.get(url);
    allProducts = allProducts.concat(res.data);
  }

  return allProducts;
};

const seed = async () => {
  try {
    console.log("Connecting to Mongo...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    console.log("Clearing old products...");
    await Product.deleteMany({});

    console.log("Fetching clothing products...");
    const apiProducts = await fetchClothes();

    console.log(`Fetched ${apiProducts.length} items`);

    const formatted = apiProducts.map((item) => ({
      name: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      category: detectCategory(item),
    }));

    console.log("Inserting into database...");
    await Product.insertMany(formatted);

    console.log("🌟 DONE! Database seeded with clothing products.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();

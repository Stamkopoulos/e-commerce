import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get one product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Get products by gender (men/women)
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/collections/${category}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    throw error;
  }
};

// Get bestseller products
export const getBestsellerProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/best-sellers`);
    return response.data; // array of top products
  } catch (error) {
    console.error("Error fetching bestseller products:", error);
    return [];
  }
};

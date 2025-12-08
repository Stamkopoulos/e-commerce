import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get one product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Get products by gender (men/women)
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/collections/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    throw error;
  }
};

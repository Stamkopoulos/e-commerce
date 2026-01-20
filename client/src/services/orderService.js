import axios from "axios";

const API_URL = "http://localhost:5000/api";
// later: import.meta.env.VITE_API_URL

export const placeOrder = async (orderData) => {
  try {
    const res = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Order API error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Network error" };
  }
};

import axios from "axios";

const API_URL = "http://localhost:5000/api";
export const placeOrder = async (orderData) => {
  try {
    const res = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data; 
  } catch (error) {
    console.error("Order API error:", error);
    throw error.response?.data || { message: "Network error" };
  }
};

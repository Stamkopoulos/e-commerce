import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Helper to set headers with token
const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ===== Dashboard =====
export const getDashboardOverview = async (token) => {
  try {
    const res = await axios.get(
      `${API_URL}/admin/dashboard/overview`,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching dashboard overview:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ===== PRODUCTS (STATS) =====
export const getAdminProductStats = async (token) => {
  const res = await axios.get(
    `${API_URL}/admin/products`,
    getAuthHeaders(token)
  );
  return res.data;
};

// ===== ORDERS (STATS) =====
export const getAdminOrderStats = async (token) => {
  const res = await axios.get(`${API_URL}/admin/orders`, getAuthHeaders(token));
  return res.data;
};

// ===== USERS (STATS) =====
export const getAdminUserStats = async (token) => {
  const res = await axios.get(`${API_URL}/admin/users`, getAuthHeaders(token));
  return res.data;
};

// ===== PRODUCTS =====

// Admin list (same as public, but admin UI)
export const getAdminProducts = async (params, token) => {
  const res = await axios.get(`${API_URL}/products`, {
    params,
    ...getAuthHeaders(token),
  });
  return res.data; // { totalResults, results }
};

export const createProduct = async (data, token) => {
  const res = await axios.post(
    `${API_URL}/products`,
    data,
    getAuthHeaders(token)
  );
  return res.data;
};

export const updateProduct = async (id, data, token) => {
  const res = await axios.put(
    `${API_URL}/products/${id}`,
    data,
    getAuthHeaders(token)
  );
  return res.data;
};

export const deleteProduct = async (id, token) => {
  const res = await axios.delete(
    `${API_URL}/products/${id}`,
    getAuthHeaders(token)
  );
  return res.data;
};

// ===== ORDERS (ADMIN) =====
export const getAdminOrders = async (token) => {
  const res = await axios.get(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateOrderStatus = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/orders/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteOrder = async (id, token) => {
  const res = await axios.delete(`${API_URL}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ===== USERS (ADMIN) =====
export const getAdminUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (id, token) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

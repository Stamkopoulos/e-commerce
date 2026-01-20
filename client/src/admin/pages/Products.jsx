import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AdminTable from "../components/AdminTable";
import ProductForm from "../components/ProductForm";
import StatCard from "../components/StatCard";
import {
  getAdminProducts,
  getAdminProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/AdminApi";

const Products = () => {
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  /* ===== LOAD STATS ===== */
  useEffect(() => {
    const loadStats = async () => {
      const token = await getToken();
      const res = await getAdminProductStats(token);
      setStats(res);
    };
    loadStats();
  }, []);

  /* ===== LOAD PRODUCTS ===== */
  const loadProducts = async () => {
    const token = await getToken();
    const res = await getAdminProducts({ search }, token);
    setProducts(res.results || []);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  /* ===== ACTIONS ===== */
  const handleCreate = async (data) => {
    const token = await getToken();
    await createProduct(data, token);
    setCreating(false);
    loadProducts();
  };

  const handleUpdate = async (data) => {
    const token = await getToken();
    await updateProduct(editing._id, data, token);
    setEditing(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    const token = await getToken();
    await deleteProduct(id, token);
    loadProducts();
  };

  if (!stats) return <p className="p-4">Loading...</p>;

  /* ===== TABLE ===== */
  const columns = [
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "actions", label: "Actions" },
  ];

  const data = products.map((p) => ({
    _id: p._id,
    image: (
      <img
        src={p.variants?.[0]?.images?.[0] || "/placeholder.png"}
        className="w-10 h-10 object-cover rounded"
      />
    ),
    name: p.name,
    category: p.category,
    price: `€${p.price}`,
    stock: p.variants?.[0]?.sizes?.reduce((sum, s) => sum + s.quantity, 0) || 0,
    actions: (
      <div className="flex gap-2">
        <button className="text-blue-600" onClick={() => setEditing(p)}>
          Edit
        </button>
        <button className="text-red-600" onClick={() => handleDelete(p._id)}>
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-4 space-y-4">
      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="In Stock" value={stats.inStock} />
        <StatCard title="Low Stock" value={stats.lowStock} />
        <StatCard title="Out of Stock" value={stats.outOfStock} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border p-2 rounded"
        />

        <button
          onClick={() => setCreating(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + New Product
        </button>
      </div>

      {/* TABLE */}
      <AdminTable columns={columns} data={data} />

      {/* FORMS */}
      {creating && (
        <ProductForm
          onSubmit={handleCreate}
          onClose={() => setCreating(false)}
        />
      )}

      {editing && (
        <ProductForm
          initialData={editing}
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default Products;

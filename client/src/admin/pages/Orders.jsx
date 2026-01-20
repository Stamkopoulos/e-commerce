import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AdminTable from "../components/AdminTable";
import StatCard from "../components/StatCard";
import {
  getAdminOrders,
  updateOrderStatus,
  deleteOrder,
} from "../services/AdminApi";

const Orders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  const loadOrders = async () => {
    const token = await getToken();
    const data = await getAdminOrders(token);
    setOrders(data);

    // Compute stats
    const totalOrders = data.length;
    const pending = data.filter((o) => o.status === "pending").length;
    const shipped = data.filter((o) => o.status === "shipped").length;
    const delivered = data.filter((o) => o.status === "delivered").length;

    setStats({ totalOrders, pending, shipped, delivered });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    const token = await getToken();
    await updateOrderStatus(id, { status }, token);
    loadOrders();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete order?")) return;
    const token = await getToken();
    await deleteOrder(id, token);
    loadOrders();
  };

  if (!stats) return <p>Loading...</p>;

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "total", label: "Total" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const data = orders.map((o) => ({
    _id: o._id,
    customer: `${o.customerFirstName} ${o.customerLastName}`,
    email: o.email,
    total: `€${o.totalPrice}`,
    status: (
      <select
        value={o.status}
        onChange={(e) => handleStatusChange(o._id, e.target.value)}
        className="border p-1"
      >
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
    ),
    actions: (
      <button className="text-red-600" onClick={() => handleDelete(o._id)}>
        Delete
      </button>
    ),
  }));

  return (
    <div className="p-4">
      <div className="p-4 grid grid-cols-4 gap-4 mb-4">
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Shipped" value={stats.shipped} />
        <StatCard title="Delivered" value={stats.delivered} />
      </div>

      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <AdminTable columns={columns} data={data} />
    </div>
  );
};

export default Orders;

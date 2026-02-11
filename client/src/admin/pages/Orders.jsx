import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import StatCard from "../components/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  getAdminOrders,
  updateOrderStatus,
  deleteOrder,
} from "../services/AdminApi";
import OrdersTable from "../components/OrdersTable";
import SearchBox from "../components/SearchBox";

const Orders = () => {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (date) => new Date(date).toLocaleDateString();

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

  const handlePaymentStatusChange = async (id, paymentStatus) => {
    const token = await getToken();
    await updateOrderStatus(id, { paymentStatus }, token);
    loadOrders();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete order?")) return;
    const token = await getToken();
    await deleteOrder(id, token);
    loadOrders();
  };

  // Filter based on search
  let filteredOrders = orders.filter((o) => {
    const value = search.toLowerCase();
    return (
      `${o.customerFirstName} ${o.customerLastName}`
        .toLowerCase()
        .includes(value) ||
      o.email?.toLowerCase().includes(value) ||
      formatDate(o.createdAt).includes(value) ||
      o._id?.toLowerCase().includes(value)
    );
  });
  //sort: Newest orders first
  filteredOrders = filteredOrders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (!stats) return <p>Loading...</p>;

  const data = currentOrders.map((o) => ({
    _id: o._id,
    customer: `${o.customerFirstName} ${o.customerLastName}`,
    email: o.email,
    total: `${o.totalPrice}`,

    status: o.status,
    paymentStatus: o.paymentStatus,
    date: new Date(o.createdAt).toLocaleDateString(),
    actions: (
      <button className="text-red-600" onClick={() => handleDelete(o._id)}>
        Delete
      </button>
    ),
  }));

  return (
    <div className="p-4 space-y-6">
      {/* Stats Card */}

      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Shipped" value={stats.shipped} />
        <StatCard title="Delivered" value={stats.delivered} />
      </div>

      {/* Orders Table Card */}
      <Card>
        <CardHeader>
          <SearchBox search={search} setSearch={setSearch} />
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <OrdersTable
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onPaymentChange={handlePaymentStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

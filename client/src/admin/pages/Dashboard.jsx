import { useEffect, useState } from "react";
import { getDashboardOverview } from "../services/AdminApi";
import { useAuth } from "@clerk/clerk-react";
import StatCard from "../components/StatCard";
import AdminTable from "../components/AdminTable";

const Dashboard = () => {
  const { getToken } = useAuth();

  // CHANGE: explicit loading & error states
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const res = await getDashboardOverview(token);
        setData(res);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ================== GUARDS (CRITICAL FIX) ==================

  // CHANGE: block render until data exists
  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  // CHANGE: absolute safety (prevents null access)
  if (!data) {
    return <p className="p-6 text-red-500">No data received</p>;
  }

  // ============================================================

  return (
    <div className="p-6 space-y-8">
      {/* ===== TOP STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`€${data.totalRevenue}`} />
        <StatCard title="Orders" value={data.totalOrders} />
        <StatCard title="Products" value={data.totalProducts} />
        <StatCard title="Users" value={data.totalUsers} />
      </div>

      {/* ===== SALES OVERVIEW ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Sales (Last 30 Days)</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Orders</th>
              <th className="p-2 border">Revenue (€)</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data.salesOverview) ? data.salesOverview : []).map(
              (day) => (
                <tr key={day._id}>
                  <td className="p-2 border">{day._id}</td>
                  <td className="p-2 border text-center">{day.orders}</td>
                  <td className="p-2 border text-center">€{day.revenue}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {/* ===== TOP PRODUCTS ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Top Products (by Sales)</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-left">Product</th>
              <th className="p-2 border text-center">Units Sold</th>
              <th className="p-2 border text-center">Revenue (€)</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data.topProducts) && data.topProducts.length > 0 ? (
              data.topProducts.map((p) => (
                <tr key={p.productId}>
                  <td className="p-2 border flex items-center gap-2">
                    <img
                      src={p.image || "/images/placeholder.png"}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) =>
                        (e.currentTarget.src = "/images/placeholder.png")
                      }
                    />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-2 border text-center">{p.totalSold}</td>
                  <td className="p-2 border text-center">€{p.revenue}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No top products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== RECENT ORDERS ===== */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>

        <AdminTable
          columns={[
            { key: "_id", label: "Order ID" },
            { key: "customerFirstName", label: "Customer" },
            { key: "totalPrice", label: "Total (€)" },
            { key: "status", label: "Status" },
            { key: "createdAt", label: "Date" },
          ]}
          data={(Array.isArray(data.recentOrders) ? data.recentOrders : []).map(
            (o) => ({
              ...o,
              customerFirstName: `${o.customerFirstName} ${o.customerLastName}`,
              createdAt: new Date(o.createdAt).toLocaleDateString(),
            }),
          )}
        />
      </div>
    </div>
  );
};

export default Dashboard;

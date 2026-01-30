import { useEffect, useState } from "react";
import { getDashboardOverview } from "../services/AdminApi";
import { useAuth } from "@clerk/clerk-react";
import StatCard from "../components/StatCard";
import SalesOverview from "../components/SalesOverview";
import TopProductsTable from "../components/TopProductsTable";
import RecentOrdersTable from "../components/RecentOrdersTable";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { getToken } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Default date range = last 30 days
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        setToken(token);

        const res = await getDashboardOverview(token, {
          startDate,
          endDate,
        });

        setData(res);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [startDate, endDate]);

  const [range, setRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      const res = await getDashboardOverview(token, range);
      setData(res);
    };
    load();
  }, [range]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-64">
        <Loader2 className="w-12 h-12 animate-spin text-black mb-4" />
        <span className="text-black font-medium text-lg">
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="p-6 text-red-500">No data received</p>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* ===== TOP STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`€${data.totalRevenue.toFixed(2)}`}
        />
        <StatCard title="Orders" value={data.totalOrders} />
        <StatCard title="Products" value={data.totalProducts} />
        <StatCard title="Users" value={data.totalUsers} />
      </div>
      {/* Sales chart */}
      <SalesOverview salesData={data.salesOverview} onDateChange={setRange} />

      {/* ===== TOP PRODUCTS ===== */}
      <TopProductsTable products={data.topProducts} />

      {/* ===== RECENT ORDERS ===== */}
      <RecentOrdersTable orders={data.recentOrders} />
    </div>
  );
};

export default Dashboard;

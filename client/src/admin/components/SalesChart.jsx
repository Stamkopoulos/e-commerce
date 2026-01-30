import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ MAKE SURE the function starts HERE
const SalesChart = ({ data }) => {
  const chartData = data.map((d) => ({
    date: d._id,
    revenue: d.revenue,
    orders: d.orders,
  }));

  // ✅ return is INSIDE the function
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dataKey="orders"
          stroke="#16a34a"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// ✅ MAKE SURE this exists
export default SalesChart;

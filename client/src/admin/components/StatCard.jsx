export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>

      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

import React from "react";
import StatCard from "../components/StatCard";

const UsersStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6">
      <StatCard title="Total Users" value={stats.totalUsers} />
      <StatCard title="Customers" value={stats.customers} />
      <StatCard title="Admins" value={stats.admins} />
      <StatCard title="Blocked Users" value={stats.blockedUsers} />
    </div>
  );
};

export default UsersStats;

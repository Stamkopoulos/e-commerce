import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AdminTable from "../components/AdminTable";
import StatCard from "../components/StatCard";
import {
  getAdminUsers,
  getAdminUserStats,
  updateUser,
  deleteUser,
} from "../services/AdminApi";

const Users = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  // Load user stats
  const loadStats = async () => {
    const token = await getToken();
    const data = await getAdminUserStats(token);
    setStats(data);
  };

  // Load users
  const loadUsers = async () => {
    const token = await getToken();
    const data = await getAdminUsers(token);
    setUsers(data);
  };

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    const token = await getToken();
    await updateUser(id, { role }, token);
    loadUsers();
    loadStats(); // update stats after change
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    const token = await getToken();
    await deleteUser(id, token);
    loadUsers();
    loadStats(); // update stats after delete
  };

  if (!stats) return <p>Loading...</p>;

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "actions", label: "Actions" },
  ];

  const data = users.map((u) => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    role: (
      <select
        value={u.role}
        onChange={(e) => handleRoleChange(u._id, e.target.value)}
        className="border p-1"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    ),
    actions: (
      <button className="text-red-600" onClick={() => handleDelete(u._id)}>
        Delete
      </button>
    ),
  }));

  return (
    <div className="p-4 space-y-4">
      <div className="p-4 grid grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Customers" value={stats.customers} />
        <StatCard title="Admins" value={stats.admins} />
        <StatCard title="Blocked Users" value={stats.blockedUsers} />
      </div>

      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <AdminTable columns={columns} data={data} />
    </div>
  );
};

export default Users;

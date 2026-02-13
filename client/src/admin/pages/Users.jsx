import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

import UsersStats from "../components/UsersStats";
import SearchBox from "../components/SearchBox";
import UsersTable from "../components/UsersTable";
import EditUser from "../components/EditUser";

import {
  getAdminUsers,
  getAdminUserStats,
  updateUser,
  deleteUser,
} from "../services/AdminApi";

const Users = () => {
  const { getToken } = useAuth();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "";

  const loadStats = async () =>
    setStats(await getAdminUserStats(await getToken()));
  const loadUsers = async () => setUsers(await getAdminUsers(await getToken()));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([loadStats(), loadUsers()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRoleChange = async (id, role, user) => {
    const token = await getToken();
    await updateUser(id, { role }, token);
    loadUsers();
    loadStats();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    const token = await getToken();
    await deleteUser(id, token);
    loadUsers();
    loadStats();
  };

  const handleUpdateUser = async (updatedUser) => {
    const token = await getToken();
    await updateUser(
      updatedUser._id,
      { name: updatedUser.name, role: updatedUser.role },
      token,
    );
    loadUsers(); // refresh table
    loadStats(); // refresh stats
  };

  const filteredUsers = users.filter((u) => {
    const value = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(value) ||
      u.email?.toLowerCase().includes(value) ||
      u._id?.toLowerCase().includes(value) ||
      u.clerkId?.toLowerCase().includes(value) ||
      formatDate(u.createdAt).toLowerCase().includes(value)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  return (
    <div className="w-full space-y-6 my-8 mx-auto">
      <UsersStats stats={stats} />

      <Card className="mx-6 gap-0">
        <CardHeader className="border-b">
          <SearchBox search={search} setSearch={setSearch} />
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <UsersTable
            users={currentUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            formatDate={formatDate}
            onEditUser={(user) => {
              setSelectedUser(user);
              setEditUserOpen(true);
            }}
            onDeleteUser={handleDelete}
            onRoleChange={handleRoleChange}
          />
        </CardContent>
      </Card>

      {editUserOpen && (
        <Sheet open={editUserOpen} onOpenChange={setEditUserOpen}>
          <EditUser
            user={selectedUser}
            onClose={() => setEditUserOpen(false)}
            onUpdate={handleUpdateUser}
          />
        </Sheet>
      )}
    </div>
  );
};

export default Users;

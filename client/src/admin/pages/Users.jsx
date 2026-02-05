// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuth } from "@clerk/clerk-react";

// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Sheet } from "@/components/ui/sheet";

// import {
//   Search,
//   Plus,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// import StatCard from "../components/StatCard";
// import EditUser from "../components/EditUser";

// import {
//   getAdminUsers,
//   getAdminUserStats,
//   updateUser,
//   deleteUser,
// } from "../services/AdminApi";

// import { toast } from "sonner";

// const Users = () => {
//   const { getToken } = useAuth();

//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({});
//   const [search, setSearch] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [editUserOpen, setEditUserOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const itemsPerPage = 6;

//   // Format date to DD/MM/YYYY
//   const formatDate = (date) =>
//     date ? new Date(date).toLocaleDateString("en-GB") : "";

//   // Load stats
//   const loadStats = async () => {
//     const token = await getToken();
//     setStats(await getAdminUserStats(token));
//   };

//   // Load users
//   const loadUsers = async () => {
//     const token = await getToken();
//     setUsers(await getAdminUsers(token));
//   };

//   useEffect(() => {
//     loadStats();
//     loadUsers();
//   }, []);

//   const handleRoleChange = async (id, role) => {
//     const token = await getToken();
//     await updateUser(id, { role }, token);
//     loadUsers();
//     loadStats();
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete user?")) return;
//     const token = await getToken();
//     await deleteUser(id, token);
//     loadUsers();
//     loadStats();
//   };

//   // This is called when EditUser submits
//   const handleUpdateUser = async (updatedUser) => {
//     const token = await getToken();
//     await updateUser(
//       updatedUser._id,
//       { name: updatedUser.name, role: updatedUser.role },
//       token,
//     );
//     loadUsers(); // refresh table
//     loadStats(); // refresh stats
//   };

//   const filteredUsers = users.filter((u) => {
//     const value = search.toLowerCase();
//     return (
//       u.name?.toLowerCase().includes(value) ||
//       u.email?.toLowerCase().includes(value) ||
//       formatDate(u.createdAt).toLowerCase().includes(value)
//     );
//   });

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const currentUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   const openEditSheet = (user) => {
//     setSelectedUser(user);
//     setEditUserOpen(true);
//   };

//   return (
//     <div className="w-full  space-y-6 my-8 mx-auto">
//       {/* STATS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6">
//         <StatCard title="Total Users" value={stats.totalUsers} />
//         <StatCard title="Customers" value={stats.customers} />
//         <StatCard title="Admins" value={stats.admins} />
//         <StatCard title="Blocked Users" value={stats.blockedUsers} />
//       </div>

//       <Card className="mx-6">
//         <CardHeader className="border-b">
//           <div className="flex flex-wrap gap-4 items-center">
//             <div className="relative max-w-sm flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
//               <Input
//                 placeholder="Search user"
//                 className="pl-10"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <div className="ml-auto flex gap-2">
//               <Button size="sm">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add User
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0 overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b bg-muted/50">
//                 <th className="p-4 text-left">User</th>
//                 <th className="p-4 text-left">Created At</th>
//                 <th className="p-4 text-left">Role</th>
//                 <th className="p-4 text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {currentUsers.map((user) => (
//                 <tr key={user._id} className="border-b">
//                   <td className="p-4">
//                     <div className="font-medium">{user.name}</div>
//                     <div className="text-sm text-muted-foreground">
//                       {user.email}
//                     </div>
//                   </td>

//                   <td className="p-4">
//                     <div className="font-medium">
//                       {formatDate(user.createdAt)}
//                     </div>
//                   </td>

//                   <td className="p-4">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="w-[90px] justify-between"
//                         >
//                           <span className="capitalize">{user.role}</span>
//                           <ChevronDown className="ml-1 h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         {["admin", "user"].map((role) => (
//                           <DropdownMenuItem
//                             key={role}
//                             onClick={() => {
//                               handleRoleChange(user._id, role);
//                               {
//                                 toast("Role updated successfully", {
//                                   description: `${user.name} is now a ${role}.`,
//                                   action: {
//                                     label: "Undo",
//                                     onClick: () =>
//                                       handleRoleChange(user._id, user.role),
//                                   },
//                                 });
//                               }
//                             }}
//                           >
//                             {role}
//                           </DropdownMenuItem>
//                         ))}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </td>

//                   <td className="p-4">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="outline" size="sm">
//                           Actions
//                           <ChevronDown className="ml-1 h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent>
//                         <DropdownMenuItem
//                           onClick={() => {
//                             openEditSheet(user);
//                           }}
//                         >
//                           Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           className="text-destructive"
//                           onClick={() => {
//                             handleDelete(user._id);
//                             toast("User deleted", {
//                               description: `${user.name} has been removed.`,
//                             });
//                           }}
//                         >
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div className="flex justify-between p-4 border-t">
//             <span className="text-sm">
//               Page {currentPage} of {totalPages}
//             </span>
//             <div className="flex gap-2">
//               <Button
//                 size="icon"
//                 variant="outline"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((p) => p - 1)}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="icon"
//                 variant="outline"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Edit User Sheet */}
//       {selectedUser && (
//         <Sheet open={editUserOpen} onOpenChange={setEditUserOpen}>
//           <EditUser
//             user={selectedUser}
//             onClose={() => setEditUserOpen(false)}
//             onUpdate={handleUpdateUser} // <-- pass this to handle submit
//           />
//         </Sheet>
//       )}
//     </div>
//   );
// };

// export default Users;

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";

import UsersStats from "../components/UsersStats";
import UserSearch from "../components/UserSearch";
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

      <Card className="mx-6">
        <CardHeader className="border-b">
          <UserSearch search={search} setSearch={setSearch} />
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

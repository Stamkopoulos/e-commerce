// import { useEffect, useState } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import AdminTable from "../components/AdminTable";
// import StatCard from "../components/StatCard";
// import {
//   getAdminUsers,
//   getAdminUserStats,
//   updateUser,
//   deleteUser,
// } from "../services/AdminApi";

// const Users = () => {
//   const { getToken } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState(null);

//   // Load user stats
//   const loadStats = async () => {
//     const token = await getToken();
//     const data = await getAdminUserStats(token);
//     setStats(data);
//   };

//   // Load users
//   const loadUsers = async () => {
//     const token = await getToken();
//     const data = await getAdminUsers(token);
//     setUsers(data);
//   };

//   useEffect(() => {
//     loadStats();
//     loadUsers();
//   }, []);

//   const handleRoleChange = async (id, role) => {
//     const token = await getToken();
//     await updateUser(id, { role }, token);
//     loadUsers();
//     loadStats(); // update stats after change
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete user?")) return;
//     const token = await getToken();
//     await deleteUser(id, token);
//     loadUsers();
//     loadStats(); // update stats after delete
//   };

//   if (!stats) return <p>Loading...</p>;

//   const columns = [
//     { key: "name", label: "Name" },
//     { key: "email", label: "Email" },
//     { key: "role", label: "Role" },
//     { key: "actions", label: "Actions" },
//   ];

// const data = users.map((u) => ({
//   _id: u._id,
//   name: u.name,
//   email: u.email,
//   role: (
//     <select
//       value={u.role}
//       onChange={(e) => handleRoleChange(u._id, e.target.value)}
//       className="border p-1"
//     >
//       <option value="user">User</option>
//       <option value="admin">Admin</option>
//     </select>
//   ),
//   actions: (
//     <button className="text-red-600" onClick={() => handleDelete(u._id)}>
//       Delete
//     </button>
//   ),
// }));

//   return (
//     <div className="p-4 space-y-4">
//       <div className="p-4 grid grid-cols-4 gap-4">
//         <StatCard title="Total Users" value={stats.totalUsers} />
//         <StatCard title="Customers" value={stats.customers} />
//         <StatCard title="Admins" value={stats.admins} />
//         <StatCard title="Blocked Users" value={stats.blockedUsers} />
//       </div>

//       <h1 className="text-xl font-semibold mb-4">Users</h1>
//       <AdminTable columns={columns} data={data} />
//     </div>
//   );
// };

// export default Users;

// "use client";

// import React, { useEffect, useState } from "react";

// import { useAuth } from "@clerk/clerk-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Search,
//   Filter,
//   Download,
//   Plus,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import StatCard from "../components/StatCard";
// import EditUser from "../components/EditUser";
// import { Sheet } from "@/components/ui/sheet";

// import {
//   getAdminUsers,
//   getAdminUserStats,
//   updateUser,
//   deleteUser,
// } from "../services/AdminApi";

// // const usersData = [
// //   {
// //     id: "1",
// //     name: "John Doe",
// //     email: "john.doe@email.com",
// //     role: "admin",
// //     joinedDate: "Jan 10, 2024",
// //   },
// //   {
// //     id: "2",
// //     name: "Jane Smith",
// //     email: "jane.smith@email.com",
// //     role: "user",
// //     joinedDate: "Feb 5, 2024",
// //   },
// //   {
// //     id: "3",
// //     name: "Michael Brown",
// //     email: "michael.brown@email.com",
// //     role: "user",
// //     joinedDate: "Mar 18, 2024",
// //   },
// //   {
// //     id: "4",
// //     name: "Emily Wilson",
// //     email: "emily.wilson@email.com",
// //     role: "admin",
// //     joinedDate: "Apr 2, 2024",
// //   },
// //   {
// //     id: "5",
// //     name: "Chris Johnson",
// //     email: "chris.johnson@email.com",
// //     role: "user",
// //     joinedDate: "Apr 20, 2024",
// //   },
// //   {
// //     id: "6",
// //     name: "Sophia Martinez",
// //     email: "sophia.m@email.com",
// //     role: "user",
// //     joinedDate: "May 1, 2024",
// //   },
// //   {
// //     id: "7",
// //     name: "Daniel Lee",
// //     email: "daniel.lee@email.com",
// //     role: "user",
// //     joinedDate: "May 12, 2024",
// //   },
// // ];

// const Datatable1 = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editUserOpen, setEditUserOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const { getToken } = useAuth();

//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState(null);

//   // Load user stats
//   const loadStats = async () => {
//     const token = await getToken();
//     const data = await getAdminUserStats(token);
//     setStats(data);
//   };

//   // Load users
//   const loadUsers = async () => {
//     const token = await getToken();
//     const data = await getAdminUsers(token);
//     setUsers(data);
//   };

//   useEffect(() => {
//     loadStats();
//     loadUsers();
//   }, []);

//   const handleRoleChange = async (id, role) => {
//     const token = await getToken();
//     await updateUser(id, { role }, token);
//     loadUsers();
//     loadStats(); // update stats after change
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete user?")) return;
//     const token = await getToken();
//     await deleteUser(id, token);
//     loadUsers();
//     loadStats(); // update stats after delete
//   };

//   const usersData = users.map((u) => ({
//     _id: u._id,
//     name: u.name,
//     email: u.email,
//     role: (
//       <select
//         value={u.role}
//         onChange={(e) => handleRoleChange(u._id, e.target.value)}
//         className="border p-1"
//       >
//         <option value="user">User</option>
//         <option value="admin">Admin</option>
//       </select>
//     ),
//     actions: (
//       <button className="text-red-600" onClick={() => handleDelete(u._id)}>
//         Delete
//       </button>
//     ),
//   }));

//   const itemsPerPage = 6;

//   const totalPages = Math.ceil(usersData.length / itemsPerPage);

//   const currentUsers = usersData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   // const [search, setSearch] = useState("");

//   // /* ===== LOAD USERS ===== */
//   // const loadUsers = async () => {
//   //   const token = await getToken();
//   //   const res = await getAdminUsers({ search }, token);
//   //   setUsers(res.results || []);
//   // };

//   // useEffect(() => {
//   //   loadUsers();
//   // }, [search]);

//   // const stats = {
//   //   totalUsers: usersData.length,
//   //   admins: usersData.filter((u) => u.role === "admin").length,
//   //   user: usersData.filter((u) => u.role === "user").length,
//   // };

//   const openEditSheet = (user) => {
//     setSelectedUser(user);
//     setEditUserOpen(true);
//   };

//   return (
//     <div className="w-full max-w-6xl space-y-6 my-8 mx-auto">
//       {/* STATS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-8">
//         <StatCard title="Total Users" value={stats.totalUsers} />
//         <StatCard title="Admins" value={stats.admins} />
//         <StatCard title="Editors" value={stats.editors} />
//         <StatCard title="Viewers" value={stats.viewers} />
//       </div>

//       {/* TABLE */}
//       <Card className="pb-0 gap-0 mx-6 md:mx-8">
//         <CardHeader className="border-b border-border gap-0">
//           <div className="flex flex-col sm:flex-row items-center gap-4">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search user"
//                 className="pl-10"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>

//             <div className="sm:ml-auto flex items-center gap-2 flex-wrap justify-center">
//               <Button variant="outline" size="sm">
//                 <Filter className="h-4 w-4 mr-2" />
//                 Filter
//               </Button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm">
//                     <Download className="h-4 w-4 mr-2" />
//                     Export
//                     <ChevronDown className="h-4 w-4 ml-2" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>Export as CSV</DropdownMenuItem>
//                   <DropdownMenuItem>Export as Excel</DropdownMenuItem>
//                   <DropdownMenuItem>Export as PDF</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <Button size="sm" className="bg-primary">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add User
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b bg-muted/50">
//                   <th className="p-4 text-left">User</th>
//                   <th className="p-4 text-left">Role</th>
//                   {/* <th className="p-4 text-left">Last Login</th> */}
//                   {/* <th className="p-4 text-left">Two-Step</th> */}
//                   <th className="p-4 text-left">Joined</th>
//                   <th className="p-4 text-left">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentUsers.map((user) => (
//                   <tr key={user.id} className="border-b hover:bg-muted/30">
//                     <td className="p-4">
//                       <div className="font-medium">{user.name}</div>
//                       <div className="text-sm text-muted-foreground">
//                         {user.email}
//                       </div>
//                     </td>
//                     <td className="p-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="sm">
//                             {user.role} <ChevronDown className="ml-1 h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem>Admin</DropdownMenuItem>
//                           <DropdownMenuItem>User</DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>

//                     <td className="p-4">{user.joinedDate}</td>
//                     <td className="p-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="sm">
//                             Actions <ChevronDown className="ml-1 h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem onClick={() => openEditSheet(user)}>
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem>View</DropdownMenuItem>
//                           <DropdownMenuItem className="text-destructive">
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-between p-4 border-t">
//             <span className="text-sm text-muted-foreground">
//               Showing {(currentPage - 1) * itemsPerPage + 1}–
//               {Math.min(currentPage * itemsPerPage, usersData.length)} of{" "}
//               {usersData.length}
//             </span>

//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(currentPage - 1)}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <Button
//                     key={page}
//                     size="icon"
//                     variant={currentPage === page ? "default" : "outline"}
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </Button>
//                 ),
//               )}

//               <Button
//                 variant="outline"
//                 size="icon"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(currentPage + 1)}
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
//           />
//         </Sheet>
//       )}
//     </div>
//   );
// };

// export default Datatable1;
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet } from "@/components/ui/sheet";

import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import StatCard from "../components/StatCard";
import EditUser from "../components/EditUser";

import {
  getAdminUsers,
  getAdminUserStats,
  updateUser,
  deleteUser,
} from "../services/AdminApi";

const Datatable1 = () => {
  const { getToken } = useAuth();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const itemsPerPage = 6;

  // Format date to DD/MM/YYYY
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "";

  // Load stats
  const loadStats = async () => {
    const token = await getToken();
    setStats(await getAdminUserStats(token));
  };

  // Load users
  const loadUsers = async () => {
    const token = await getToken();
    setUsers(await getAdminUsers(token));
  };

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
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

  // This is called when EditUser submits
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

  const openEditSheet = (user) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  return (
    <div className="w-full max-w-6xl space-y-6 my-8 mx-auto">
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Customers" value={stats.customers} />
        <StatCard title="Admins" value={stats.admins} />
        <StatCard title="Blocked Users" value={stats.blockedUsers} />
      </div>

      <Card className="mx-6">
        <CardHeader className="border-b">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                placeholder="Search user"
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="ml-auto flex gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Created At</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>

                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-[90px] justify-between"
                        >
                          <span className="capitalize">{user.role}</span>
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["admin", "user"].map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => handleRoleChange(user._id, role)}
                          >
                            {role}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openEditSheet(user)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between p-4 border-t">
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Sheet */}
      {selectedUser && (
        <Sheet open={editUserOpen} onOpenChange={setEditUserOpen}>
          <EditUser
            user={selectedUser}
            onClose={() => setEditUserOpen(false)}
            onUpdate={handleUpdateUser} // <-- pass this to handle submit
          />
        </Sheet>
      )}
    </div>
  );
};

export default Datatable1;

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AdminTable from "../components/AdminTable";
import ProductForm from "../components/ProductForm";
import StatCard from "../components/StatCard";
import {
  getAdminProducts,
  getAdminProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/AdminApi";

const Products = () => {
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  /* ===== LOAD STATS ===== */
  useEffect(() => {
    const loadStats = async () => {
      const token = await getToken();
      const res = await getAdminProductStats(token);
      setStats(res);
    };
    loadStats();
  }, []);

  /* ===== LOAD PRODUCTS ===== */
  const loadProducts = async () => {
    const token = await getToken();
    const res = await getAdminProducts({ search }, token);
    setProducts(res.results || []);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  /* ===== ACTIONS ===== */
  const handleCreate = async (data) => {
    const token = await getToken();
    await createProduct(data, token);
    setCreating(false);
    loadProducts();
  };

  const handleUpdate = async (data) => {
    const token = await getToken();
    await updateProduct(editing._id, data, token);
    setEditing(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    const token = await getToken();
    await deleteProduct(id, token);
    loadProducts();
  };

  if (!stats) return <p className="p-4">Loading...</p>;

  /* ===== TABLE ===== */
  const columns = [
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "actions", label: "Actions" },
  ];

  const data = products.map((p) => ({
    _id: p._id,
    image: (
      <img
        src={p.variants?.[0]?.images?.[0] || "/placeholder.png"}
        className="w-10 h-10 object-cover rounded"
      />
    ),
    name: p.name,
    category: p.category,
    price: `€${p.price}`,
    stock: p.variants?.[0]?.sizes?.reduce((sum, s) => sum + s.quantity, 0) || 0,
    actions: (
      <div className="flex gap-2">
        <button className="text-blue-600" onClick={() => setEditing(p)}>
          Edit
        </button>
        <button className="text-red-600" onClick={() => handleDelete(p._id)}>
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-4 space-y-4">
      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="In Stock" value={stats.inStock} />
        <StatCard title="Low Stock" value={stats.lowStock} />
        <StatCard title="Out of Stock" value={stats.outOfStock} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border p-2 rounded"
        />

        <button
          onClick={() => setCreating(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + New Product
        </button>
      </div>

      {/* TABLE */}
      <AdminTable columns={columns} data={data} />

      {/* FORMS */}
      {creating && (
        <ProductForm
          onSubmit={handleCreate}
          onClose={() => setCreating(false)}
        />
      )}

      {editing && (
        <ProductForm
          initialData={editing}
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default Products;

// "use client";

// import React, { useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   getPaginationRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   flexRender,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { CheckCircle, Loader2, MoreVertical } from "lucide-react";

// // Dummy data
// const dummyData = [
//   {
//     id: 1,
//     header: "Introduction",
//     type: "Table of Contents",
//     status: "Done",
//     target: "100",
//     limit: "120",
//     reviewer: "Eddie Lake",
//   },
//   {
//     id: 2,
//     header: "Executive Summary",
//     type: "Executive Summary",
//     status: "In Progress",
//     target: "200",
//     limit: "250",
//     reviewer: "Jamik Tashpulatov",
//   },
//   {
//     id: 3,
//     header: "Technical Approach",
//     type: "Technical Approach",
//     status: "Not Started",
//     target: "150",
//     limit: "180",
//     reviewer: "",
//   },
//   {
//     id: 4,
//     header: "Design",
//     type: "Design",
//     status: "Done",
//     target: "120",
//     limit: "130",
//     reviewer: "",
//   },
// ];

// export const columns = [
//   {
//     accessorKey: "header",
//     header: "Header",
//     cell: ({ row }) => <span>{row.original.header}</span>,
//   },
//   {
//     accessorKey: "type",
//     header: "Type",
//     cell: ({ row }) => <Badge variant="outline">{row.original.type}</Badge>,
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <Badge variant="outline">
//         {row.original.status === "Done" ? (
//           <CheckCircle className="text-green-500 inline mr-1" />
//         ) : (
//           <Loader2 className="animate-spin inline mr-1" />
//         )}
//         {row.original.status}
//       </Badge>
//     ),
//   },
//   {
//     accessorKey: "target",
//     header: "Target",
//     cell: ({ row }) => (
//       <Input defaultValue={row.original.target} className="w-16 text-right" />
//     ),
//   },
//   {
//     accessorKey: "limit",
//     header: "Limit",
//     cell: ({ row }) => (
//       <Input defaultValue={row.original.limit} className="w-16 text-right" />
//     ),
//   },
//   {
//     accessorKey: "reviewer",
//     header: "Reviewer",
//     cell: ({ row }) => (
//       <Select>
//         <SelectTrigger>
//           <SelectValue
//             placeholder={row.original.reviewer || "Assign reviewer"}
//           />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//           <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
//         </SelectContent>
//       </Select>
//     ),
//   },
//   {
//     id: "actions",
//     cell: () => (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="icon">
//             <MoreVertical />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuItem>Edit</DropdownMenuItem>
//           <DropdownMenuItem>Copy</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     ),
//   },
// ];

// export default function DataTable() {
//   const [tableData] = useState(dummyData);

//   const table = useReactTable({
//     data: tableData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     getRowId: (row) => row.id?.toString() || Math.random().toString(),
//   });

//   return (
//     <Table>
//       <TableHeader>
//         {table.getHeaderGroups().map((headerGroup) => (
//           <TableRow key={headerGroup.id}>
//             {headerGroup.headers.map((header) => (
//               <TableHead key={header.id} colSpan={header.colSpan}>
//                 {flexRender(
//                   header.column.columnDef.header,
//                   header.getContext(),
//                 )}
//               </TableHead>
//             ))}
//           </TableRow>
//         ))}
//       </TableHeader>
//       <TableBody>
//         {table.getRowModel().rows.length ? (
//           table.getRowModel().rows.map((row) => (
//             <TableRow key={row.id}>
//               {row.getVisibleCells().map((cell) => (
//                 <TableCell key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))
//         ) : (
//           <TableRow>
//             <TableCell colSpan={columns.length} className="text-center">
//               No results
//             </TableCell>
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// }

//------------------------------------------------
//------------------------------------------------
//------------------------------------------------

// "use client";

// import React, { useState } from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import AddProduct from "../components/AddProduct"; // make sure this is the Sheet version
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
// import { cn } from "@/lib/utils";

// const usersData = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john.doe@email.com",
//     role: "Admin",
//     lastLogin: "2 hours ago",
//     twoStep: true,
//     joinedDate: "Jan 10, 2024",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     email: "jane.smith@email.com",
//     role: "Editor",
//     lastLogin: "Yesterday",
//     twoStep: false,
//     joinedDate: "Feb 5, 2024",
//   },
//   {
//     id: "3",
//     name: "Michael Brown",
//     email: "michael.brown@email.com",
//     role: "Viewer",
//     lastLogin: "3 days ago",
//     twoStep: true,
//     joinedDate: "Mar 18, 2024",
//   },
//   {
//     id: "4",
//     name: "Emily Wilson",
//     email: "emily.wilson@email.com",
//     role: "Admin",
//     lastLogin: "1 week ago",
//     twoStep: false,
//     joinedDate: "Apr 2, 2024",
//   },
//   {
//     id: "5",
//     name: "Chris Johnson",
//     email: "chris.johnson@email.com",
//     role: "Editor",
//     lastLogin: "5 minutes ago",
//     twoStep: true,
//     joinedDate: "Apr 20, 2024",
//   },
//   {
//     id: "6",
//     name: "Sophia Martinez",
//     email: "sophia.m@email.com",
//     role: "Viewer",
//     lastLogin: "Today",
//     twoStep: false,
//     joinedDate: "May 1, 2024",
//   },
//   {
//     id: "7",
//     name: "Daniel Lee",
//     email: "daniel.lee@email.com",
//     role: "Editor",
//     lastLogin: "2 weeks ago",
//     twoStep: true,
//     joinedDate: "May 12, 2024",
//   },
// ];

// const Datatable1 = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const itemsPerPage = 6;
//   const totalPages = Math.ceil(usersData.length / itemsPerPage);
//   const currentUsers = usersData.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   return (
//     <div className="w-full max-w-6xl space-y-6 my-8 mx-auto">
//       <Card className="pb-0 gap-0 mx-6 md:mx-8">
//         <CardHeader className="border-b border-border gap-0">
//           <div className="flex flex-col sm:flex-row items-center gap-4">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search user" className="pl-10" />
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

//               <Button
//                 size="sm"
//                 className="bg-primary"
//                 onClick={() => setShowAddProduct(true)}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Product
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border bg-muted/50">
//                   <th className="p-4"></th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground uppercase">
//                     User
//                   </th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground uppercase">
//                     Role
//                   </th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground uppercase text-nowrap">
//                     Last Login
//                   </th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground uppercase text-nowrap">
//                     Two-Step
//                   </th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground uppercase text-nowrap">
//                     Joined Date
//                   </th>
//                   <th className="p-4 text-left text-sm font-medium text-muted-foreground uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentUsers.map((user) => (
//                   <tr
//                     key={user.id}
//                     className="border-b border-border hover:bg-muted/30 transition-colors"
//                   >
//                     <td className="p-4"></td>
//                     <td className="p-4">
//                       {user.name} <br />
//                       <span className="text-sm text-muted-foreground">
//                         {user.email}
//                       </span>
//                     </td>
//                     <td className="p-4 text-sm text-muted-foreground">
//                       {user.role}
//                     </td>
//                     <td className="p-4 text-sm font-medium text-nowrap">
//                       {user.lastLogin}
//                     </td>
//                     <td className="p-4 text-center">
//                       {user.twoStep ? (
//                         <Badge className="bg-green-50 text-green-700 border-green-200">
//                           Enabled
//                         </Badge>
//                       ) : (
//                         <span className="text-sm text-muted-foreground">-</span>
//                       )}
//                     </td>
//                     <td className="p-4 text-sm text-muted-foreground text-nowrap">
//                       {user.joinedDate}
//                     </td>
//                     <td className="p-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="sm">
//                             Actions <ChevronDown className="ml-1 h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => setShowAddProduct(true)}
//                           >
//                             Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem>View Details</DropdownMenuItem>
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
//           <div className="flex items-center justify-between p-4 border-t border-border">
//             <div className="text-sm text-muted-foreground">
//               Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//               {Math.min(currentPage * itemsPerPage, usersData.length)} of{" "}
//               {usersData.length} entries
//             </div>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <Button
//                     key={page}
//                     variant={currentPage === page ? "default" : "outline"}
//                     size="icon"
//                     onClick={() => setCurrentPage(page)}
//                     className={cn(currentPage === page && "bg-primary")}
//                   >
//                     {page}
//                   </Button>
//                 ),
//               )}

//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() =>
//                   setCurrentPage(Math.min(totalPages, currentPage + 1))
//                 }
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add Product Sheet */}
//       <AddProduct open={showAddProduct} onOpenChange={setShowAddProduct} />
//     </div>
//   );
// };

// export default Datatable1;

//------------------------------------------------
//------------------------------------------------
//------------------------------------------------

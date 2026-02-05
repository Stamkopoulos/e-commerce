// "use client";

// import {
//   CheckCircle,
//   FileTextIcon,
//   Loader2,
//   PauseIcon,
//   PlayIcon,
//   Trash2Icon,
// } from "lucide-react";
// import { useState } from "react";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// const tasks = [
//   {
//     id: "TASK-001",
//     customer: "John Doe",
//     email: "johndoe@gmail.com",
//     total: "350.00",
//     status: "pending",
//     payment: "paid",
//     date: "5/2/2026",
//   },
//   {
//     id: "TASK-002",
//     customer: "Michael Torres",
//     email: "michael.torres@gmail.com",
//     total: "220.00",
//     status: "completed",
//     payment: "paid",
//     date: "20/3/2024",
//   },
//   {
//     id: "TASK-003",
//     customer: "Emma Rodriguez",
//     email: "emma.rodriguez@gmail.com",
//     total: "480.00",
//     status: "pending",
//     payment: "unpaid",
//     date: "22/3/2024",
//   },
//   {
//     id: "TASK-004",
//     customer: "James Wilson",
//     email: "james.wilson@gmail.com",
//     total: "310.00",
//     status: "in-progress",
//     payment: "paid",
//     date: "28/3/2024",
//   },
//   {
//     id: "TASK-005",
//     customer: "Olivia Martinez",
//     email: "olivia.martinez@gmail.com",
//     total: "600.00",
//     status: "blocked",
//     payment: "unpaid",
//     date: "24/3/2024",
//   },
//   {
//     id: "TASK-006",
//     customer: "Lucas Anderson",
//     email: "lucas.anderson@gmail.com",
//     total: "150.00",
//     status: "pending",
//     payment: "paid",
//     date: "30/3/2024",
//   },
//   {
//     id: "TASK-007",
//     customer: "Sophia Taylor",
//     email: "sophia.taylor@gmail.com",
//     total: "520.00",
//     status: "completed",
//     payment: "paid",
//     date: "19/3/2024",
//   },
// ];

// function getStatusBadge(status) {
//   switch (status) {
//     case "pending":
//       return (
//         <Badge className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border-0">
//           Pending
//         </Badge>
//       );
//     case "in-progress":
//       return (
//         <Badge className="bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-0">
//           In Progress
//         </Badge>
//       );
//     case "completed":
//       return (
//         <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0">
//           Completed
//         </Badge>
//       );
//     case "blocked":
//       return (
//         <Badge className="bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-0">
//           Blocked
//         </Badge>
//       );
//     default:
//       return <Badge variant="secondary">{status}</Badge>;
//   }
// }

// function getPaymentBadge(payment) {
//   switch (payment) {
//     case "paid":
//       return (
//         <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0">
//           Paid
//         </Badge>
//       );
//     case "unpaid":
//       return (
//         <Badge className="bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-0">
//           Unpaid
//         </Badge>
//       );
//     default:
//       return <Badge variant="secondary">{payment}</Badge>;
//   }
// }

// export default function OrdersTable() {
//   const [pendingAction, setPendingAction] = useState(null);

//   const handleAction = (task, actionType) => {
//     setPendingAction({ id: task.id, type: actionType });

//     setTimeout(() => {
//       setPendingAction(null);
//       console.log(`Action "${actionType}" completed for task:`, task.title);
//     }, 1000);
//   };

//   const renderTaskRow = (task) => {
//     return (
//       <TableRow key={task.id} className="hover:bg-muted/50">
//         <TableCell className="h-16 px-4 font-medium">{task.customer}</TableCell>
//         <TableCell className="h-16 px-4 text-sm text-muted-foreground">
//           {task.email}
//         </TableCell>
//         <TableCell className="h-16 px-4">€{task.total}</TableCell>
//         <TableCell className="h-16 px-4 text-sm text-muted-foreground">
//           {task.date}
//         </TableCell>
//         <TableCell className="h-16 px-4">
//           {getStatusBadge(task.status)}
//         </TableCell>
//         <TableCell className="h-16 px-4">
//           {getPaymentBadge(task.payment)}
//         </TableCell>
//         <TableCell className="h-16 px-4">
//           <TooltipProvider>
//             <div className="flex gap-1">
//               {/* View */}
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     size="icon"
//                     variant="outline"
//                     className="h-8 w-8"
//                     disabled={pendingAction === task.id}
//                     onClick={() => handleAction(task.id, "view")}
//                   >
//                     <FileTextIcon className="size-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>View Order</TooltipContent>
//               </Tooltip>

//               {/* Delete */}
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     size="icon"
//                     variant="outline"
//                     className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
//                     disabled={pendingAction === task.id}
//                     onClick={() => handleAction(task.id, "delete")}
//                   >
//                     {pendingAction === task.id ? (
//                       <Loader2 className="size-4 animate-spin" />
//                     ) : (
//                       <Trash2Icon className="size-4" />
//                     )}
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>Delete Order</TooltipContent>
//               </Tooltip>
//             </div>
//           </TooltipProvider>
//         </TableCell>
//       </TableRow>
//     );
//   };

//   return (
//     <div className="rounded-lg border bg-card w-[95%]">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="px-4">Customer</TableHead>
//             <TableHead className="px-4">Email</TableHead>
//             <TableHead className="px-4">Total</TableHead>
//             <TableHead className="px-4">Date</TableHead>
//             <TableHead className="px-4">Status</TableHead>
//             <TableHead className="px-4">Payment Status</TableHead>
//             <TableHead className="px-4">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>{tasks.map(renderTaskRow)}</TableBody>
//       </Table>
//     </div>
//   );
// }

"use client";

import { FileTextIcon, Loader2, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getStatusBadge(status) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border-0">
          Pending
        </Badge>
      );
    case "shipped":
      return (
        <Badge className="bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-0">
          Shipped
        </Badge>
      );
    case "delivered":
      return (
        <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0">
          Delivered
        </Badge>
      );
    case "blocked":
      return (
        <Badge className="bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-0">
          Blocked
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getPaymentBadge(payment) {
  switch (payment) {
    case "paid":
      return (
        <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0">
          Paid
        </Badge>
      );
    case "unpaid":
      return (
        <Badge className="bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-0">
          Unpaid
        </Badge>
      );
    default:
      return <Badge variant="secondary">{payment}</Badge>;
  }
}

export default function OrdersTable({ data = [], onDelete }) {
  const [pendingAction, setPendingAction] = useState(null);

  const handleAction = async (orderId, actionType) => {
    setPendingAction(orderId);

    if (actionType === "delete" && onDelete) {
      await onDelete(orderId);
    }

    setPendingAction(null);
  };

  const renderOrderRow = (order) => (
    <TableRow key={order._id} className="hover:bg-muted/50">
      <TableCell className="h-16 px-4 font-medium">{order.customer}</TableCell>
      <TableCell className="h-16 px-4 text-sm text-muted-foreground">
        {order.email}
      </TableCell>
      <TableCell className="h-16 px-4">€{order.total}</TableCell>
      <TableCell className="h-16 px-4 text-sm text-muted-foreground">
        {order.date}
      </TableCell>
      <TableCell className="h-16 px-4">
        <DropdownMenu className="p-0 m-0 ">
          <DropdownMenuTrigger className="p-0 m-0">
            <div className="cursor-pointer">{getStatusBadge(order.status)}</div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="p-0">
            {["pending", "shipped", "delivered", "blocked"].map(
              (statusOption) => (
                <DropdownMenuItem
                  key={statusOption}
                  className="cursor-pointer px-1 py-1 flex items-center justify-center"
                  onClick={() => handleStatusChange(order._id, statusOption)}
                >
                  {getStatusBadge(statusOption)}
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

      <TableCell className="h-16 px-4">
        {getPaymentBadge(order.paymentStatus)}
      </TableCell>
      <TableCell className="h-16 px-4">
        <TooltipProvider>
          <div className="flex gap-1">
            {/* View */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={pendingAction === order._id}
                  onClick={() => handleAction(order._id, "view")}
                >
                  <FileTextIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Order</TooltipContent>
            </Tooltip>

            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                  disabled={pendingAction === order._id}
                  onClick={() => handleAction(order._id, "delete")}
                >
                  {pendingAction === order._id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Order</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="rounded-lg border bg-card w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="px-4">Customer</TableHead>
            <TableHead className="px-4">Email</TableHead>
            <TableHead className="px-4">Total</TableHead>
            <TableHead className="px-4">Date</TableHead>
            <TableHead className="px-4">Status</TableHead>
            <TableHead className="px-4">Payment</TableHead>
            <TableHead className="px-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{data.map(renderOrderRow)}</TableBody>
      </Table>
    </div>
  );
}

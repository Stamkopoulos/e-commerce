"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  Truck,
  Loader2,
  MoreHorizontal,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function RecentOrdersTable({ orders = [] }) {
  const recentOrders = orders.slice(0, 5); // only 5 most recent

  if (!recentOrders.length) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
        <p>No recent orders.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const lower = status.toLowerCase();
    if (lower === "delivered") {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 px-2 capitalize"
        >
          <CheckCircle className="w-4 h-4 text-green-500" />
          {status}
        </Badge>
      );
    } else if (lower === "pending") {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 px-2 capitalize"
        >
          <Loader2 className="w-4 h-4 text-blue-500 " />
          {status}
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 px-2 capitalize"
        >
          <Truck className="w-4 h-4 text-yellow-500" />
          {status}
        </Badge>
      );
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    const lower = paymentStatus.toLowerCase();
    return lower === "paid" ? (
      <Badge variant="outline" className="flex items-center gap-1 px-2">
        <CreditCard className="w-4 h-4 text-green-500" />
        Paid
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1 px-2">
        <CreditCard className="w-4 h-4 text-red-500" />
        Unpaid
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Orders</CardTitle>
        <CardDescription>
          <span className="">Recent orders from customers</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 max-h-[400px] overflow-auto px-2 pt-4 sm:px-6 sm:pt-6 ">
        <Table className="overflow-hidden rounded-lg border border-black">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="text-center">Total (€)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((o) => (
              <TableRow key={o._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {o.customerFirstName} {o.customerLastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {o.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">
                  €{o.totalPrice.toLocaleString()}
                </TableCell>
                <TableCell>{getStatusBadge(o.status)}</TableCell>
                <TableCell>{getPaymentBadge(o.paymentStatus)}</TableCell>
                <TableCell>
                  {new Date(o.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(o._id)}
                      >
                        Copy order ID
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a href="/admin/orders">View order</a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

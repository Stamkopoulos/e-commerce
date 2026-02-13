"use client";

import { useState } from "react";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  Loader2,
  Truck,
  CheckCircle,
  CreditCard,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EditOrder({
  orderId,
  trigger,
  onStatusChange,
  onPaymentChange,
}) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [itemsWithImages, setItemsWithImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const { getToken } = useAuth();

  // Fetch order and product images when sheet opens
  const handleOpen = async () => {
    const token = await getToken();

    setOpen(true);
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const orderData = res.data;
      setOrder(orderData);

      const itemsWithImages = await Promise.all(
        (orderData.items || []).map(async (item) => {
          if (!item.productId) return item;

          try {
            const productRes = await axios.get(
              `http://localhost:5000/api/products/${item.productId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );

            const product = productRes.data;
            const variant = product.variants?.find(
              (v) => v.color === item.color,
            );
            const sizeObj = variant?.sizes?.find((s) => s.size === item.size);

            return {
              ...item,
              images: variant?.images || [],
              stock: sizeObj?.quantity || 0,
            };
          } catch (err) {
            console.error("Failed to fetch product for item", item, err);
            return item;
          }
        }),
      );

      setItemsWithImages(itemsWithImages);
    } catch (err) {
      console.error(err);
      setError("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  // Copy helper
  const handleCopy = (value, fieldName) => {
    navigator.clipboard.writeText(value);
    toast.success(`${fieldName} copied to clipboard`);
  };

  const handleStatusChange = async (orderId, status) => {
    setOrder((prev) => ({ ...prev, status }));
    if (onStatusChange) {
      await onStatusChange(orderId, status);
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    setOrder((prev) => ({ ...prev, paymentStatus }));

    if (onPaymentChange) await onPaymentChange(orderId, paymentStatus);
  };

  // --- UI helpers ---
  function getStatusBadge(status) {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border-0 w-28 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-yellow-500 " />
            Pending
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-0 w-28 flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0 w-28 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Delivered
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
          <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0 w-28 flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4 text-green-500" />
            Paid
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-0 w-28 flex items-center justify-center gap-2">
            <MoreHorizontal className="w-4 h-4 text-red-500" />
            Unpaid
          </Badge>
        );
      default:
        return <Badge variant="secondary">{payment}</Badge>;
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger({ onClick: handleOpen })}</SheetTrigger>

      {/* Inspired layout: full-height, scrollable, form-like spacing */}
      <SheetContent
        side="right"
        className="h-full overflow-y-auto !w-[95vw] sm:!w-[70vw] md:!w-[50vw] lg:!w-[40vw] xl:!w-[30vw] 2xl:!w-[25vw] !max-w-none
  "
      >
        <SheetHeader>
          <SheetTitle>Edit Order</SheetTitle>
          <SheetDescription>
            {order?._id && `Order ID: ${order._id}`}
          </SheetDescription>
        </SheetHeader>

        <form className="pl-3 pr-1">
          {/* Basic summary row */}
          <div className=" gap-4">
            {/* 🔽 CHANGED: grid layout for better placement */}

            <div className="space-y-2 text-sm mb-2">
              {/* 🔽 CHANGED: bigger text + spacing */}
              <Label className="font-semibold">Customer</Label>
              <p className="text-base text-muted-foreground mb-0">
                {order?.customerFirstName || "—"}{" "}
                {order?.customerLastName || "—"}
              </p>
              {/* 🔹 User ID copy */}
              {order?.user && (
                <div className="flex items-center gap-2   ">
                  <Label className="text-muted-foreground">User ID:</Label>
                  <span className="text-sm text-muted-foreground">
                    {typeof order.user === "string"
                      ? order.user
                      : order.user?._id || "-"}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="w-5 h-5 p-0"
                          onClick={() =>
                            handleCopy(
                              typeof order.user === "string"
                                ? order.user
                                : order.user?._id,
                              "User ID",
                            )
                          }
                        >
                          <Copy className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy User ID</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              <Label className="font-semibold mt-3">Email</Label>
              <p className="text-base text-muted-foreground">
                {order?.email || "—"}
              </p>

              <Label className="font-semibold mt-3">Phone</Label>
              <p className="text-base text-muted-foreground">
                {order?.phone || "—"}
              </p>
            </div>

            <div className="space-y-2 text-sm border-t pt-4">
              <Label className="font-semibold">Shipping Address</Label>
              <p className="text-base text-muted-foreground">
                {order?.address || "—"}, {order?.zipCode || "—"}
              </p>

              <Label className="font-semibold">Created At</Label>
              <p className="text-base text-muted-foreground">
                {order?.createdAt
                  ? format(new Date(order.createdAt), "PPP p")
                  : "—"}
              </p>
            </div>
          </div>

          {/* Status / Payment */}

          <div className="gap-4 mt-2 flex-wrap flex space-x-4 py-4 border-t">
            <div>
              <FormLabel className="font-semibold">Status</FormLabel>
              <div className="m-2">
                {/* {getStatusBadge(order?.status || "pending")} */}
                <DropdownMenu className="p-0 m-0 ">
                  <DropdownMenuTrigger className="p-0 m-0">
                    <div className="cursor-pointer">
                      {getStatusBadge(order?.status)}
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="p-0">
                    {["pending", "shipped", "delivered"].map((statusOption) => (
                      <DropdownMenuItem
                        key={statusOption}
                        className="cursor-pointer px-1 py-1 flex items-center justify-center"
                        onClick={() =>
                          handleStatusChange(order?._id, statusOption)
                        }
                      >
                        {getStatusBadge(statusOption)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div>
              <FormLabel className="font-semibold">Payment</FormLabel>
              <div className="m-2">
                {/* {getPaymentBadge(order?.paymentStatus || "unpaid")} */}
                <DropdownMenu className="p-0 m-0">
                  <DropdownMenuTrigger className="p-0 m-0">
                    <div className="cursor-pointer">
                      {getPaymentBadge(order?.paymentStatus)}
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="p-0">
                    {["paid", "unpaid"].map((paymentOption) => (
                      <DropdownMenuItem
                        key={paymentOption}
                        className="cursor-pointer px-1 py-1 flex items-center justify-center"
                        onClick={() =>
                          handlePaymentStatusChange(order?._id, paymentOption)
                        }
                      >
                        {getPaymentBadge(paymentOption)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Items section */}
          <div>
            <h3 className="font-semibold text-lg mb-2 border-t">Items</h3>
            <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-3">
              {loading && (
                <p className="text-center text-gray-500">Loading items...</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {!loading && itemsWithImages.length > 0
                ? itemsWithImages.map((item, idx) => (
                    <div
                      key={item.productId || `${idx}-${item.name}`}
                      className="flex items-center gap-3 p-3  border-1 rounded-md shadow-sm"
                    >
                      {/* Product ID + copy */}
                      {item.productId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="w-5 h-5 p-0"
                                onClick={() =>
                                  handleCopy(item.productId, "Product ID")
                                }
                              >
                                <Copy className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy Product ID</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <div className="flex items-center justify-start gap-3 ">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-md border"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500">
                            No Image
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.name}
                            {"  "}
                            <span className="text-sm text-gray-500">
                              x{item.quantity}
                            </span>
                          </span>

                          {/* Size & Color (swatch if possible) */}
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3">
                            <span>
                              Size:{" "}
                              <strong className="ml-1">
                                {item.size || "-"}
                              </strong>
                            </span>
                            <span className="flex items-center gap-2">
                              <span>Color:</span>
                              {/* color swatch if color looks like a CSS color, else text pill */}
                              {item.color ? (
                                // try to render a square swatch; if color is not a CSS valid color it'll just be a background fallback
                                <span
                                  className="w-5 h-5 rounded-full border"
                                  style={{ backgroundColor: item.color }}
                                  title={item.color}
                                />
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                              <span className="text-xs text-gray-500">
                                {item.color || ""}
                              </span>
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Unit: €{(item.price || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))
                : !loading && (
                    <p className="text-gray-500 text-center">
                      No items in this order.
                    </p>
                  )}
            </div>

            <div className="mt-3 flex justify-between items-center ">
              <div className="font-bold text-lg ">
                Total: €{(order?.totalPrice || 0).toFixed(2)}
              </div>
            </div>
            {/* Submit / Cancel */}
            <div className="flex justify-end mb-2 mt-8 p-4">
              {/* <Button type="submit">Save changes</Button> */}
              <SheetClose asChild>
                <Button className="w-20 " variant="outline">
                  Back
                </Button>
              </SheetClose>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

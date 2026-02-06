// "use client";

// import { useState } from "react";
// import axios from "axios";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";

// export default function EditOrder({ orderId, trigger, token }) {
//   const [open, setOpen] = useState(false);
//   const [order, setOrder] = useState(null);
//   const [itemsWithImages, setItemsWithImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch order and product images when sheet opens
//   const handleOpen = async () => {
//     setOpen(true);
//     setLoading(true);
//     setError("");

//     try {
//       // 1️⃣ Fetch the order
//       const res = await axios.get(
//         `http://localhost:5000/api/orders/${orderId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       const orderData = res.data;
//       setOrder(orderData);

//       // 2️⃣ Fetch product images for each item
//       const itemsWithImages = await Promise.all(
//         orderData.items.map(async (item) => {
//           if (!item.productId) return item;

//           try {
//             const productRes = await axios.get(
//               `http://localhost:5000/api/products/${item.productId}`,
//               {
//                 headers: { Authorization: `Bearer ${token}` },
//               },
//             );

//             const product = productRes.data;

//             // Match the variant by color
//             const variant = product.variants.find(
//               (v) => v.color === item.color,
//             );

//             // Match size if needed
//             const sizeObj = variant?.sizes.find((s) => s.size === item.size);

//             return {
//               ...item,
//               images: variant?.images || [],
//               stock: sizeObj?.quantity || 0,
//             };
//           } catch (err) {
//             console.error("Failed to fetch product for item", item, err);
//             return item;
//           }
//         }),
//       );

//       setItemsWithImages(itemsWithImages);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load order.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>{trigger({ onClick: handleOpen })}</SheetTrigger>

//       <SheetContent className="w-[600px]">
//         <SheetHeader>
//           <SheetTitle>Order Details</SheetTitle>
//           <SheetDescription>Order id: {order?._id || "N/A"}</SheetDescription>
//         </SheetHeader>

//         <div className="space-y-4 mt-4">
//           {loading && <p>Loading...</p>}
//           {error && <p className="text-red-500">{error}</p>}

//           {!loading && order && (
//             <>
//               {/* Customer Info */}
//               <div>
//                 <h3 className="font-semibold">Customer Info</h3>
//                 <p>
//                   {order.customerFirstName || "—"}{" "}
//                   {order.customerLastName || "—"}
//                 </p>
//                 <p>{order.email || "—"}</p>
//                 <p>{order.phone || "—"}</p>
//                 <p>
//                   {order.address || "—"}, {order.zipCode || "—"}
//                 </p>
//               </div>

//               {/* Items */}
//               <div>
//                 <h3 className="font-semibold">Items</h3>
//                 <div className="space-y-2 max-h-64 overflow-y-auto">
//                   {itemsWithImages.length > 0 ? (
//                     itemsWithImages.map((item) => (
//                       <div
//                         key={item.productId || Math.random()}
//                         className="flex justify-between border-b py-1 items-center gap-2"
//                       >
//                         <div className="flex items-center gap-2">
//                           {item.images?.[0] && (
//                             <img
//                               src={item.images[0]}
//                               alt={item.name}
//                               className="w-12 h-12 object-cover rounded"
//                             />
//                           )}
//                           <span>
//                             {item.name} ({item.color || "-"} /{" "}
//                             {item.size || "-"}) x{item.quantity}
//                           </span>
//                         </div>
//                         <span>€{(item.price * item.quantity).toFixed(2)}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No items in this order.</p>
//                   )}
//                 </div>
//                 <p className="font-bold mt-2">
//                   Total: €{(order.totalPrice || 0).toFixed(2)}
//                 </p>
//               </div>

//               {/* Status, Payment, Date */}
//               <div className="flex gap-4">
//                 <div>
//                   <h3 className="font-semibold">Status</h3>
//                   <Badge>{order.status || "pending"}</Badge>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Payment</h3>
//                   <Badge>{order.paymentStatus || "unpaid"}</Badge>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Order Date</h3>
//                   <p>
//                     {order.createdAt
//                       ? format(new Date(order.createdAt), "PPP p")
//                       : "—"}
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <SheetFooter>
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Close
//           </Button>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// }

// "use client";

// import { useState } from "react";
// import axios from "axios";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import {
//   Loader2,
//   Truck,
//   CheckCircle,
//   CreditCard,
//   MoreHorizontal,
// } from "lucide-react";

// export default function EditOrder({ orderId, trigger, token }) {
//   const [open, setOpen] = useState(false);
//   const [order, setOrder] = useState(null);
//   const [itemsWithImages, setItemsWithImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch order and product images when sheet opens
//   const handleOpen = async () => {
//     setOpen(true);
//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/orders/${orderId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       const orderData = res.data;
//       setOrder(orderData);

//       const itemsWithImages = await Promise.all(
//         orderData.items.map(async (item) => {
//           if (!item.productId) return item;

//           try {
//             const productRes = await axios.get(
//               `http://localhost:5000/api/products/${item.productId}`,
//               { headers: { Authorization: `Bearer ${token}` } },
//             );

//             const product = productRes.data;
//             const variant = product.variants.find(
//               (v) => v.color === item.color,
//             );
//             const sizeObj = variant?.sizes.find((s) => s.size === item.size);

//             return {
//               ...item,
//               images: variant?.images || [],
//               stock: sizeObj?.quantity || 0,
//             };
//           } catch (err) {
//             console.error("Failed to fetch product for item", item, err);
//             return item;
//           }
//         }),
//       );

//       setItemsWithImages(itemsWithImages);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load order.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- UI helpers ---
//   function getStatusBadge(status) {
//     switch (status) {
//       case "pending":
//         return (
//           <Badge className="bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border-0 w-24 flex items-center justify-center gap-1">
//             <Loader2 className="w-4 h-4 text-yellow-500" />
//             Pending
//           </Badge>
//         );
//       case "shipped":
//         return (
//           <Badge className="bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-0 w-24 flex items-center justify-center gap-1">
//             <Truck className="w-4 h-4 text-blue-500" />
//             Shipped
//           </Badge>
//         );
//       case "delivered":
//         return (
//           <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0 w-24 flex items-center justify-center gap-1">
//             <CheckCircle className="w-4 h-4 text-green-500" />
//             Delivered
//           </Badge>
//         );
//       default:
//         return <Badge variant="secondary">{status}</Badge>;
//     }
//   }

//   function getPaymentBadge(payment) {
//     switch (payment) {
//       case "paid":
//         return (
//           <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-0 w-24 flex items-center justify-center gap-1">
//             <CreditCard className="w-4 h-4 text-green-500" />
//             Paid
//           </Badge>
//         );
//       case "unpaid":
//         return (
//           <Badge className="bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-0 w-24 flex items-center justify-center gap-1">
//             <MoreHorizontal className="w-4 h-4 text-red-500" />
//             Unpaid
//           </Badge>
//         );
//       default:
//         return <Badge variant="secondary">{payment}</Badge>;
//     }
//   }

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>{trigger({ onClick: handleOpen })}</SheetTrigger>

//       <SheetContent className="w-[650px] max-w-full">
//         <SheetHeader>
//           <SheetTitle>Order Details</SheetTitle>
//           <SheetDescription>Order ID: {order?._id || "N/A"}</SheetDescription>
//         </SheetHeader>

//         <div className="space-y-6 mt-4">
//           {loading && <p className="text-center text-gray-500">Loading...</p>}
//           {error && <p className="text-red-500 text-center">{error}</p>}

//           {!loading && order && (
//             <>
//               {/* Customer Info */}
//               <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-1">
//                 <h3 className="font-semibold text-lg">Customer Info</h3>
//                 <p>
//                   {order.customerFirstName || "—"}{" "}
//                   {order.customerLastName || "—"}
//                 </p>
//                 <p>{order.email || "—"}</p>
//                 <p>{order.phone || "—"}</p>
//                 <p>
//                   {order.address || "—"}, {order.zipCode || "—"}
//                 </p>
//               </div>

//               {/* Items */}
//               <div>
//                 <h3 className="font-semibold text-lg mb-2">Items</h3>
//                 <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
//                   {itemsWithImages.length > 0 ? (
//                     itemsWithImages.map((item) => (
//                       <div
//                         key={item.productId || Math.random()}
//                         className="flex justify-between items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded-md shadow-sm"
//                       >
//                         <div className="flex items-center gap-3">
//                           {item.images?.[0] && (
//                             <img
//                               src={item.images[0]}
//                               alt={item.name}
//                               className="w-14 h-14 object-cover rounded-md border"
//                             />
//                           )}
//                           <div className="flex flex-col">
//                             <span className="font-medium">
//                               {item.name} x{item.quantity}
//                             </span>
//                             <span className="text-sm text-gray-500 dark:text-gray-400">
//                               Size: {item.size || "-"} | Color:{" "}
//                               {item.color || "-"}
//                             </span>
//                           </div>
//                         </div>
//                         <span className="font-semibold">
//                           €{(item.price * item.quantity).toFixed(2)}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-500 text-center">
//                       No items in this order.
//                     </p>
//                   )}
//                 </div>
//                 <p className="mt-3 font-bold text-right text-lg">
//                   Total: €{(order.totalPrice || 0).toFixed(2)}
//                 </p>
//               </div>

//               {/* Status, Payment, Date */}
//               <div className="flex flex-wrap gap-6 mt-4">
//                 <div className="flex flex-col gap-1">
//                   <h3 className="font-semibold text-sm">Status</h3>
//                   {getStatusBadge(order.status || "pending")}
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <h3 className="font-semibold text-sm">Payment</h3>
//                   {getPaymentBadge(order.paymentStatus || "unpaid")}
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <h3 className="font-semibold text-sm">Order Date</h3>
//                   <p>
//                     {order.createdAt
//                       ? format(new Date(order.createdAt), "PPP p")
//                       : "—"}
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <SheetFooter className="mt-6 flex justify-end">
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Close
//           </Button>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// }

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
import { format } from "date-fns";
import {
  Loader2,
  Truck,
  CheckCircle,
  CreditCard,
  MoreHorizontal,
  Copy,
} from "lucide-react";

export default function EditOrder({ orderId, trigger, token }) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [itemsWithImages, setItemsWithImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState(null);

  // Fetch order and product images when sheet opens
  const handleOpen = async () => {
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
  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(null);
    }
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
      <SheetContent className="h-full overflow-y-auto w-[680px] max-w-full">
        <SheetHeader>
          <SheetTitle>Edit Order</SheetTitle>
          <SheetDescription>
            Edit and inspect order details below
          </SheetDescription>
        </SheetHeader>

        <form className="space-y-4 mt-2 px-4 pb-6">
          {/* Order ID (copyable) */}
          {order?._id && (
            <FormItem>
              <FormLabel>Order ID</FormLabel>
              <div className="flex gap-2 items-center">
                <Input value={order._id} readOnly className="flex-1" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopy(order._id, "OrderID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {copiedField === "OrderID" && (
                  <span className="text-green-500 text-sm">Copied!</span>
                )}
              </div>
            </FormItem>
          )}

          {/* Basic summary row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <h3 className="font-semibold">Customer</h3>
              <p className="text-sm">
                {order?.customerFirstName || "—"}{" "}
                {order?.customerLastName || "—"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order?.email || "—"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order?.phone || "—"}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <h3 className="font-semibold">Shipping</h3>
              <p className="text-sm">{order?.address || "—"}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order?.zipCode || "—"}
              </p>
            </div>
          </div>

          {/* Items section */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Items</h3>
            <div className="max-h-72 overflow-y-auto space-y-3 border rounded-lg p-3">
              {loading && (
                <p className="text-center text-gray-500">Loading items...</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}

              {!loading && itemsWithImages.length > 0
                ? itemsWithImages.map((item, idx) => (
                    <div
                      key={item.productId || `${idx}-${item.name}`}
                      className="flex justify-between items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-md shadow-sm"
                    >
                      <div className="flex items-center gap-3">
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
                            {item.name}{" "}
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

            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Shipping method: <strong>{order?.shippingMethod || "—"}</strong>
              </div>
              <div className="font-bold text-lg">
                Total: €{(order?.totalPrice || 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Status / Payment / Dates */}
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <FormLabel>Status</FormLabel>
              <div>{getStatusBadge(order?.status || "pending")}</div>
            </div>

            <div>
              <FormLabel>Payment</FormLabel>
              <div>{getPaymentBadge(order?.paymentStatus || "unpaid")}</div>
            </div>

            <div>
              <FormLabel>Created At</FormLabel>
              <div className="flex gap-2 items-center">
                <Input
                  value={
                    order?.createdAt
                      ? format(new Date(order.createdAt), "PPP p")
                      : "—"
                  }
                  readOnly
                  className="flex-1"
                />
                {order?.createdAt && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleCopy(order.createdAt, "CreatedAt")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {copiedField === "CreatedAt" && (
                      <span className="text-green-500 text-sm">Copied!</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </form>

        <SheetFooter className="px-4">
          <div className="w-full flex justify-between items-center gap-2">
            <div className="text-sm text-gray-600">
              <div>
                Order status: <strong>{order?.status || "—"}</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <SheetClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </SheetClose>

              {/* Example action button (no logic attached) */}
              <Button onClick={() => {}} disabled>
                Save changes
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

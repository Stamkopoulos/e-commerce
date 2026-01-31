// "use client";

// import React, { useState } from "react";
// import {
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";

// const EditUser = () => {
//   const [fullName, setFullName] = useState("John Doe");
//   const [email, setEmail] = useState("john.doe@gmail.com");
//   const [phone, setPhone] = useState("+1 234 5678");
//   const [address, setAddress] = useState("123 Main St");
//   const [city, setCity] = useState("New York");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({ fullName, email, phone, address, city });
//     alert("Form submitted! Check console.");
//   };

//   return (
//     <SheetContent>
//       <SheetHeader>
//         <SheetTitle className="mb-4">Edit User</SheetTitle>
//         <SheetDescription>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <FormItem>
//               <FormLabel>Full Name</FormLabel>
//               <Input
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//               />
//               <FormDescription>Enter user full name.</FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <FormDescription>Only admin can see your email.</FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>Phone</FormLabel>
//               <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
//               <FormDescription>
//                 Only admin can see your phone number (optional)
//               </FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>Address</FormLabel>
//               <Input
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//               <FormDescription>Enter user address (optional)</FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>City</FormLabel>
//               <Input value={city} onChange={(e) => setCity(e.target.value)} />
//               <FormDescription>Enter user city (optional)</FormDescription>
//             </FormItem>

//             <Button type="submit">Submit</Button>
//           </form>
//         </SheetDescription>
//       </SheetHeader>
//     </SheetContent>
//   );
// };

// export default EditUser;

//=====================================================
//=====================================================

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
//   SheetClose,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";

// const EditUser = ({ user, onClose }) => {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");

//   useEffect(() => {
//     if (user) {
//       setFullName(user.name || "");
//       setEmail(user.email || "");
//       setPhone(user.phone || "");
//       setAddress(user.address || "");
//       setCity(user.city || "");
//     }
//   }, [user]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedUser = { fullName, email, phone, address, city };
//     console.log("Updated User:", updatedUser);
//     alert("User updated! Check console.");
//     onClose(); // close the sheet after submit
//   };

//   return (
//     <SheetContent>
//       <SheetHeader>
//         <SheetTitle className="mb-4">Edit User</SheetTitle>
//         <SheetDescription>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <FormItem>
//               <FormLabel>Full Name</FormLabel>
//               <Input
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//               />
//               <FormDescription>Enter user full name.</FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <FormDescription>Only admin can see your email.</FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>Phone</FormLabel>
//               <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
//               <FormDescription>
//                 Only admin can see your phone number (optional)
//               </FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>Address</FormLabel>
//               <Input
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//               <FormDescription>Enter user address (optional)</FormDescription>
//             </FormItem>

//             <FormItem>
//               <FormLabel>City</FormLabel>
//               <Input value={city} onChange={(e) => setCity(e.target.value)} />
//               <FormDescription>Enter user city (optional)</FormDescription>
//             </FormItem>

//             <div className="flex gap-2">
//               <Button type="submit">Submit</Button>
//               <SheetClose asChild>
//                 <Button variant="outline" onClick={onClose}>
//                   Cancel
//                 </Button>
//               </SheetClose>
//             </div>
//           </form>
//         </SheetDescription>
//       </SheetHeader>
//     </SheetContent>
//   );
// };

// export default EditUser;

"use client";

import React, { useState, useEffect } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Copy } from "lucide-react";

const EditUser = ({ user = {}, onClose, onUpdate }) => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  // Copy notification state
  const [copiedField, setCopiedField] = useState("");

  // Format date to DD/MM/YYYY
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "";

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
    }
  }, [user]);

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 1500); // hide after 1.5s
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      _id: user._id,
      name,
      role,
      email,
    };

    if (onUpdate) {
      onUpdate(updatedUser); // call parent to update API
    }

    if (onClose) onClose(); // close sheet
  };

  return (
    <SheetContent className="h-full overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Edit User</SheetTitle>
        <SheetDescription>Edit user information below</SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2 px-4">
        {/* Name */}
        <FormItem>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormItem>

        {/* Email */}
        <FormItem>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} readOnly />
        </FormItem>

        {/* Role */}
        <FormItem>
          <FormLabel>Role</FormLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {role.charAt(0).toUpperCase() + role.slice(1)}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {["user", "admin"].map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </FormItem>

        {/* ID */}
        {user._id && (
          <FormItem>
            <FormLabel>ID</FormLabel>
            <div className="flex gap-2 items-center">
              <Input value={user._id} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCopy(user._id, "ID")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {copiedField === "ID" && (
                <span className="text-green-500 text-sm">Copied!</span>
              )}
            </div>
          </FormItem>
        )}

        {/* Clerk ID */}
        {user.clerkId && (
          <FormItem>
            <FormLabel>Clerk ID</FormLabel>
            <div className="flex gap-2 items-center">
              <Input value={user.clerkId} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCopy(user.clerkId, "ClerkID")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {copiedField === "ClerkID" && (
                <span className="text-green-500 text-sm">Copied!</span>
              )}
            </div>
          </FormItem>
        )}

        {/* Created At */}
        {user.createdAt && (
          <FormItem>
            <FormLabel>Created At</FormLabel>
            <div className="flex gap-2 items-center">
              <Input
                value={formatDate(user.createdAt)}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCopy(user.createdAt, "CreatedAt")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {copiedField === "CreatedAt" && (
                <span className="text-green-500 text-sm">Copied!</span>
              )}
            </div>
          </FormItem>
        )}

        {/* Updated At */}
        {user.updatedAt && (
          <FormItem>
            <FormLabel>Updated At</FormLabel>
            <div className="flex gap-2 items-center">
              <Input
                value={formatDate(user.updatedAt)}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCopy(user.updatedAt, "UpdatedAt")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              {copiedField === "UpdatedAt" && (
                <span className="text-green-500 text-sm">Copied!</span>
              )}
            </div>
          </FormItem>
        )}

        {/* Submit / Cancel */}
        <div className="flex gap-2 mt-4">
          <Button type="submit">Submit</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </div>
      </form>
    </SheetContent>
  );
};

export default EditUser;

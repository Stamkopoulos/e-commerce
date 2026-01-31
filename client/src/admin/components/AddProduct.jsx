"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Dummy data for categories, sizes, and colors
const dummyCategories = [
  { id: "1", name: "T-shirts", slug: "t-shirts" },
  { id: "2", name: "Shoes", slug: "shoes" },
  { id: "3", name: "Bags", slug: "bags" },
];
const sizes = ["S", "M", "L", "XL"];
const colors = ["red", "green", "blue"];

const AddProduct = ({ open, onOpenChange }) => {
  const [formValues, setFormValues] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    categorySlug: "",
    sizes: [],
    colors: [],
  });

  const handleChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleCheckboxChange = (field, value) => {
    const current = formValues[field] || [];
    if (current.includes(value)) {
      handleChange(
        field,
        current.filter((v) => v !== value),
      );
    } else {
      handleChange(field, [...current, value]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product submitted", formValues);
    alert("Product submitted! Check console.");
    onOpenChange(false); // close sheet
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Product</SheetTitle>
          <SheetDescription>
            Fill out the form below to add a new product.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4 px-4">
          {/* Name */}
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Input
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <FormDescription>Enter the product name.</FormDescription>
          </FormItem>

          {/* Short Description */}
          <FormItem>
            <FormLabel>Short Description</FormLabel>
            <Input
              value={formValues.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
            />
            <FormDescription>Enter a short description.</FormDescription>
          </FormItem>

          {/* Description */}
          <FormItem>
            <FormLabel>Description</FormLabel>
            <Input
              value={formValues.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <FormDescription>Enter a detailed description.</FormDescription>
          </FormItem>

          {/* Price */}
          <FormItem>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              value={formValues.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
            <FormDescription>Enter the product price.</FormDescription>
          </FormItem>

          {/* Category */}
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              value={formValues.categorySlug}
              onValueChange={(val) => handleChange("categorySlug", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {dummyCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the product category.</FormDescription>
          </FormItem>

          {/* Sizes */}
          <FormItem>
            <FormLabel>Sizes</FormLabel>
            <div className="grid grid-cols-4 gap-2 my-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formValues.sizes.includes(size)}
                    onChange={() => handleCheckboxChange("sizes", size)}
                  />
                  {size}
                </label>
              ))}
            </div>
            <FormDescription>Select available sizes.</FormDescription>
          </FormItem>

          {/* Colors */}
          <FormItem>
            <FormLabel>Colors</FormLabel>
            <div className="grid grid-cols-3 gap-2 my-2">
              {colors.map((color) => (
                <label key={color} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formValues.colors.includes(color)}
                    onChange={() => handleCheckboxChange("colors", color)}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {color}
                </label>
              ))}
            </div>
            <FormDescription>Select available colors.</FormDescription>
          </FormItem>

          <div className="flex gap-2 mt-4">
            <Button type="submit">Submit</Button>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddProduct;

import { useState } from "react";

const ProductForm = ({ initialData = {}, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || "",
    category: initialData.category || "",
    gender: initialData.gender || "men",
    variants: initialData.variants || [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded w-[400px] space-y-3"
      >
        <h2 className="text-lg font-semibold">
          {initialData._id ? "Edit Product" : "Create Product"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-black text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

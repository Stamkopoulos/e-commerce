import Product from "../models/Product.js";

export const decreaseStock = async (
  { productId, color, size, quantity },
  session = null
) => {
  const normalizedSize = size.toUpperCase();
  const colorRegex = new RegExp(`^${color}$`, "i");

  const result = await Product.findOneAndUpdate(
    {
      _id: productId,
      variants: {
        $elemMatch: {
          color: colorRegex,
          sizes: {
            $elemMatch: { size: normalizedSize, quantity: { $gte: quantity } },
          },
        },
      },
    },
    { $inc: { "variants.$[v].sizes.$[s].quantity": -quantity } },
    {
      arrayFilters: [{ "v.color": colorRegex }, { "s.size": normalizedSize }],
      new: true,
      session,
    }
  );
  console.log("DECREASE STOCK INPUT:", {
    productId,
    color,
    size,
    quantity,
  });

  if (!result) throw new Error("Not enough stock or product not found");
  return result;
};

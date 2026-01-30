import Product from "../models/Product.js";

export const decreaseStock = async (
  { productId, color, size, quantity },
  session = null,
) => {
  const normalizedSize = size.toUpperCase();
  const normalizedColor = color.toLowerCase();

  const result = await Product.findById(productId).session(session);
  if (!result) throw new Error("Product not found");

  const variant = result.variants.find(
    (v) => v.color.toLowerCase() === normalizedColor,
  );
  if (!variant) throw new Error("Color not available");

  const sizeObj = variant.sizes.find(
    (s) => s.size.toUpperCase() === normalizedSize,
  );
  if (!sizeObj) throw new Error("Size not available");

  if (!sizeObj.quantity || sizeObj.quantity < quantity)
    throw new Error("Not enough stock");

  sizeObj.quantity -= quantity;
  await result.save({ session });

  console.log("DECREASE STOCK INPUT:", {
    productId,
    color: normalizedColor,
    size: normalizedSize,
    quantity,
    remainingStock: sizeObj.quantity,
  });

  return result;
};

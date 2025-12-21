import Product from "../models/Product.js";

export const decreaseStock = async ({ productId, color, size, quantity }) => {
  const result = await Product.findOneAndUpdate(
    {
      _id: productId,
      "variants.color": color,
      "variants.sizes": {
        $elemMatch: {
          size: size.toUpperCase(),
          quantity: { $gte: quantity },
        },
      },
    },
    {
      $inc: {
        "variants.$[v].sizes.$[s].quantity": -quantity,
      },
    },
    {
      arrayFilters: [{ "v.color": color }, { "s.size": size.toUpperCase() }],
      new: true,
    }
  );

  if (!result) {
    throw new Error("Not enough stock or product not found");
  }

  return result;
};

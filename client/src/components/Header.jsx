import { Link } from "react-router-dom";

const products = [
  {
    id: "1",
    name: "Linen Oversized Shirt",
    price: 128,
    category: "women",
    image: "/minimalist-beige-linen-oversized-shirt-on-neutral-.jpg",
    images: [
      "/minimalist-beige-linen-oversized-shirt-front-view.jpg",
      "/minimalist-beige-linen-oversized-shirt-side-view.jpg",
      "/minimalist-beige-linen-oversized-shirt-detail.jpg",
    ],
    description:
      "Effortlessly elegant oversized shirt crafted from premium European linen. Perfect for layering or wearing solo.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige", "White", "Black"],
    featured: true,
    bestseller: true,
  },
  {
    id: "2",
    name: "Tailored Wool Trousers",
    price: 185,
    category: "women",
    image: "/minimal-gray-wool-tailored-trousers-fashion.jpg",
    images: [
      "/minimal-gray-wool-tailored-trousers-front.jpg",
      "/minimal-gray-wool-tailored-trousers-side.jpg",
    ],
    description:
      "Classic tailored trousers in soft wool blend. Features a high waist and relaxed leg for modern sophistication.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Gray", "Black", "Navy"],
    bestseller: true,
  },
];

function getBestsellerProducts() {
  return products.filter((p) => p.bestseller);
}

export default function Header() {
  const bestsellerProducts = getBestsellerProducts();

  return (
    <main>
      <section className="w-full min-h-screen flex-col justify-center items-center text-center p-8 flex">
        <div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8">
            Modern Essentials. Timeless Elegance.
          </h1>
          <p className="text-base md:text-lg lg:text-xl font-light">
            Modern essentials, thoughtfully curated for the conscious wardrobe.
          </p>
        </div>
        <Link
          to="/collections"
          className="inline-block bg-black text-white py-3 px-10 m-4 rounded-xl hover:bg-gray-800 transition"
        >
          View All Collections
        </Link>
      </section>
      {/* Best Sellers */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-2">
                Best Sellers
              </h2>
              <p className="text-muted-foreground">Our most-loved pieces</p>
            </div>
            {/* <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/shop">View All</Link>
            </Button> */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellerProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm md:text-base font-medium mb-1 group-hover:text-muted-foreground transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ${product.price}
                </p>
              </Link>
            ))}
          </div>
          {/* <Button variant="ghost" asChild className="md:hidden w-full mt-6">
            <Link href="/shop">View All</Link>
          </Button> */}
        </div>
      </section>
    </main>
  );
}

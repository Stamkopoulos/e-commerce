function Header (){
    return (
        <section className="w-full bg-gray-100 py-20 text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
                <p className="text-gray-700 text-lg mb-6">
                    Discover amazing products at the best prices.
                </p>
            <a href="/products" className="px-6 py-3 bg-black text-white rounded-lg">
                Shop Now
            </a>
        </section>

    //   <section className="max-w-6xl mx-auto px-4 py-16">
    //     <h2 className="text-3xl font-semibold text-center mb-10">Featured Products</h2>

    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    //       {featured.map((item) => (
    //         <ProductCard key={item.id} product={item} />
    //       ))}
    //     </div>

    //     <div className="text-center mt-12">
    //       <a 
    //         href="/products" 
    //         className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900"
    //         >
    //         View All Products
    //       </a>
    //     </div>
    //   </section>
        )
}

export default Header
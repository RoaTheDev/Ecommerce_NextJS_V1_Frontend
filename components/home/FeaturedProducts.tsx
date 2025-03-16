const FeaturedProducts = () => {
    const featuredProducts = [
        { id: 1, name: "Nature's Blessing Tee", price: 29.99, image: "/api/placeholder/200/250" },
        { id: 2, name: "Forest Guardian Hoodie", price: 49.99, image: "/api/placeholder/200/250" },
        { id: 3, name: "Woodland Explorer Cap", price: 19.99, image: "/api/placeholder/200/250" },
        { id: 4, name: "Mythical Creature Plushie", price: 34.99, image: "/api/placeholder/200/250" },
    ];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center text-[#212121]">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-64 overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 text-[#212121]">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#3A8C5C] font-bold">${product.price}</span>
                                    <button className="bg-[#5CBD7B] text-white p-2 rounded-full hover:bg-[#3A8C5C] transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <button className="bg-[#8B6E47] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#765c3d] transition-colors">View All Products</button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
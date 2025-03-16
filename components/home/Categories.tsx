const Categories = () => {
    return (
        <section className="py-16 bg-[#90D4A3] bg-opacity-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center text-[#212121]">Shop by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative rounded-lg overflow-hidden h-64 group">
                        <img src="/lib/api/placeholder/400/300" alt="Clothing" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent opacity-60"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                            <h3 className="text-white text-2xl font-bold mb-2">Clothing</h3>
                            <a href="#" className="text-white underline hover:text-[#5CBD7B] transition-colors">Shop Now</a>
                        </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden h-64 group">
                        <img src="/lib/api/placeholder/400/300" alt="Accessories" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent opacity-60"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                            <h3 className="text-white text-2xl font-bold mb-2">Accessories</h3>
                            <a href="#" className="text-white underline hover:text-[#5CBD7B] transition-colors">Shop Now</a>
                        </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden h-64 group">
                        <img src="/lib/api/placeholder/400/300" alt="Collectibles" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent opacity-60"></div>
                        <div className="absolute bottom-0 left-0 p-6">
                            <h3 className="text-white text-2xl font-bold mb-2">Collectibles</h3>
                            <a href="#" className="text-white underline hover:text-[#5CBD7B] transition-colors">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;
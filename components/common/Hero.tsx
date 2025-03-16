const Hero = () => {
    return (
        <section className="bg-gradient-to-br from-[#5CBD7B] to-[#3A8C5C] text-white">
            <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Natural Style for Nature Lovers</h1>
                    <p className="text-lg mb-8">Discover our new collection inspired by the beauty of nature and the magic of the forest.</p>
                    <div className="flex space-x-4">
                        <button className="bg-white text-[#3A8C5C] px-6 py-3 rounded-md font-semibold hover:bg-[#F6F2E9] transition-colors">Shop Now</button>
                        <button className="border-2 border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#3A8C5C] transition-colors">Learn More</button>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <img src="/lib/api/placeholder/500/400" alt="Hero" className="rounded-lg shadow-lg" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
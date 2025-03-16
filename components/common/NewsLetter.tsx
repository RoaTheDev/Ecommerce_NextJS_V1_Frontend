const Newsletter = () => {
    return (
        <section className="py-16 bg-[#3A8C5C] text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
                <p className="max-w-xl mx-auto mb-8">Subscribe to receive updates on new arrivals, special offers, and woodland wisdom.</p>
                <div className="flex flex-col sm:flex-row max-w-md mx-auto sm:space-x-4 space-y-4 sm:space-y-0">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-grow px-4 py-3 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-[#8B6E47]"
                    />
                    <button className="bg-[#8B6E47] px-6 py-3 rounded-md font-semibold hover:bg-[#765c3d] transition-colors">Subscribe</button>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
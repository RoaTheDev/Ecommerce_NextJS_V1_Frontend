import React, {useState} from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";

interface HeaderProps {
    setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({setCartOpen}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="bg-[#5CBD7B] text-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
                            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2"/>
                        </svg>
                        <span className="text-xl font-bold">Fauna Market</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className={`hover:text-[#F6F2E9] transition-colors relative ${
                                pathname === '/' ? 'font-bold' : ''
                            }`}
                        >
                            Home
                            {pathname === '/' && (
                                <div className="absolute h-1 w-full bg-[#F6F2E9] bottom-0 left-0 rounded-t-md -mb-4"/>
                            )}
                        </Link>
                        <Link
                            href="/product"
                            className={`hover:text-[#F6F2E9] transition-colors relative ${
                                pathname === '/product' ? 'font-bold' : ''
                            }`}
                        >
                            Shop
                            {pathname === '/product' && (
                                <div className="absolute h-1 w-full bg-[#F6F2E9] bottom-0 left-0 rounded-t-md -mb-4"/>
                            )}
                        </Link>
                        <Link
                            href="/collection"
                            className={`hover:text-[#F6F2E9] transition-colors relative ${
                                pathname === '/collection' ? 'font-bold' : ''
                            }`}
                        >
                            Collections
                            {pathname === '/collection' && (
                                <div className="absolute h-1 w-full bg-[#F6F2E9] bottom-0 left-0 rounded-t-md -mb-4"/>
                            )}
                        </Link>
                        <Link
                            href="/about"
                            className={`hover:text-[#F6F2E9] transition-colors relative ${
                                pathname === '/about' ? 'font-bold' : ''
                            }`}
                        >
                            About
                            {pathname === '/about' && (
                                <div className="absolute h-1 w-full bg-[#F6F2E9] bottom-0 left-0 rounded-t-md -mb-4"/>
                            )}
                        </Link>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="hover:text-[#F6F2E9] transition-colors relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                        <button
                            className="hover:text-[#F6F2E9] transition-colors relative"
                            onClick={() => setCartOpen(prev => !prev)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                            <span
                                className="absolute -top-2 -right-2 bg-[#8B6E47] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                        </button>
                        <button className="hover:text-[#F6F2E9] transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </button>
                        <button
                            className="md:hidden hover:text-[#F6F2E9] transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden pt-4 pb-3 space-y-2">
                        <Link
                            href="/"
                            className={`block hover:text-[#F6F2E9] transition-colors ${
                                pathname === '/' ? 'font-bold border-l-4 border-[#F6F2E9] pl-2' : ''
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/product"
                            className={`block hover:text-[#F6F2E9] transition-colors ${
                                pathname === '/product' ? 'font-bold border-l-4 border-[#F6F2E9] pl-2' : ''
                            }`}
                        >
                            Shop
                        </Link>
                        <Link
                            href="/collection"
                            className={`block hover:text-[#F6F2E9] transition-colors ${
                                pathname === '/collections' ? 'font-bold border-l-4 border-[#F6F2E9] pl-2' : ''
                            }`}
                        >
                            Collections
                        </Link>
                        <Link
                            href="/about"
                            className={`block hover:text-[#F6F2E9] transition-colors ${
                                pathname === '/about' ? 'font-bold border-l-4 border-[#F6F2E9] pl-2' : ''
                            }`}
                        >
                            About
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
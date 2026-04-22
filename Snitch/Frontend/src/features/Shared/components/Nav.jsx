import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const Nav = () => {
    const user = useSelector((state) => state.auth.user);
    const cartItems = useSelector((state) => state.cart.items);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Left Side: Brand Logo */}
                    <div className="shrink-0 flex items-center">
                        <Link to="/" className="group flex items-center gap-2">
                            <span className="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#ac2d00] transition-transform duration-300 group-hover:scale-105">
                                SNITCH
                            </span>
                            <div className="h-1 w-1 rounded-full bg-[#ac2d00] mt-2 animate-pulse"></div>
                        </Link>
                    </div>

                    {/* Right Side: Navigation & User Actions */}
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Home Icon Link */}
                        <Link
                            to="/"
                            className="p-2 text-gray-600 hover:text-[#ac2d00] hover:bg-gray-50 rounded-full transition-all duration-300 flex items-center gap-1 group"
                            title="Home"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0v-4a1 1 0 011-1h2a1 1 0 011 1v4"
                                />
                            </svg>
                        </Link>

                        {/* User Login Section */}
                        <div className="flex items-center gap-3 md:gap-4 border-l border-gray-100 pl-4 md:pl-8">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    {/* User Name */}
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Welcome back</span>
                                        <span className="text-sm font-semibold text-gray-800">{user.name || user.email.split('@')[0]}</span>
                                    </div>

                                    {/* Cart Icon (Only if logged in) */}
                                    <Link
                                        to="/cart"
                                        className="relative p-2 text-gray-600 hover:text-[#ac2d00] hover:bg-gray-50 rounded-full transition-all duration-300 group"
                                        title="Shopping Cart"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {cartItems.length > 0 && (
                                            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#ac2d00] text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </Link>

                                    {/* User Avatar Placeholder */}
                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#c83a07] p-[2px] cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                            <span className="text-xs font-bold text-[#ac2d00]">
                                                {(user.name || user.email).charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 md:gap-4">
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium text-gray-600 hover:text-[#ac2d00] transition-colors duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 md:px-6 md:py-2.5 text-sm font-bold text-white bg-[#ac2d00] rounded-full hover:bg-[#832000] shadow-lg shadow-[#ac2d00]/20 active:scale-95 transition-all duration-300"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;

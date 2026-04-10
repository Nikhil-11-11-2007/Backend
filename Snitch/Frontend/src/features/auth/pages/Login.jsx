import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';

export default function Login() {

    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        email: '', password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({
            email: form.email,
            password: form.password
        })

        navigate("/")
    }

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans bg-[#111111] text-[#E8E8E8]">
            {/* Left Image Panel */}
            <div className="hidden lg:block lg:w-1/2 relative bg-black">
                <img
                    src="https://images.unsplash.com/photo-1654514437330-69aa8be0e893?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Abstract dark environment"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-12">
                    <div className="w-10 h-10 bg-[#E8440A] rounded-lg mb-6 flex items-center justify-center shadow-lg shadow-[#E8440A]/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Snitch</h2>
                    <p className="text-gray-300 text-lg">Welcome back. Login to your account.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
                <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-xs sm:text-sm text-gray-400">
                    Don't have an account? <Link to="/register" className="text-[#E8440A] font-semibold hover:text-white transition-colors">Sign up</Link>
                </div>

                <div className="w-full max-w-md mx-auto">
                    {/* Mobile Logo */}
                    <div className="lg:hidden w-8 h-8 bg-[#E8440A] rounded-lg mb-6 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-400 mb-6 text-sm">Please enter your details to sign in.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email <span className="lowercase normal-case">Address</span></label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-[#181818] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8440A] transition-colors" placeholder="john@example.com" required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full bg-[#181818] border border-[#252525] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#E8440A] transition-colors" placeholder="••••••••" required />
                        </div>

                        <div className="flex items-center justify-end py-1">
                            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Forgot password?</a>
                        </div>

                        <button type="submit" className="w-full bg-[#E8440A] hover:bg-[#FF5722] text-white text-sm font-semibold rounded-xl py-3 mt-4 transition-all hover:shadow-[0_4px_16px_rgba(232,68,10,0.3)] hover:-translate-y-0.5 active:translate-y-0">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
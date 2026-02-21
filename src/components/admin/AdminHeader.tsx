'use client'
import { Bell, Search, Menu } from 'lucide-react'

export default function AdminHeader() {
    return (
        <header className="h-16 bg-oxford-blue border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
            {/* Left Box: Mobile Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden text-white/70 hover:text-white transition-colors">
                    <Menu size={24} />
                </button>

                <div className="relative hidden md:block w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input
                        type="text"
                        placeholder="Search students, leads, or universities (Press '/')..."
                        className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-white/30"
                    />
                </div>
            </div>

            {/* Right Box: Notifications & User */}
            <div className="flex items-center gap-6">
                <button className="relative text-white/70 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold text-white">Admin User</div>
                        <div className="text-xs text-gold">Super Admin</div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark border border-gold/30 flex items-center justify-center text-oxford-blue font-bold shadow-lg">
                        A
                    </div>
                </div>
            </div>
        </header>
    )
}

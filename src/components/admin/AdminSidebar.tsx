'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, PlaneTakeoff, CreditCard, Landmark, Settings, LogOut, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Student CRM', href: '/admin/students', icon: Users },
    { label: 'Lead Pipeline', href: '/admin/leads', icon: FileText },
    { label: 'Visa Tracking', href: '/admin/visas', icon: PlaneTakeoff },
    { label: 'Finance', href: '/admin/finance', icon: CreditCard },
    { label: 'Universities', href: '/admin/universities', icon: Landmark },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-oxford-blue-dark border-r border-white/10 h-screen flex flex-col hidden md:flex sticky top-0">
            {/* Logo Area */}
            <div className="p-6 border-b border-white/5">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-bold text-oxford-blue">
                        E
                    </div>
                    <div>
                        <div className="font-bold text-white tracking-wide text-sm">ERI PORTAL</div>
                        <div className="text-[10px] text-gold uppercase tracking-widest font-semibold">Command Center</div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-gold/10 text-gold font-medium'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={isActive ? 'text-gold' : 'text-white/40 group-hover:text-gold/70 transition-colors'} />
                                <span className="text-sm">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-gold" />}
                        </Link>
                    )
                })}
            </div>

            {/* User Area / Logout */}
            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}

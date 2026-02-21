'use client'
import { motion } from 'framer-motion'
import { Users, UserPlus, CheckCircle, TrendingUp, CalendarClock, ListTodo } from 'lucide-react'
import DashboardCharts from '@/components/admin/DashboardCharts'

// Mock Data for Phase 1 UI build
const KPIS = [
    { label: "Today's New Leads", value: '14', icon: UserPlus, trend: '+3 from yesterday', color: 'bg-blue-500' },
    { label: 'Active Applications', value: '142', icon: Users, trend: '8 pending submission', color: 'bg-emerald-500' },
    { label: 'Visa Approvals (Dec)', value: '38', icon: CheckCircle, trend: '+12% vs last month', color: 'bg-purple-500' },
    { label: 'Monthly Revenue', value: 'रु 42.5L', icon: TrendingUp, trend: '85% of target', color: 'bg-gold' },
    { label: 'Pending Tasks Today', value: '9', icon: ListTodo, trend: '3 overdue', color: 'bg-rose-500' },
    { label: 'Upcoming Deadlines', value: '12', icon: CalendarClock, trend: 'Next 7 days', color: 'bg-orange-500' },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Command Center</h1>
                    <p className="text-white/60 text-sm">Welcome back. Here's what's happening today.</p>
                </div>
                <div className="hidden sm:flex gap-3">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-white/10">
                        Download Report
                    </button>
                    <button className="bg-gold hover:bg-gold-dark text-oxford-blue font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                        + Add New Lead
                    </button>
                </div>
            </div>

            {/* KPI Cards (Section 1.1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {KPIS.map((kpi, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={kpi.label}
                        className="bg-oxford-blue-dark border border-white/5 rounded-xl p-5 hover:border-gold/30 transition-colors group relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${kpi.color}`} />

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 rounded-lg bg-black/30 border border-white/10 group-hover:border-gold/40 transition-colors">
                                <kpi.icon size={20} className="text-white/80 group-hover:text-gold transition-colors" />
                            </div>
                            <span className="text-xs font-medium text-white/50 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                                Real-time
                            </span>
                        </div>

                        <div>
                            <div className="text-3xl font-bold text-white mb-1 tracking-tight">{kpi.value}</div>
                            <div className="text-sm text-white/60 font-medium mb-3">{kpi.label}</div>

                            <div className="flex items-center gap-1.5 text-xs">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${kpi.trend.includes('overdue') ? 'bg-red-500' :
                                    kpi.trend.includes('+') ? 'bg-emerald-500' : 'bg-gold'
                                    }`} />
                                <span className={
                                    kpi.trend.includes('overdue') ? 'text-red-400' :
                                        kpi.trend.includes('+') ? 'text-emerald-400' : 'text-gold'
                                }>{kpi.trend}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Visual Analytics Widgets */}
            <DashboardCharts />
        </div>
    )
}

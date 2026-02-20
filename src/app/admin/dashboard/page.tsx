'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
    Shield, Users, TrendingUp, Globe, Bell, LogOut, Filter,
    Search, ChevronDown, MoreVertical, RefreshCw, Award
} from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import { DEMO_LEADS, ANALYTICS_DATA, COUNTRIES } from '@/lib/mockData'
import { triggerVisaStatusNotification, type VisaStatus } from '@/lib/notifications'
import type { Lead } from '@/lib/mockData'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<VisaStatus, { label: string; color: string; bg: string }> = {
    inquiry: { label: 'Inquiry', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
    application: { label: 'Application', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
    visa: { label: 'Visa', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
    departure: { label: 'Departure', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
}

const STATUS_ORDER: VisaStatus[] = ['inquiry', 'application', 'visa', 'departure']

function StatCard({ icon: Icon, value, label, delta }: { icon: any; value: string; label: string; delta?: string }) {
    return (
        <div className="card-luxury p-6 rounded-2xl border-gold/10">
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Icon size={18} className="text-gold" />
                </div>
                {delta && <span className="text-green-400 text-xs bg-green-400/10 rounded-full px-2 py-0.5">{delta}</span>}
            </div>
            <div className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</div>
            <div className="text-white/40 text-sm">{label}</div>
        </div>
    )
}

export default function AdminDashboardPage() {
    const { user, logout, isAdmin, loading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'crm' | 'analytics' | 'notifications'>('crm')
    const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS)
    const [filter, setFilter] = useState<VisaStatus | 'all'>('all')
    const [search, setSearch] = useState('')
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) router.push('/admin')
        // Merge localStorage leads with demo leads
        const localLeads: Lead[] = JSON.parse(localStorage.getItem('eri_leads') || '[]').map((l: any) => ({
            ...l,
            status: l.status || 'inquiry',
        }))
        if (localLeads.length) setLeads([...DEMO_LEADS, ...localLeads])
    }, [user, isAdmin, loading, router])

    const updateStatus = (id: string, newStatus: VisaStatus) => {
        const lead = leads.find(l => l.id === id)
        if (!lead) return
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
        triggerVisaStatusNotification(lead.name, newStatus)
        setOpenDropdown(null)
    }

    const filteredLeads = leads.filter(l => {
        if (filter !== 'all' && l.status !== filter) return false
        if (search && !l.name.toLowerCase().includes(search.toLowerCase()) &&
            !l.email.toLowerCase().includes(search.toLowerCase()) &&
            !l.country.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const countByStatus = (s: VisaStatus) => leads.filter(l => l.status === s).length

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>

    return (
        <div className="min-h-screen bg-oxford-blue-dark pt-20">
            {/* Admin header bar */}
            <div className="bg-oxford-blue border-b border-gold/10 sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
                    <div className="flex items-center gap-3">
                        <Shield size={16} className="text-gold" />
                        <span className="text-white/70 text-sm font-medium">Admin Control Center</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-white/40 text-xs hidden sm:block">Logged in as <span className="text-gold">{user?.email}</span></span>
                        <button onClick={logout} className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors">
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Users} value={leads.length.toString()} label="Total Leads" delta="+12%" />
                    <StatCard icon={TrendingUp} value={countByStatus('visa').toString()} label="In Visa Stage" delta="+5%" />
                    <StatCard icon={Award} value={countByStatus('departure').toString()} label="Departures" delta="+8%" />
                    <StatCard icon={Globe} value="9" label="Countries Active" />
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-8 w-fit border border-white/10">
                    {[
                        { key: 'crm', label: 'Lead CRM' },
                        { key: 'analytics', label: 'Analytics' },
                        { key: 'notifications', label: 'Notifications' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.key ? 'bg-gold text-oxford-blue shadow-md' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CRM Tab */}
                {activeTab === 'crm' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Pipeline Summary */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {STATUS_ORDER.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(filter === s ? 'all' : s)}
                                    className={`card-glass rounded-xl p-4 text-center border transition-all ${filter === s ? 'border-gold/50 bg-gold/10' : 'border-transparent hover:border-white/20'
                                        }`}
                                >
                                    <div className={`text-2xl font-bold ${STATUS_CONFIG[s].color}`}>{countByStatus(s)}</div>
                                    <div className="text-white/40 text-xs mt-1">{STATUS_CONFIG[s].label}</div>
                                </button>
                            ))}
                        </div>

                        {/* Search & Filter */}
                        <div className="flex gap-3 mb-5">
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search leads by name, email or country..."
                                    className="input-field pl-10 h-10 text-sm"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value as any)}
                                className="input-field h-10 text-sm w-36"
                            >
                                <option value="all">All Status</option>
                                {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                            </select>
                        </div>

                        {/* Table */}
                        <div className="card-glass rounded-2xl overflow-hidden border border-white/5">
                            <div className="overflow-x-auto">
                                <table className="w-full admin-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Contact</th>
                                            <th>Destination</th>
                                            <th>Budget</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filteredLeads.map((lead) => (
                                                <motion.tr
                                                    key={lead.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-bold">
                                                                {lead.name[0]}
                                                            </div>
                                                            <div>
                                                                <div className="text-white font-medium text-sm">{lead.name}</div>
                                                                <div className="text-white/30 text-xs">{lead.notes}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="text-xs">
                                                            <div className="text-white/60">{lead.email}</div>
                                                            <div className="text-white/30">{lead.phone}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="text-white/70 text-sm">
                                                            {COUNTRIES.find(c => c.name === lead.country)?.flag} {lead.country}
                                                        </span>
                                                    </td>
                                                    <td><span className="text-white/70 text-xs">{lead.budget}</span></td>
                                                    <td>
                                                        <span className={`status-badge border ${STATUS_CONFIG[lead.status].bg} ${STATUS_CONFIG[lead.status].color}`}>
                                                            {STATUS_CONFIG[lead.status].label}
                                                        </span>
                                                    </td>
                                                    <td><span className="text-white/40 text-xs">{lead.createdAt}</span></td>
                                                    <td>
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setOpenDropdown(openDropdown === lead.id ? null : lead.id)}
                                                                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                                            >
                                                                <MoreVertical size={14} />
                                                            </button>
                                                            <AnimatePresence>
                                                                {openDropdown === lead.id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                                        className="absolute right-0 top-8 z-50 bg-oxford-blue border border-gold/20 rounded-xl overflow-hidden shadow-2xl w-40"
                                                                    >
                                                                        <div className="p-2 text-xs text-white/30 border-b border-white/5">Move to stage:</div>
                                                                        {STATUS_ORDER.map(s => (
                                                                            <button
                                                                                key={s}
                                                                                onClick={() => updateStatus(lead.id, s)}
                                                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2 ${lead.status === s ? STATUS_CONFIG[s].color + ' font-semibold' : 'text-white/60'
                                                                                    }`}
                                                                            >
                                                                                {lead.status === s && '✓ '}
                                                                                {STATUS_CONFIG[s].label}
                                                                            </button>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                            {filteredLeads.length === 0 && (
                                <div className="py-12 text-center text-white/30">
                                    <Users size={32} className="mx-auto mb-3 opacity-30" />
                                    <p>No leads match your filter.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Country Popularity */}
                            <div className="card-luxury rounded-2xl p-6 border-gold/10">
                                <h3 className="text-white font-semibold mb-6">Most Popular Destinations</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={ANALYTICS_DATA.countryPopularity} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                                        <YAxis type="category" dataKey="country" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} width={75} />
                                        <Tooltip contentStyle={{ background: '#001530', border: '1px solid rgba(197,160,89,0.2)', borderRadius: 12, color: '#fff' }} />
                                        <Bar dataKey="students" radius={[0, 6, 6, 0]}>
                                            {ANALYTICS_DATA.countryPopularity.map((entry, i) => (
                                                <Cell key={i} fill="#C5A059" opacity={0.7 + (i * 0.03 < 0.3 ? i * 0.03 : 0.3)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Status Breakdown Pie */}
                            <div className="card-luxury rounded-2xl p-6 border-gold/10">
                                <h3 className="text-white font-semibold mb-6">Pipeline Breakdown</h3>
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={ANALYTICS_DATA.statusBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            innerRadius={60}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {ANALYTICS_DATA.statusBreakdown.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#001530', border: '1px solid rgba(197,160,89,0.2)', borderRadius: 12, color: '#fff' }} />
                                        <Legend formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{value}</span>} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Monthly Trend */}
                        <div className="card-luxury rounded-2xl p-6 border-gold/10">
                            <h3 className="text-white font-semibold mb-6">Monthly Lead Trend</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={ANALYTICS_DATA.monthlyLeads}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                                    <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: '#001530', border: '1px solid rgba(197,160,89,0.2)', borderRadius: 12, color: '#fff' }} />
                                    <Line type="monotone" dataKey="leads" stroke="#C5A059" strokeWidth={2.5} dot={{ fill: '#C5A059', r: 4 }} activeDot={{ r: 6, fill: '#d4b47a' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="card-luxury rounded-2xl p-8 border-gold/10 mb-6">
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <Bell size={18} className="text-gold" /> Notification System
                            </h3>
                            <p className="text-white/40 text-sm mb-6">
                                Automated notifications fire when a lead status is updated. In production, these connect to email, WhatsApp API, and Firebase Cloud Functions.
                            </p>

                            <div className="space-y-3">
                                {leads.slice(0, 5).map(lead => (
                                    <div key={lead.id} className="flex items-center justify-between bg-white/3 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-bold">
                                                {lead.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-white text-sm font-medium">{lead.name}</div>
                                                <div className="text-white/30 text-xs">{lead.country} • Current: <span className={STATUS_CONFIG[lead.status].color}>{STATUS_CONFIG[lead.status].label}</span></div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => triggerVisaStatusNotification(lead.name, lead.status)}
                                            className="flex items-center gap-1.5 text-xs bg-gold/10 border border-gold/20 text-gold rounded-xl px-3 py-2 hover:bg-gold/20 transition-colors"
                                        >
                                            <RefreshCw size={13} /> Test Notify
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-luxury rounded-2xl p-6 border-gold/10">
                            <h4 className="text-white font-medium mb-4">Notification Log (Console)</h4>
                            <div className="bg-black/30 rounded-xl p-4 font-mono text-xs space-y-2 max-h-40 overflow-y-auto">
                                <div className="text-green-400">✓ [ERI] System initialized — Demo Mode Active</div>
                                <div className="text-white/40">→ triggerVisaStatusNotification() connected to toast + console.log</div>
                                <div className="text-white/40">→ In production: connects to Firebase Cloud Functions + SendGrid + WhatsApp API</div>
                                <div className="text-gold/60">Press "Test Notify" buttons above to fire live notifications →</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Close dropdown on outside click */}
            {openDropdown && <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />}
        </div>
    )
}

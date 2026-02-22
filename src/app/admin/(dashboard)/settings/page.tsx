'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Building2, Globe2, ShieldCheck, Save, Bell, Users, Briefcase, Loader2 } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function SettingsPage() {
    const { settings, loading, updateSettings } = useSettings()
    const [form, setForm] = useState({
        agency_name: '',
        contact_email: '',
        office_address: '',
        service_fee_npr: 0,
        express_fee_npr: 0
    })

    useEffect(() => {
        if (settings) {
            setForm({
                agency_name: settings.agency_name,
                contact_email: settings.contact_email,
                office_address: settings.office_address,
                service_fee_npr: settings.service_fee_npr,
                express_fee_npr: settings.express_fee_npr
            })
        }
    }, [settings])

    const handleSave = async () => {
        await updateSettings(form)
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 text-white/20">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Loading Configuration...</p>
        </div>
    )

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Portal Configuration</h1>
                <p className="text-white/60 text-sm">Manage office profiles, service rates, and security protocols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-1">
                    {[
                        { label: 'Office Profile', icon: Building2, active: true },
                        { label: 'Consultancy Rates', icon: Briefcase, active: false },
                        { label: 'Security & Access', icon: ShieldCheck, active: false },
                        { label: 'Partner Countries', icon: Globe2, active: false },
                        { label: 'Notifications', icon: Bell, active: false },
                        { label: 'Staff Management', icon: Users, active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${item.active
                                ? 'bg-gold text-oxford-blue font-bold shadow-lg shadow-gold/20'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Settings Form */}
                <div className="lg:col-span-3 space-y-6">
                    {/* General Section */}
                    <div className="bg-oxford-blue-dark border border-white/5 rounded-2xl p-6 lg:p-8 space-y-8">
                        <section>
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Building2 size={20} className="text-gold" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Office Entity Name</label>
                                    <input
                                        type="text"
                                        value={form.agency_name}
                                        onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Primary Contact Email</label>
                                    <input
                                        type="email"
                                        value={form.contact_email}
                                        onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Main Office Address</label>
                                    <textarea
                                        rows={3}
                                        value={form.office_address}
                                        onChange={(e) => setForm({ ...form, office_address: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none"
                                        placeholder="Enter the full street address..."
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-white/5" />

                        <section>
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <Briefcase size={20} className="text-gold" /> Consultancy Service Rates (NPR)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 text-center p-4 rounded-xl bg-white/5 border border-white/5">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Initial Consult</label>
                                    <div className="text-xl font-bold text-emerald-400">FREE</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Standard Service Fee</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold">रु</span>
                                        <input
                                            type="number"
                                            value={form.service_fee_npr}
                                            onChange={(e) => setForm({ ...form, service_fee_npr: Number(e.target.value) })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-8 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Express/Priority Fee</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold">रु</span>
                                        <input
                                            type="number"
                                            value={form.express_fee_npr}
                                            onChange={(e) => setForm({ ...form, express_fee_npr: Number(e.target.value) })}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-8 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => settings && setForm({
                                    agency_name: settings.agency_name,
                                    contact_email: settings.contact_email,
                                    office_address: settings.office_address,
                                    service_fee_npr: settings.service_fee_npr,
                                    express_fee_npr: settings.express_fee_npr
                                })}
                                className="px-6 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
                            >
                                Reset Changes
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 rounded-lg bg-gold hover:bg-gold-dark text-oxford-blue font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-gold/20"
                            >
                                <Save size={18} /> Update Configuration
                            </button>
                        </div>
                    </div>

                    {/* Quick Access Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-oxford-blue-dark to-purple-900/10 border border-white/5 p-6 rounded-2xl">
                            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-400" /> System Integrity
                            </h4>
                            <p className="text-xs text-white/40 leading-relaxed">
                                Portal is running on stable v4.2. SSL Encryption active. All requests are routed through secure Supabase proxies.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-oxford-blue-dark to-gold/5 border border-white/5 p-6 rounded-2xl">
                            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                <Bell size={16} className="text-gold" /> Auto-Responder
                            </h4>
                            <p className="text-xs text-white/40 leading-relaxed">
                                Automated email notifications are currently enabled for all status changes. WhatsApp API integration is pending.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

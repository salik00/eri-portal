'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Flame, Clock, MessageSquare, ArrowRight, CheckCircle2, AlertCircle, Loader2, X, User } from 'lucide-react'
import { exportToCSV } from '@/utils/csvExport'
import { COUNTRIES } from '@/lib/mockData'
import { useLeads } from '@/hooks/useLeads'
import toast from 'react-hot-toast'

export default function LeadsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showAssignModal, setShowAssignModal] = useState(false)
    const { leads, loading, updateLeadStatus, convertToStudent } = useLeads()

    // Categorization logic for dynamic data
    const hotLeads = leads.filter(l => l.status === 'hot' || l.status === 'new').slice(0, 3)
    const otherLeads = leads.filter(l => !hotLeads.find(h => h.id === l.id))

    const filteredLeads = otherLeads.filter(lead => {
        const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase()
        const search = searchTerm.toLowerCase()
        return (
            fullName.includes(search) ||
            lead.email?.toLowerCase().includes(search) ||
            lead.country?.toLowerCase().includes(search)
        )
    })

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Lead Pipeline</h1>
                    <p className="text-white/60 text-sm">Monitor incoming inquiries and high-intent prospects.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => exportToCSV(leads, 'ERI_Lead_Pipeline')}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="bg-gold hover:bg-gold-dark text-oxford-blue font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    >
                        Assign Leads
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showAssignModal && (
                    <AssignModal
                        leads={leads.filter(l => l.status === 'new')}
                        onClose={() => setShowAssignModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* Hot Leads Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                    ))
                ) : (
                    hotLeads.map((lead, index) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-oxford-blue-dark to-purple-900/20 border border-gold/20 rounded-2xl p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Flame size={20} className="text-gold animate-pulse" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold">
                                    {lead.first_name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-bold">{lead.first_name} {lead.last_name}</div>
                                    <div className="text-xs text-white/40">{lead.country}</div>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-xs text-white/60">
                                    <Clock size={14} className="text-gold/50" /> Received: {new Date(lead.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-start gap-2 text-xs text-white/60">
                                    <MessageSquare size={14} className="text-gold/50 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2 italic">&quot;{lead.message || 'No message provided'}&quot;</span>
                                </div>
                            </div>
                            <button
                                onClick={() => updateLeadStatus(lead.id, 'consultation')}
                                className="w-full flex items-center justify-center gap-2 bg-gold/10 hover:bg-gold text-gold hover:text-oxford-blue border border-gold/20 py-2 rounded-lg text-xs font-bold transition-all group"
                            >
                                Start Consultation <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {/* All Leads Pool */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <h3 className="text-lg font-semibold text-white">Full Inbound Pool</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                        <input
                            type="text"
                            placeholder="Filter pool..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-gold/50 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/20">
                            <Loader2 size={32} className="animate-spin mb-4" />
                            <p className="text-sm">Fetching Lead Pool...</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredLeads.map((lead) => (
                                <motion.div
                                    key={lead.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-oxford-blue-dark border border-white/5 p-4 rounded-xl hover:border-white/20 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-sm font-medium text-white group-hover:text-gold transition-colors">
                                            {lead.first_name} {lead.last_name}
                                        </div>
                                        <span className="text-[10px] text-white/40 uppercase tracking-tighter">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/50 mb-4 flex items-center gap-1.5">
                                        {COUNTRIES.find(c => c.name === lead.country)?.flag} {lead.country} • {lead.budget || 'N/A'}
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            {lead.status === 'converted' ? (
                                                <div className="flex items-center gap-1 text-emerald-500">
                                                    <CheckCircle2 size={12} />
                                                    <span className="text-[10px] uppercase font-bold">Converted</span>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => convertToStudent(lead)}
                                                    className="flex items-center gap-1 bg-gold/10 hover:bg-gold text-gold hover:text-oxford-blue px-2 py-1 rounded text-[9px] font-bold transition-all"
                                                >
                                                    Convert to Student
                                                </button>
                                            )}
                                        </div>
                                        <button className="text-white/20 hover:text-gold transition-colors">
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {!loading && filteredLeads.length === 0 && (
                    <div className="py-12 text-center text-white/30 text-sm">
                        No leads found in the pool.
                    </div>
                )}
            </div>
        </div >
    )
}

function AssignModal({ leads, onClose }: { leads: any[], onClose: () => void }) {
    const [selectedLeads, setSelectedLeads] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAssign = async () => {
        setIsSubmitting(true)
        // In a real app, this would update assigned_to in the DB
        await new Promise(r => setTimeout(r, 1000))
        toast.success(`Assigned ${selectedLeads.length} leads to staff`)
        setIsSubmitting(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-oxford-blue/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-oxford-blue-dark border border-white/10 p-8 rounded-3xl w-full max-w-lg relative z-10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Bulk Assign Leads</h2>
                    <button onClick={onClose} className="text-white/20 hover:text-white"><X size={20} /></button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 mb-6 pr-2">
                    {leads.map(lead => (
                        <div
                            key={lead.id}
                            onClick={() => {
                                if (selectedLeads.includes(lead.id)) {
                                    setSelectedLeads(selectedLeads.filter(id => id !== lead.id))
                                } else {
                                    setSelectedLeads([...selectedLeads, lead.id])
                                }
                            }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedLeads.includes(lead.id) ? 'bg-gold/10 border-gold/50' : 'bg-white/5 border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className="text-sm text-white font-medium">{lead.first_name} {lead.last_name}</div>
                            <div className="text-[10px] text-white/40 uppercase">{lead.country}</div>
                        </div>
                    ))}
                    {leads.length === 0 && <div className="text-center py-8 text-white/20 italic">No new leads to assign.</div>}
                </div>

                <div className="border-t border-white/5 pt-6">
                    <label className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3 block">Select Staff Member</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Counselor Saathi', 'Manager Rohan', 'Expert Anita'].map(staff => (
                            <button key={staff} className="p-3 bg-white/5 border border-white/5 rounded-xl text-left text-xs text-white/60 hover:border-gold/30 hover:text-white transition-all flex items-center gap-2">
                                <User size={14} className="text-gold/50" /> {staff}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleAssign}
                    disabled={isSubmitting || selectedLeads.length === 0}
                    className="w-full bg-gold text-oxford-blue font-bold py-3 rounded-xl mt-8 shadow-lg shadow-gold/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : `Assign ${selectedLeads.length} Selected`}
                </button>
            </motion.div>
        </div>
    )
}

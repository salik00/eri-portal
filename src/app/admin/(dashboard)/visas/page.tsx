'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, CheckCircle2, AlertCircle, FileText, Calendar, ArrowUpRight, Search, Loader2, X } from 'lucide-react'
import { COUNTRIES } from '@/lib/mockData'
import { useVisas } from '@/hooks/useVisas'
import { useStudents } from '@/hooks/useStudents'

export default function VisaTrackingPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showLodgeModal, setShowLodgeModal] = useState(false)
    const { visas, loading, updateVisaStatus, lodgeVisa } = useVisas()

    const filteredVisas = visas.filter(v =>
        (v as any).student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const visaPending = filteredVisas.filter(v => v.status === 'pending')
    const visaGranted = filteredVisas.filter(v => v.status === 'granted')

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Visa Tracking</h1>
                    <p className="text-white/60 text-sm">Monitor visa application statuses and departure schedules.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                        <input
                            type="text"
                            placeholder="Search visa applicants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-gold/50 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowLodgeModal(true)}
                        className="bg-gold hover:bg-gold-dark text-oxford-blue font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    >
                        + Lodge Application
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Approvals', value: visaPending.length, icon: AlertCircle, color: 'text-gold' },
                    { label: 'Visas Granted (MTD)', value: visaGranted.length, icon: CheckCircle2, color: 'text-emerald-400' },
                    { label: 'Lodged Today', value: '2', icon: FileText, color: 'text-blue-400' },
                    { label: 'Next Departure', value: '3 days', icon: Plane, color: 'text-purple-400' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-oxford-blue-dark border border-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                            <stat.icon size={18} className={stat.color} />
                            <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Live</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-white/50 lowercase">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[400px]">
                {loading ? (
                    <div className="col-span-2 flex flex-col items-center justify-center py-32 text-white/20">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p>Accessing Visa Records...</p>
                    </div>
                ) : (
                    <>
                        {/* Pending Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                <h3 className="text-lg font-semibold text-white">Pending Approval</h3>
                                <span className="bg-gold/10 text-gold text-[10px] px-2 py-0.5 rounded-full font-bold">{visaPending.length}</span>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {visaPending.map((visa) => (
                                        <motion.div
                                            key={visa.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-oxford-blue-dark border border-white/5 p-4 rounded-xl group hover:border-gold/30 transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-medium text-white group-hover:text-gold transition-colors">
                                                    {(visa as any).student?.full_name || 'Unknown Student'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gold font-bold bg-gold/5 px-2 py-0.5 rounded-full">
                                                    {visa.visa_type.toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="text-white/40 flex items-center gap-1.5">
                                                    {COUNTRIES.find(c => c.name === (visa as any).student?.preferred_country)?.flag || '🌍'}
                                                    {(visa as any).student?.preferred_country} • Filed {visa.submission_date ? new Date(visa.submission_date).toLocaleDateString() : 'TBD'}
                                                </div>
                                                <div className="flex gap-2 text-white/20">
                                                    <button
                                                        onClick={() => updateVisaStatus(visa.id, 'granted')}
                                                        className="hover:text-emerald-400 transition-colors p-1"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 size={14} />
                                                    </button>
                                                    <button className="hover:text-white transition-colors p-1" title="View Details">
                                                        <ArrowUpRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {visaPending.length === 0 && (
                                    <p className="text-white/20 text-sm italic text-center py-8">No pending visa applications.</p>
                                )}
                            </div>
                        </div>

                        {/* Recently Granted */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                <h3 className="text-lg font-semibold text-white">Visas Granted</h3>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">{visaGranted.length}</span>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {visaGranted.map((visa) => (
                                        <motion.div
                                            key={visa.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-oxford-blue-dark border border-white/5 p-4 rounded-xl group hover:border-emerald-500/30 transition-all border-l-2 border-l-emerald-500/20"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                                                        {(visa as any).student?.full_name}
                                                    </div>
                                                    <span className="text-[10px] text-white/40">{(visa as any).student?.preferred_country}</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                        Granted
                                                    </div>
                                                    <div className="text-[9px] text-white/30 flex items-center gap-1">
                                                        <Calendar size={10} /> {visa.decision_date ? new Date(visa.decision_date).toLocaleDateString() : 'Decided'}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {visaGranted.length === 0 && (
                                    <p className="text-white/20 text-sm italic text-center py-8">No recent visa grants.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <AnimatePresence>
                {showLodgeModal && (
                    <LodgeVisaModal
                        onClose={() => setShowLodgeModal(false)}
                        onSubmit={async (data) => {
                            await lodgeVisa(data)
                            setShowLodgeModal(false)
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function LodgeVisaModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => Promise<void> }) {
    const { students } = useStudents()
    const [form, setForm] = useState({
        student_id: '',
        visa_type: 'Student Visa',
        tracking_number: '',
        submission_date: new Date().toISOString().split('T')[0]
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const filteredStudents = students.filter(s =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_id_format?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-oxford-blue/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-oxford-blue-dark border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Lodge Visa Application</h2>
                    <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Select Student</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-white/20" size={14} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-t-xl p-3 pl-9 text-white focus:outline-none focus:border-gold/50 text-sm"
                                placeholder="Type student name..."
                            />
                            <div className="max-h-32 overflow-y-auto bg-black/40 border-x border-b border-white/10 rounded-b-xl">
                                {filteredStudents.map(student => (
                                    <button
                                        key={student.id}
                                        type="button"
                                        onClick={() => { setForm({ ...form, student_id: student.id }); setSearchTerm(student.full_name) }}
                                        className={`w-full text-left p-3 text-xs hover:bg-gold/10 transition-colors flex justify-between items-center ${form.student_id === student.id ? 'bg-gold/20 text-gold font-bold' : 'text-white/60'}`}
                                    >
                                        <span>{student.full_name}</span>
                                        <span className="text-[10px] opacity-40 font-mono">{student.student_id_format}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Visa Type</label>
                            <input value={form.visa_type} onChange={e => setForm({ ...form, visa_type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Tracking #</label>
                            <input value={form.tracking_number} onChange={e => setForm({ ...form, tracking_number: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none" placeholder="REF-123..." />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Submission Date</label>
                        <input type="date" value={form.submission_date} onChange={e => setForm({ ...form, submission_date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none" />
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 text-white/40 py-3 font-bold hover:text-white transition-colors">Cancel</button>
                    <button
                        onClick={async () => { setIsSubmitting(true); await onSubmit(form); setIsSubmitting(false); }}
                        disabled={isSubmitting || !form.student_id}
                        className="flex-1 bg-gold text-oxford-blue font-bold py-3 rounded-xl shadow-lg shadow-gold/10 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Lodge Now'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

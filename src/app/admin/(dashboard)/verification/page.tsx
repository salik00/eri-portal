'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileCheck, ShieldAlert, Eye, CheckCircle, XCircle,
    Clock, Search, FileText, ChevronRight, Loader2, AlertCircle
} from 'lucide-react'
import { useVerification, VerificationTask } from '@/hooks/useVerification'

export default function VerificationPage() {
    const { tasks, loading, updateDocStatus } = useVerification()
    const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [checklist, setChecklist] = useState({
        legible: false,
        nameMatch: false,
        expiryCheck: false,
        notarized: false
    })

    // Reset checklist when selected task changes
    useEffect(() => {
        setChecklist({
            legible: false,
            nameMatch: false,
            expiryCheck: false,
            notarized: false
        })
    }, [selectedTask?.id])

    // Set fallback selected task
    useEffect(() => {
        if (!selectedTask && tasks.length > 0) {
            setSelectedTask(tasks[0])
        }
    }, [tasks, selectedTask])

    const filteredTasks = tasks.filter(task =>
        task.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const toggleCheck = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const allChecked = Object.values(checklist).every(v => v)

    const handleApproval = async (status: 'verified' | 'rejected') => {
        if (!selectedTask) return
        await updateDocStatus(selectedTask.id, status)
    }

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Compliance & Verification</h1>
                    <p className="text-white/60 text-sm">Review student uploads for application integrity.</p>
                </div>
                {loading && <Loader2 className="animate-spin text-gold" size={20} />}
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* List of Verifications */}
                <div className="w-80 bg-oxford-blue-dark border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                            <input
                                type="text"
                                placeholder="Search by student or file..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-[11px] text-white focus:outline-none focus:border-gold/30"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {loading ? (
                            <div className="py-20 text-center opacity-20"><Loader2 className="mx-auto animate-spin" /></div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="py-20 text-center text-[10px] text-white/20 uppercase font-black tracking-widest px-4">Registry Clear</div>
                        ) : (
                            filteredTasks.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => setSelectedTask(task)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedTask?.id === task.id
                                        ? 'bg-gold/10 border-gold/30'
                                        : 'border-transparent hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${task.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' :
                                                task.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                                                    'bg-gold/10 text-gold'
                                            }`}>{task.status}</span>
                                        <span className="text-[10px] text-white/20 tabular-nums">{new Date(task.uploaded_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-sm font-bold text-white mb-1 leading-tight group-hover:text-gold transition-colors">{task.student.full_name}</div>
                                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-tight truncate">
                                        {task.type} • {task.name.split('.').pop()}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Verification Workspace */}
                <div className="flex-1 bg-oxford-blue-dark border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                    {selectedTask ? (
                        <div className="flex-1 flex flex-col">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 bg-white/3 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-bold text-white leading-none">{selectedTask.student.full_name}</h2>
                                        <ChevronRight size={14} className="text-white/20" />
                                        <span className="text-gold font-bold uppercase text-xs tracking-widest">{selectedTask.type}</span>
                                    </div>
                                    <div className="text-[10px] text-white/60 font-mono">UUID: {selectedTask.id} • Size: {selectedTask.size || 'N/A'}</div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`https://${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/eri-portal-docs/${selectedTask.url}`}
                                        target="_blank"
                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-gold/20 text-white/60 hover:text-gold transition-all"
                                    >
                                        <Eye size={18} />
                                    </a>
                                </div>
                            </div>

                            {/* Main Workspace Split */}
                            <div className="flex-1 flex min-h-0">
                                {/* Preview Placeholder / PDF Link */}
                                <div className="flex-1 bg-black/40 flex items-center justify-center p-12">
                                    <div className="max-w-md w-full aspect-[1/1.4] bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-oxford-blue-dark relative border-[12px] border-white">
                                        <div className="p-6 bg-gold/10 rounded-3xl mb-4 text-gold"><FileText size={48} /></div>
                                        <h3 className="text-sm font-black uppercase tracking-tighter mb-1">{selectedTask.name}</h3>
                                        <p className="text-[10px] font-bold text-oxford-blue-dark/40 mb-6 uppercase tracking-widest">{selectedTask.size}</p>
                                        <a
                                            href={`#`} // Logic to fetch public URL if private
                                            className="px-6 py-2.5 bg-oxford-blue-dark text-white rounded-full text-xs font-bold hover:scale-105 transition-transform"
                                        >
                                            Inspect Source
                                        </a>

                                        {/* Mock Watermark */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] text-3xl font-black text-black/5 select-none pointer-events-none uppercase">
                                            SECURE VERIFY
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist Sidebar */}
                                <div className="w-96 border-l border-white/5 p-8 space-y-10 overflow-y-auto bg-black/20">
                                    <section>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                <AlertCircle size={14} className="text-gold" />
                                                Compliance Check
                                            </h3>
                                            <span className="text-[10px] font-bold text-gold tabular-nums">
                                                {Object.values(checklist).filter(v => v).length}/4
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { key: 'legible', label: 'Document Clarity', desc: 'Is the image sharp and text readable?' },
                                                { key: 'nameMatch', label: 'Identity Match', desc: 'Legal name matches registered profile' },
                                                { key: 'expiryCheck', label: 'Validity Scan', desc: 'No expired passport or old IELTS scores' },
                                                { key: 'notarized', label: 'Authentication', desc: 'Seal or digital signature present' }
                                            ].map((item) => (
                                                <button
                                                    key={item.key}
                                                    onClick={() => toggleCheck(item.key as any)}
                                                    className={`w-full text-left p-4 rounded-2xl transition-all border ${checklist[item.key as keyof typeof checklist]
                                                            ? 'bg-emerald-500/10 border-emerald-500/30'
                                                            : 'bg-white/3 border-white/5 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${checklist[item.key as keyof typeof checklist]
                                                            ? 'bg-emerald-500 border-emerald-500 text-oxford-blue'
                                                            : 'border-white/10'
                                                            }`}>
                                                            {checklist[item.key as keyof typeof checklist] && <CheckCircle size={16} />}
                                                        </div>
                                                        <div>
                                                            <div className={`text-xs font-bold ${checklist[item.key as keyof typeof checklist] ? 'text-white' : 'text-white/60'}`}>{item.label}</div>
                                                            <div className="text-[9px] text-white/20 font-medium">{item.desc}</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="pt-4 space-y-4">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleApproval('rejected')}
                                                className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Reject Entry
                                            </button>
                                            <button
                                                disabled={!allChecked}
                                                onClick={() => handleApproval('verified')}
                                                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${allChecked
                                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                                    }`}
                                            >
                                                Verify Doc
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-center text-white/20 font-bold uppercase tracking-widest">Verification ID: V-ERI-882</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10">
                            <FileCheck size={80} strokeWidth={1} className="mb-4" />
                            <h3 className="text-xl font-black uppercase tracking-widest">Awaiting Queue</h3>
                            <p className="text-sm max-w-xs mt-2">Select a registry entry to initiate the verification protocol.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

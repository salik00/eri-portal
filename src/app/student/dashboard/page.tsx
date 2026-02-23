'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, FileText, Trash2, Shield, LogOut,
    FolderOpen, CheckCircle, Clock, Plane, CreditCard,
    AlertCircle, ChevronRight, Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useStudentData } from '@/hooks/useStudentData'
import { useDocuments } from '@/hooks/useDocuments'
import toast from 'react-hot-toast'

const DOC_TYPES = [
    { value: 'passport', label: 'Passport', icon: '🛂' },
    { value: 'ielts', label: 'IELTS Score Card', icon: '📝' },
    { value: 'transcript', label: 'Academic Transcript', icon: '🎓' },
    { value: 'other', label: 'Other Document', icon: '📄' },
]

const JOURNEY_STAGES = [
    { key: 'lead', label: 'Inquiry', icon: <AlertCircle size={18} /> },
    { key: 'applied', label: 'University Application', icon: <FileText size={18} /> },
    { key: 'visa', label: 'Visa Processing', icon: <Shield size={18} /> },
    { key: 'departure', label: 'Departure', icon: <Plane size={18} /> },
]

export default function StudentDashboard() {
    const supabase = createClient()
    const router = useRouter()
    const { student, visa, finance, loading: dataLoading } = useStudentData()
    const { documents, loading: docsLoading, uploadDocument, deleteDocument } = useDocuments(student?.id)

    const [selectedDocType, setSelectedDocType] = useState('passport')
    const [dragOver, setDragOver] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (dataLoading) {
        return (
            <div className="min-h-screen bg-oxford-blue flex items-center justify-center">
                <Loader2 className="animate-spin text-gold" size={40} />
            </div>
        )
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-oxford-blue-dark flex flex-col items-center justify-center p-4 text-center">
                <Shield size={64} className="text-gold/20 mb-6" />
                <h1 className="text-2xl font-bold text-white mb-2">Profile Not Linked</h1>
                <p className="text-white/40 max-w-sm mb-8">
                    Your account is registered but hasn&apos;t been linked to a student record yet.
                    Please contact your counselor to activate your dashboard.
                </p>
                <button onClick={handleLogout} className="text-gold hover:underline">Sign Out</button>
            </div>
        )
    }

    // Determine current stage
    let currentStageIndex = 1; // Default to Applied
    if (visa?.status === 'granted') currentStageIndex = 3;
    else if (visa?.status === 'pending') currentStageIndex = 2;

    return (
        <div className="min-h-screen bg-oxford-blue-dark pb-20">
            {/* Header */}
            <header className="bg-oxford-blue/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center font-bold text-oxford-blue text-xl">E</div>
                        <div>
                            <span className="text-white font-bold block leading-none">ERI Portal</span>
                            <span className="text-[10px] text-gold font-bold uppercase tracking-widest">Your Application Saathi</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <div className="text-sm font-bold text-white leading-none">{student.full_name}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-tighter">{student.student_id_format}</div>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-white/40 hover:text-white transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pt-10 space-y-10">
                {/* Visual Roadmap */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-gold rounded-full" />
                            Application Journey
                        </h2>
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Destination: {student.preferred_country}</span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {JOURNEY_STAGES.map((stage, idx) => {
                            const isCompleted = idx < currentStageIndex;
                            const isActive = idx === currentStageIndex;
                            return (
                                <div
                                    key={stage.key}
                                    className={`relative p-4 md:p-6 rounded-2xl border transition-all ${isActive
                                        ? 'bg-gold/10 border-gold/30 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
                                        : isCompleted
                                            ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60'
                                            : 'bg-white/3 border-white/5 opacity-40'
                                        }`}
                                >
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-3 md:mb-4 ${isCompleted ? 'bg-emerald-500 text-oxford-blue' : isActive ? 'bg-gold text-oxford-blue' : 'bg-white/10 text-white'
                                        }`}>
                                        {isCompleted ? <CheckCircle size={16} /> : stage.icon}
                                    </div>
                                    <div className="text-xs md:text-sm font-bold text-white mb-1">{stage.label}</div>
                                    <div className="text-[8px] md:text-[10px] uppercase font-bold text-white/30 tracking-wider">
                                        {isCompleted ? 'Done' : isActive ? 'Active' : 'Next'}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Document Vault */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FolderOpen size={20} className="text-gold" />
                                Document Vault
                            </h2>
                            <span className="text-xs text-white/30">{documents.length} Files Uploaded</span>
                        </div>

                        <div className="bg-oxford-blue-dark border border-white/5 rounded-3xl p-8 space-y-8">
                            {/* Upload Controls */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                                {DOC_TYPES.map(type => (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedDocType(type.value)}
                                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl border flex flex-col items-center gap-2 transition-all ${selectedDocType === type.value
                                            ? 'bg-gold/10 border-gold/40 text-gold shadow-lg shadow-gold/5'
                                            : 'border-white/5 text-white/40 hover:border-white/10 hover:bg-white/3'
                                            }`}
                                    >
                                        <span className="text-xl md:text-2xl">{type.icon}</span>
                                        <span className="text-[8px] md:text-[10px] font-bold uppercase text-center">{type.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    setDragOver(false)
                                    const file = e.dataTransfer.files[0]
                                    if (file) uploadDocument(file, selectedDocType)
                                }}
                                onClick={() => document.getElementById('file-upload-portal')?.click()}
                                className={`h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${dragOver ? 'bg-gold/10 border-gold' : 'border-white/10 hover:border-gold/30 hover:bg-white/3'
                                    }`}
                            >
                                <input
                                    id="file-upload-portal"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && uploadDocument(e.target.files[0], selectedDocType)}
                                />
                                <Upload size={32} className="text-gold/20 mb-3" />
                                <p className="text-sm text-white/50">Click or drag file to upload</p>
                                <p className="text-[10px] text-white/20 mt-1 uppercase">PDF, JPG or PNG (Max 5MB)</p>
                            </div>

                            {/* Assets List */}
                            <div className="space-y-3">
                                {docsLoading ? (
                                    <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-white/10" /></div>
                                ) : documents.length === 0 ? (
                                    <div className="py-20 text-center text-white/10 italic text-sm border border-white/3 border-dashed rounded-3xl">
                                        No documents found in vault.
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {documents.map(doc => {
                                            const typeInfo = DOC_TYPES.find(t => t.value === doc.type)
                                            return (
                                                <motion.div
                                                    key={doc.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/3 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-gold/20 transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gold/5 rounded-xl flex items-center justify-center text-xl">
                                                            {typeInfo?.icon || '📄'}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white group-hover:text-gold transition-colors">{doc.name}</div>
                                                            <div className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">
                                                                {typeInfo?.label} • {doc.size} • {new Date(doc.uploaded_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${doc.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            doc.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                                                                'bg-gold/10 text-gold'
                                                            }`}>
                                                            {doc.status}
                                                        </span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id, doc.url) }}
                                                            className="text-white/10 hover:text-rose-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Finance & Visa */}
                    <div className="space-y-8">
                        {/* Visa Profile */}
                        <div className="bg-oxford-blue-dark border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Visa Status</h3>
                                    <span className="text-xs text-white/40">{visa?.visa_type || 'Student'} Application</span>
                                </div>
                            </div>
                            {visa ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/3 p-4 rounded-2xl">
                                        <span className="text-xs text-white/60">Current Status</span>
                                        <span className="text-xs font-bold text-gold uppercase tracking-widest">{visa.status}</span>
                                    </div>
                                    {visa.tracking_number && (
                                        <div className="text-center">
                                            <div className="text-[10px] text-white/20 uppercase font-bold mb-1">Tracking Number</div>
                                            <div className="text-white font-mono text-sm tracking-widest">{visa.tracking_number}</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-10 text-center opacity-20">
                                    <Clock size={32} className="mx-auto mb-2" />
                                    <p className="text-xs italic">Application not yet lodged.</p>
                                </div>
                            )}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-oxford-blue-dark border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Invoices</h3>
                                    <span className="text-xs text-white/40">Financial Standing</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {finance.length === 0 ? (
                                    <p className="text-xs text-white/20 italic text-center py-4">No transactions recorded.</p>
                                ) : (
                                    finance.map(txn => (
                                        <div key={txn.id} className="flex justify-between items-center py-2 border-b border-white/3 last:border-0">
                                            <div>
                                                <div className="text-xs text-white font-medium capitalize">{txn.transaction_type.replace('_', ' ')}</div>
                                                <div className="text-[9px] text-white/30">{new Date(txn.transaction_date).toLocaleDateString()}</div>
                                            </div>
                                            <div className="text-xs font-bold text-white">{txn.currency} {Number(txn.amount).toLocaleString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

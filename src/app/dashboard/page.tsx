'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Trash2, Shield, LogOut, FolderOpen, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import toast from 'react-hot-toast'
import type { Document } from '@/lib/mockData'

const DOC_TYPES = [
    { value: 'passport', label: 'Passport', icon: '🛂' },
    { value: 'ielts', label: 'IELTS Score Card', icon: '📝' },
    { value: 'transcript', label: 'Academic Transcript', icon: '🎓' },
    { value: 'other', label: 'Other Document', icon: '📄' },
]

export default function DashboardPage() {
    const { user, logout, loading } = useAuth()
    const router = useRouter()
    const [documents, setDocuments] = useState<Document[]>([])
    const [uploading, setUploading] = useState(false)
    const [selectedType, setSelectedType] = useState('passport')
    const [dragOver, setDragOver] = useState(false)

    useEffect(() => {
        if (!loading && !user) router.push('/auth')
        if (user) {
            const docs = JSON.parse(localStorage.getItem(`eri_docs_${user.uid}`) || '[]')
            setDocuments(docs)
        }
    }, [user, loading, router])

    const saveDocuments = (docs: Document[]) => {
        if (!user) return
        localStorage.setItem(`eri_docs_${user.uid}`, JSON.stringify(docs))
        setDocuments(docs)
    }

    const handleFileUpload = async (file: File) => {
        if (!user) return
        setUploading(true)
        await new Promise(r => setTimeout(r, 1500)) // Simulate upload

        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            userId: user.uid,
            type: selectedType as Document['type'],
            name: file.name,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
            size: `${(file.size / 1024).toFixed(1)} KB`,
        }

        saveDocuments([...documents, newDoc])
        toast.success(`${file.name} uploaded successfully!`)
        setUploading(false)
    }

    const handleDelete = (id: string) => {
        saveDocuments(documents.filter(d => d.id !== id))
        toast.success('Document removed')
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileUpload(file)
    }

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-oxford-blue-dark pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Shield size={18} className="text-gold" />
                            <span className="text-gold text-xs font-semibold uppercase tracking-wider">Secure Portal</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Document Vault
                        </h1>
                        <p className="text-white/40 text-sm mt-1">Welcome, <span className="text-gold">{user.name}</span></p>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                {/* Upload Area */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="card-luxury p-8 rounded-3xl border-gold/20 mb-8"
                >
                    <h3 className="text-white font-semibold mb-4">Upload Document</h3>

                    {/* Type Select */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {DOC_TYPES.map(type => (
                            <button
                                key={type.value}
                                onClick={() => setSelectedType(type.value)}
                                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all duration-200 ${selectedType === type.value
                                        ? 'bg-gold/20 border-gold text-gold'
                                        : 'border-white/10 text-white/50 hover:border-white/25'
                                    }`}
                            >
                                <span className="text-2xl">{type.icon}</span>
                                <span className="text-xs font-medium">{type.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer ${dragOver ? 'border-gold bg-gold/10' : 'border-white/15 hover:border-gold/40'
                            }`}
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={onDrop}
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        />
                        {uploading ? (
                            <div>
                                <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-white/50 text-sm">Uploading securely...</p>
                            </div>
                        ) : (
                            <div>
                                <Upload size={32} className="text-gold/40 mx-auto mb-3" />
                                <p className="text-white/50 text-sm">Drag & drop or click to upload</p>
                                <p className="text-white/25 text-xs mt-1">PDF, JPG, PNG (max 10MB)</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Documents List */}
                <div>
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <FolderOpen size={18} className="text-gold" />
                        Your Documents <span className="text-white/30 text-sm ml-1">({documents.length})</span>
                    </h3>

                    {documents.length === 0 ? (
                        <div className="text-center py-12 text-white/25">
                            <FileText size={36} className="mx-auto mb-3 opacity-40" />
                            <p>No documents uploaded yet. Upload your passport or IELTS score card to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {documents.map(doc => {
                                    const typeInfo = DOC_TYPES.find(t => t.value === doc.type)
                                    return (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="card-glass rounded-2xl p-4 flex items-center gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-xl shrink-0">
                                                {typeInfo?.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white text-sm font-medium truncate">{doc.name}</div>
                                                <div className="text-white/40 text-xs">{typeInfo?.label} · {doc.size} · {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-400" />
                                                <button onClick={() => handleDelete(doc.id)} className="text-white/25 hover:text-red-400 transition-colors p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Filter, MoreVertical, MapPin, GraduationCap,
    Loader2, UserPlus, Link, CheckCircle2, X
} from 'lucide-react'
import { COUNTRIES } from '@/lib/mockData'
import { useStudents } from '@/hooks/useStudents'
import toast from 'react-hot-toast'

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showEnrollModal, setShowEnrollModal] = useState(false)
    const [linkingStudentId, setLinkingStudentId] = useState<string | null>(null)
    const { students, loading, enrollStudent, linkProfile } = useStudents()

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.student_id_format?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.preferred_country?.toLowerCase().includes(searchTerm.toLowerCase())

        if (statusFilter === 'unlinked') return matchesSearch && !student.profile_id
        if (statusFilter === 'linked') return matchesSearch && !!student.profile_id
        return matchesSearch
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Student CRM</h1>
                    <p className="text-white/60 text-sm">Manage student profiles, documents, and portal access.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowEnrollModal(true)}
                        className="bg-gold hover:bg-gold-dark text-oxford-blue font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] flex items-center gap-2"
                    >
                        <UserPlus size={16} /> Enroll New Student
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-oxford-blue-dark/50 p-4 rounded-xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 font-bold uppercase tracking-widest text-[10px]">
                    {['all', 'unlinked', 'linked'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-1.5 rounded-full border transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-gold border-gold text-oxford-blue'
                                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Student Table */}
            <div className="bg-oxford-blue-dark border border-white/5 rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-white/20">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">Syncing Registry...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-white/70">
                            <thead className="text-[10px] text-white/40 uppercase font-black bg-white/5 tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Student Profile</th>
                                    <th className="px-6 py-4">Preferred Destination</th>
                                    <th className="px-6 py-4">Portal Status</th>
                                    <th className="px-6 py-4">Enrollment Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredStudents.map((student) => (
                                        <motion.tr
                                            key={student.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-gold font-bold">
                                                        {student.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-gold transition-colors">{student.full_name}</div>
                                                        <div className="text-[10px] text-white/30 font-mono tracking-tighter">
                                                            {student.student_id_format || 'PENDING ID'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">
                                                        {COUNTRIES.find(c => c.name === student.preferred_country)?.flag || '🌍'}
                                                    </span>
                                                    <span className="text-white/70 font-medium">{student.preferred_country || 'Global'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.profile_id ? (
                                                    <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] font-black uppercase bg-emerald-400/10 px-2 py-0.5 rounded-full w-fit">
                                                        <CheckCircle2 size={10} /> Active Portal
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setLinkingStudentId(student.id)}
                                                        className="flex items-center gap-1.5 text-white/20 hover:text-gold text-[9px] font-black uppercase bg-white/5 px-2 py-0.5 rounded-full w-fit transition-all hover:bg-gold/10"
                                                    >
                                                        <Link size={10} /> Link Auth Profile
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-white/40 text-[10px] font-bold tracking-widest uppercase tabular-nums">
                                                {new Date(student.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-white/30 hover:text-white transition-colors p-1">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && filteredStudents.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 mb-4 border border-white/5">
                            <GraduationCap size={32} className="text-white/10" />
                        </div>
                        <h3 className="text-white font-bold">No Students Registered</h3>
                        <p className="text-white/40 text-xs mt-1">Adjust filters or enroll a new student to begin.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showEnrollModal && (
                    <EnrollModal
                        onClose={() => setShowEnrollModal(false)}
                        onEnroll={async (data) => {
                            const newId = `ERI-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`
                            await enrollStudent({ ...data, student_id_format: newId })
                            setShowEnrollModal(false)
                        }}
                    />
                )}
                {linkingStudentId && (
                    <LinkProfileModal
                        onClose={() => setLinkingStudentId(null)}
                        onLink={async (profileId) => {
                            await linkProfile(linkingStudentId, profileId)
                            setLinkingStudentId(null)
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function EnrollModal({ onClose, onEnroll }: { onClose: () => void, onEnroll: (data: any) => Promise<void> }) {
    const [form, setForm] = useState({ full_name: '', preferred_country: '', passport_number: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!form.full_name) return
        setIsSubmitting(true)
        await onEnroll(form)
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-oxford-blue/90 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-oxford-blue-dark border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">New Enrollment</h2>
                        <p className="text-white/40 text-xs mt-1">Create a 360 profile for a new student.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2 block">Full Legal Name</label>
                        <input
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold/50 transition-all text-sm"
                            placeholder="Enter legal name..."
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2 block">Target Country</label>
                        <select
                            value={form.preferred_country}
                            onChange={(e) => setForm({ ...form, preferred_country: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold/50 transition-all text-sm appearance-none"
                        >
                            <option value="" className="bg-oxford-blue-dark text-white/40">Select target country...</option>
                            {COUNTRIES.map(c => <option key={c.slug} value={c.name} className="bg-oxford-blue-dark">{c.flag} {c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2 block">Passport ID (Global)</label>
                        <input
                            value={form.passport_number}
                            onChange={(e) => setForm({ ...form, passport_number: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-gold/50 transition-all text-sm"
                            placeholder="e.g. N98765432"
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-10">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !form.full_name}
                        className="flex-1 bg-gold hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-oxford-blue font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>Confirm Enrollment</>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

function LinkProfileModal({ onClose, onLink }: { onClose: () => void, onLink: (profileId: string) => Promise<void> }) {
    const [profileId, setProfileId] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!profileId) return
        setIsSubmitting(true)
        await onLink(profileId)
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-oxford-blue/90 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-oxford-blue-dark border border-white/10 p-8 rounded-3xl w-full max-w-sm relative z-10 shadow-2xl"
            >
                <h2 className="text-xl font-bold text-white mb-2">Activate Student Portal</h2>
                <p className="text-white/40 text-xs mb-6">Link this CRM record to a Supabase Auth Profile UUID to enable portal access.</p>

                <div>
                    <label className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2 block">Supabase Profile UUID</label>
                    <input
                        value={profileId}
                        onChange={(e) => setProfileId(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-gold/50 text-sm"
                        placeholder="Paste Auth UUID here..."
                    />
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 text-white/40 py-3 font-bold hover:text-white transition-colors">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !profileId}
                        className="flex-1 bg-gold text-oxford-blue font-bold py-3 rounded-xl shadow-lg shadow-gold/10"
                    >
                        {isSubmitting ? 'Linking...' : 'Connect Profile'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

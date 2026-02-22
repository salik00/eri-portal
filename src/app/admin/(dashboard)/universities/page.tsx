'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, GraduationCap, DollarSign, Award, Globe, Search, MoreHorizontal, Loader2, X, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { COUNTRIES } from '@/lib/mockData'
import { useUniversities } from '@/hooks/useUniversities'

export default function UniversitiesPage() {
    const [selectedCountry, setSelectedCountry] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const { universities, loading, addUniversity } = useUniversities()

    const filteredUnis = universities.filter(uni => {
        const matchesCountry = selectedCountry === 'all' || uni.country === selectedCountry
        const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCountry && matchesSearch
    })

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">University Management</h1>
                    <p className="text-white/60 text-sm">Manage the global database of partner universities and programs.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gold hover:bg-gold-dark text-oxford-blue font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                >
                    + Add New University
                </button>
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <AddUniversityModal
                        onClose={() => setShowAddModal(false)}
                        onAdd={async (data) => {
                            await addUniversity(data)
                            setShowAddModal(false)
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-oxford-blue-dark/50 p-4 rounded-xl border border-white/5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        placeholder="Search universities by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                    />
                </div>
                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
                >
                    <option value="all">All Countries</option>
                    {COUNTRIES.map(c => (
                        <option key={c.slug} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                </select>
            </div>

            {/* University Grid */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-white/20">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p>Synchronizing Global Database...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredUnis.map((uni, index) => {
                                const countryData = COUNTRIES.find(c => c.name === uni.country)
                                return (
                                    <motion.div
                                        key={uni.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-oxford-blue-dark border border-white/5 rounded-2xl overflow-hidden group hover:border-gold/30 transition-all flex flex-col"
                                    >
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors">
                                                    <Landmark size={24} className="text-gold" />
                                                </div>
                                                <button className="text-white/30 hover:text-white transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gold transition-colors line-clamp-2">{uni.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
                                                <span>{countryData?.flag || '🌍'}</span>
                                                <span>{uni.country}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider flex items-center gap-1">
                                                        <Award size={10} /> World Rank
                                                    </div>
                                                    <div className="text-sm font-semibold text-white">#{uni.ranking || 'N/A'}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider flex items-center gap-1">
                                                        <DollarSign size={10} /> Avg. Tuition
                                                    </div>
                                                    <div className="text-sm font-semibold text-white">
                                                        {uni.tuition_min ? `$${(uni.tuition_min / 1000).toFixed(0)}k` : 'N/A'} -
                                                        {uni.tuition_max ? `$${(uni.tuition_max / 1000).toFixed(0)}k` : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider flex items-center gap-1">
                                                    <GraduationCap size={10} /> Top Programs
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {uni.popular_courses?.slice(0, 3).map(course => (
                                                        <span key={course} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/60">
                                                            {course}
                                                        </span>
                                                    )) || <span className="text-white/20 text-[10px]">No programs listed</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full bg-white/5 hover:bg-gold border-t border-white/5 py-3 text-xs font-bold text-white/40 group-hover:text-oxford-blue group-hover:bg-gold transition-all flex items-center justify-center gap-2">
                                            <Globe size={14} /> Full Details
                                        </button>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {filteredUnis.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-white/20 italic">No universities match your criteria.</p>
                </div>
            )}
        </div>
    )
}

function AddUniversityModal({ onClose, onAdd }: { onClose: () => void, onAdd: (data: any) => Promise<void> }) {
    const [form, setForm] = useState({
        name: '',
        country: 'Australia',
        ranking: '',
        tuition_min: '',
        tuition_max: '',
        popular_courses: ['Business']
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newCourse, setNewCourse] = useState('')

    const handleSubmit = async () => {
        if (!form.name) return
        setIsSubmitting(true)
        await onAdd({
            ...form,
            ranking: form.ranking ? parseInt(form.ranking) : null,
            tuition_min: form.tuition_min ? parseInt(form.tuition_min) : null,
            tuition_max: form.tuition_max ? parseInt(form.tuition_max) : null,
        })
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-oxford-blue/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-oxford-blue-dark border border-white/10 p-8 rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Register Partner University</h2>
                    <button onClick={onClose} className="text-white/20 hover:text-white"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-white/30 uppercase font-bold mb-1.5 block">University Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none"
                            placeholder="e.g. University of Melbourne"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-white/30 uppercase font-bold mb-1.5 block">Country</label>
                            <select
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none appearance-none"
                            >
                                {COUNTRIES.map(c => <option key={c.slug} value={c.name} className="bg-oxford-blue">{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-white/30 uppercase font-bold mb-1.5 block">QS World Rank</label>
                            <input
                                type="number"
                                value={form.ranking}
                                onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none"
                                placeholder="e.g. 14"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-white/30 uppercase font-bold mb-1.5 block">Tuition Min (Annual $)</label>
                            <input
                                type="number"
                                value={form.tuition_min}
                                onChange={(e) => setForm({ ...form, tuition_min: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none"
                                placeholder="e.g. 25000"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-white/30 uppercase font-bold mb-1.5 block">Tuition Max (Annual $)</label>
                            <input
                                type="number"
                                value={form.tuition_max}
                                onChange={(e) => setForm({ ...form, tuition_max: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-gold/50 outline-none"
                                placeholder="e.g. 45000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-white/30 uppercase font-bold mb-1.5 block">Featured Programs</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                value={newCourse}
                                onChange={(e) => setNewCourse(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-white text-xs outline-none"
                                placeholder="Add program..."
                            />
                            <button
                                onClick={() => {
                                    if (!newCourse) return
                                    setForm({ ...form, popular_courses: [...form.popular_courses, newCourse] })
                                    setNewCourse('')
                                }}
                                className="p-2 bg-gold/10 text-gold rounded-xl hover:bg-gold transition-colors hover:text-oxford-blue"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.popular_courses.map(course => (
                                <span key={course} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] text-white/60 flex items-center gap-2">
                                    {course}
                                    <button onClick={() => setForm({ ...form, popular_courses: form.popular_courses.filter(c => c !== course) })} className="text-white/20 hover:text-red-400">
                                        <Trash2 size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !form.name}
                    className="w-full bg-gold text-oxford-blue font-bold py-3 rounded-xl mt-8 shadow-lg shadow-gold/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Publish to Portal'}
                </button>
            </motion.div>
        </div>
    )
}

'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, DollarSign, BookOpen, GraduationCap, MapPin, CheckCircle, ChevronDown } from 'lucide-react'
import { UNIVERSITIES, type University } from '@/lib/universities'

export default function CourseFinder() {
    const [search, setSearch] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('All')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<University[]>([])
    const [visibleCount, setVisibleCount] = useState(6)

    useEffect(() => {
        setResults(UNIVERSITIES)
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setVisibleCount(6)

        await new Promise(r => setTimeout(r, 600))

        const filtered = UNIVERSITIES.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.courses.some(c => c.toLowerCase().includes(search.toLowerCase()))
            const matchCountry = selectedCountry === 'All' || item.country === selectedCountry
            return matchSearch && matchCountry
        })

        setResults(filtered)
        setLoading(false)
    }

    const countries = Array.from(new Set(UNIVERSITIES.map(u => u.country))).sort()

    return (
        <section id="course-finder" className="py-24 bg-oxford-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="section-title mx-auto mb-4">University Discovery</h2>
                    <p className="text-white/50 max-w-2xl mx-auto">
                        Explore over 50+ elite universities across the globe. Filter by country or interest to find your future.
                    </p>
                </div>

                <div className="card-luxury p-6 md:p-8 rounded-3xl border-gold/20 mb-12 bg-black/40 backdrop-blur-xl">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search for courses (e.g. IT, Business)..."
                                className="input-field pl-12 w-full"
                            />
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                            <select
                                value={selectedCountry}
                                onChange={e => setSelectedCountry(e.target.value)}
                                className="input-field pl-12 appearance-none w-full"
                            >
                                <option value="All">All Countries</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary justify-center w-full">
                            Search Now
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin mb-4" />
                                <p className="text-gold/60 font-medium">Matching your profile...</p>
                            </motion.div>
                        ) : results.length > 0 ? (
                            results.slice(0, visibleCount).map((uni, i) => (
                                <motion.div
                                    key={uni.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (i % 6) * 0.1 }}
                                    className="group card-glass rounded-3xl overflow-hidden flex flex-col h-full hover:border-gold/30 transition-all duration-500"
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        <img
                                            src={uni.image}
                                            alt={uni.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-lg">{uni.flag}</span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h4 className="text-white font-bold leading-tight line-clamp-2">{uni.name}</h4>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-gold/60 text-xs font-bold uppercase tracking-widest mb-4">
                                            <MapPin size={12} /> {uni.city}, {uni.country}
                                        </div>

                                        <div className="space-y-3 mb-6 flex-1">
                                            {uni.courses.slice(0, 3).map(course => (
                                                <div key={course} className="flex items-center gap-3 text-xs text-white/60">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gold" /> {course}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div>
                                                <div className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Est. Tuition</div>
                                                <div className="text-white font-bold text-sm">${uni.tuitionMin.toLocaleString()} - ${uni.tuitionMax.toLocaleString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-gold font-black text-lg">#{uni.ranking}</div>
                                                <div className="text-[10px] text-gold/40 font-bold uppercase tracking-tighter">Global Rank</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <GraduationCap size={48} className="mx-auto text-gold/20 mb-4" />
                                <p className="text-white/30">No matching universities found.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {!loading && results.length > visibleCount && (
                    <div className="mt-16 text-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="group px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-gold hover:text-black hover:border-gold transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                            See More Universities <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Globe, DollarSign, BookOpen, GraduationCap, MapPin, CheckCircle } from 'lucide-react'
import { COUNTRIES, type Country } from '@/lib/mockData'

export default function CourseFinder() {
    const [search, setSearch] = useState('')
    const [selectedCountry, setSelectedCountry] = useState('All')
    const [budget, setBudget] = useState('All')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any[]>([])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate AI Search delay
        await new Promise(r => setTimeout(r, 800))

        const filtered = COUNTRIES.flatMap((country: Country) =>
            country.topUniversities.map(uni => ({
                ...uni,
                country: country.name,
                flag: country.flag
            }))
        ).filter(item => {
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.courses.some((c: string) => c.toLowerCase().includes(search.toLowerCase()))
            const matchCountry = selectedCountry === 'All' || item.country === selectedCountry
            const matchBudget = budget === 'All' || (
                budget === 'budget' ? item.tuitionMax <= 15000 :
                    budget === 'mid' ? item.tuitionMax <= 30000 : true
            )
            return matchSearch && matchCountry && matchBudget
        })

        setResults(filtered)
        setLoading(false)
    }

    const allCourses = Array.from(new Set(COUNTRIES.flatMap((c: Country) => c.popularCourses))).sort()

    return (
        <section id="course-finder" className="py-24 bg-oxford-blue relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="section-title mx-auto mb-4">AI Course Finder</h2>
                    <p className="text-white/50 max-w-2xl mx-auto">
                        Find the perfect university and course tailored to your budget and academic profile.
                    </p>
                </div>

                {/* Search UI */}
                <div className="card-luxury p-8 rounded-3xl border-gold/20 mb-12">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search for courses (e.g. Computer Science, MBA)..."
                                className="input-field pl-12"
                            />
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                            <select
                                value={selectedCountry}
                                onChange={e => setSelectedCountry(e.target.value)}
                                className="input-field pl-12 appearance-none"
                            >
                                <option value="All">All Countries</option>
                                {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary justify-center">
                            Search Courses
                        </button>
                    </form>

                    {/* Quick Filters */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        <span className="text-white/30 text-xs flex items-center mr-2">Quick Stats:</span>
                        {['MBA', 'Engineering', 'Medicine', 'IT', 'Business'].map(course => (
                            <button
                                key={course}
                                onClick={() => { setSearch(course); }}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 hover:border-gold/30 hover:text-gold transition-all"
                            >
                                {course}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="col-span-full flex flex-col items-center justify-center py-20"
                            >
                                <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
                                <p className="text-gold animate-pulse">Scanning 1,000+ Universities...</p>
                            </motion.div>
                        ) : results.length > 0 ? (
                            results.map((uni, i) => (
                                <motion.div
                                    key={uni.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="card-glass p-6 rounded-2xl flex flex-col h-full"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-2xl">{uni.flag}</span>
                                        <span className="text-gold text-xs font-bold bg-gold/10 px-2 py-1 rounded-md">#{uni.ranking}</span>
                                    </div>
                                    <h4 className="text-white font-bold mb-1 leading-snug">{uni.name}</h4>
                                    <p className="text-white/40 text-xs flex items-center gap-1 mb-4">
                                        <MapPin size={12} className="text-gold" /> {uni.country}
                                    </p>

                                    <div className="space-y-2 mb-6 flex-1">
                                        {uni.courses.slice(0, 3).map((c: string) => (
                                            <div key={c} className="flex items-center gap-2 text-xs text-white/60">
                                                <CheckCircle size={10} className="text-gold" /> {c}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <div className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Tuition Fee</div>
                                            <div className="text-gold font-bold text-sm">${uni.tuitionMax.toLocaleString()}/yr</div>
                                        </div>
                                        <button className="text-white/40 hover:text-white transition-colors">
                                            <BookOpen size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : search && !loading ? (
                            <div className="col-span-full text-center py-20 text-white/30 italic">
                                No universities found matching your criteria. Try adjusting the search or filters.
                            </div>
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-20">
                                <GraduationCap size={64} className="mb-4" />
                                <p>Search above to find your dream university</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

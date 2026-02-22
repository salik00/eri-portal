'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Award, ArrowRight } from 'lucide-react'
import { COUNTRIES } from '@/lib/mockData'

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

function CountryCard({ country, index }: { country: typeof COUNTRIES[0]; index: number }) {
    return (
        <motion.div variants={cardVariants} className="group relative">
            <Link href={`/countries/${country.slug}`}>
                <div className="relative card-luxury p-6 rounded-2xl border border-gold/10 hover:border-gold/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/10 cursor-pointer overflow-hidden h-full">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Flag & Country name */}
                    <div className="flex items-start justify-between mb-5 relative">
                        {/* Decorative 'Onside' Watermark Flag */}
                        <img
                            src={`https://flagcdn.com/w160/${country.isoCode}.png`}
                            className="absolute -right-2 -top-2 w-24 opacity-5 blur-[1px] group-hover:opacity-10 transition-opacity pointer-events-none"
                            alt=""
                        />

                        <div className="flex items-center gap-4 relative z-10">
                            <img
                                src={`https://flagcdn.com/w80/${country.isoCode}.png`}
                                className="w-12 h-8 object-cover rounded shadow-lg group-hover:scale-110 transition-transform duration-500"
                                alt={country.name}
                            />
                            <h3 className="text-white font-black text-2xl tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>{country.name}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors relative z-10">
                            <ArrowRight size={16} className="text-gold group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Visa Success Rate */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <div className="flex items-center gap-1.5 text-white/50">
                                <TrendingUp size={13} />
                                <span>Visa Success Rate</span>
                            </div>
                            <span className="text-gold font-bold text-base">{country.visaSuccessRate}%</span>
                        </div>
                        <div className="progress-bar">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${country.visaSuccessRate}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: index * 0.05, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    {/* Scholarship */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                            <Award size={12} className="text-gold" />
                        </div>
                        <div>
                            <div className="text-white/30 text-xs">Avg. Scholarship</div>
                            <div className="text-white/80 text-xs font-medium">{country.avgScholarship}</div>
                        </div>
                    </div>

                    {/* Processing time */}
                    <div className="text-xs text-white/30 mb-4">
                        Processing: <span className="text-white/60">{country.processingTime}</span>
                    </div>

                    {/* Top Courses */}
                    <div className="flex flex-wrap gap-1.5">
                        {country.popularCourses.slice(0, 3).map((course) => (
                            <span key={course} className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/50 group-hover:border-gold/20 transition-colors">
                                {course}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default function CountriesSection() {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="countries" className="py-24 bg-oxford-blue-dark relative" ref={ref}>
            {/* Section BG */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(197,160,89,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="section-subtitle mb-3"
                    >
                        Global Destinations
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="section-title mb-4"
                    >
                        Choose Your <span className="gradient-text">Destination</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/50 max-w-xl mx-auto"
                    >
                        We specialize in 9 of the world&apos;s leading study destinations. Click any country to explore universities, visa requirements, and scholarship opportunities.
                    </motion.p>
                </div>

                {/* Country Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {COUNTRIES.map((country, i) => (
                        <CountryCard key={country.slug} country={country} index={i} />
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

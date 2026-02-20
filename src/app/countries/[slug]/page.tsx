'use client'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Award, Clock, CheckCircle, ExternalLink, BookOpen, DollarSign } from 'lucide-react'
import { COUNTRIES } from '@/lib/mockData'

export default function CountryPage({ params }: { params: { slug: string } }) {
    const country = COUNTRIES.find(c => c.slug === params.slug)
    if (!country) notFound()

    return (
        <div className="min-h-screen bg-oxford-blue-dark pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back */}
                <Link href="/#countries" className="inline-flex items-center gap-2 text-white/40 hover:text-gold mb-8 transition-colors text-sm">
                    <ArrowLeft size={16} /> Back to All Countries
                </Link>

                {/* Hero */}
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12">
                    <div className="text-8xl mb-4">{country.flag}</div>
                    <h1 className="text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Study in <span className="gradient-text">{country.name}</span>
                    </h1>
                    <p className="text-white/50 text-lg max-w-2xl leading-relaxed">{country.description}</p>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                    {[
                        { icon: TrendingUp, label: 'Visa Success Rate', value: `${country.visaSuccessRate}%`, color: 'text-green-400' },
                        { icon: Award, label: 'Avg. Scholarship', value: country.avgScholarship, color: 'text-gold' },
                        { icon: DollarSign, label: 'Avg. Tuition', value: country.avgTuition, color: 'text-blue-400' },
                        { icon: Clock, label: 'Processing Time', value: country.processingTime, color: 'text-purple-400' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="card-luxury rounded-2xl p-5 border-gold/10">
                            <Icon size={18} className={`${color} mb-2`} />
                            <div className={`text-lg font-bold ${color}`}>{value}</div>
                            <div className="text-white/40 text-xs mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-10">
                    {/* Universities */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
                            <BookOpen size={22} className="text-gold" /> Top Universities
                        </h2>
                        <div className="space-y-4">
                            {country.topUniversities.map((uni, i) => (
                                <motion.div
                                    key={uni.name}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="card-glass rounded-2xl p-5 hover:border-gold/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-white font-semibold text-sm leading-snug pr-4">{uni.name}</h4>
                                        <span className="text-gold text-xs bg-gold/10 rounded-full px-2 py-0.5 shrink-0">#{uni.ranking}</span>
                                    </div>
                                    <div className="text-gold font-semibold text-sm mb-2">
                                        ${uni.tuitionMin.toLocaleString()} – ${uni.tuitionMax.toLocaleString()}/yr
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {uni.courses.map(c => (
                                            <span key={c} className="text-xs bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-white/40">{c}</span>
                                        ))}
                                    </div>
                                    {uni.scholarshipAvailable && (
                                        <span className="text-xs text-green-400 flex items-center gap-1">
                                            <CheckCircle size={11} /> Scholarship Available
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visa Process */}
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <h2 className="section-title text-2xl mb-6">Visa Process</h2>
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-gold/20" />
                            <div className="space-y-4">
                                {country.visaProcess.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.15 * i }}
                                        className="pl-12 relative"
                                    >
                                        <div className="absolute left-0 w-8 h-8 rounded-full bg-oxford-blue border-2 border-gold/50 flex items-center justify-center text-gold text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <div className="card-glass rounded-xl p-4">
                                            <p className="text-white/70 text-sm">{step}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* CTA */}
                <div className="card-luxury rounded-3xl p-8 border-gold/30 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Ready to Study in {country.name}?
                    </h3>
                    <p className="text-white/50 mb-6">Our experts are ready to guide you through every step of the process.</p>
                    <Link href="/#contact" className="btn-primary inline-flex">
                        Get Free Consultation <ExternalLink size={16} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

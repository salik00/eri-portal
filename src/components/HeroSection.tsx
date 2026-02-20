'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, TrendingUp, Globe, ChevronDown } from 'lucide-react'
import FloatingPlane from './FloatingPlane'

const STATS = [
    { value: '5000+', label: 'Students Placed' },
    { value: '95%', label: 'Visa Success Rate' },
    { value: '9', label: 'Countries' },
    { value: '10+', label: 'Years Experience' },
]

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles: { x: number; y: number; size: number; speed: number; opacity: number; drift: number }[] = []

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 200,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.8 + 0.2,
                opacity: Math.random() * 0.5 + 0.1,
                drift: (Math.random() - 0.5) * 0.5,
            })
        }

        let animId: number
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach((p) => {
                p.y -= p.speed
                p.x += p.drift
                if (p.y < -10) {
                    p.y = canvas.height + 10
                    p.x = Math.random() * canvas.width
                }
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(197, 160, 89, ${p.opacity})`
                ctx.fill()
            })
            animId = requestAnimationFrame(animate)
        }
        animate()

        const onResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        window.addEventListener('resize', onResize)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-oxford">
            {/* Particle Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            {/* Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl float-animation" />
                <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-oxford-blue-light/50 blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/8" />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Text */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
                            <Star size={14} className="text-gold fill-gold" />
                            <span className="text-gold text-xs font-semibold tracking-wider uppercase">Nepal&apos;s #1 Overseas Education Consultancy</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Your Dream
                            <br />
                            <span className="gradient-text">University</span>
                            <br />
                            Awaits You
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
                            Expert guidance for studying in USA, UK, Australia, Canada & beyond. From application to departure — we get you there with a <strong className="text-gold">95%+ visa success rate</strong>.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
                            <a href="#contact" className="btn-primary text-base px-8 py-4 animate-pulse-gold">
                                Consult with Experts <ArrowRight size={18} />
                            </a>
                            <a href="#course-finder" className="btn-outline text-base px-8 py-4">
                                Find Your Course <TrendingUp size={18} />
                            </a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {STATS.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>{stat.value}</div>
                                    <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right — 3D Card Stack */}
                    <motion.div
                        initial={{ x: 80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative mx-auto w-80">
                            {/* Back cards for 3D effect */}
                            <div className="absolute inset-0 bg-oxford-blue-light/40 border border-gold/10 rounded-3xl rotate-6 scale-95" />
                            <div className="absolute inset-0 bg-oxford-blue-light/30 border border-gold/10 rounded-3xl rotate-3 scale-97" />

                            {/* Main card */}
                            <div className="relative card-luxury p-8 rounded-3xl border-gold/30">
                                <div className="flex items-center justify-between mb-6">
                                    <Globe size={28} className="text-gold" />
                                    <span className="text-gold text-xs font-semibold tracking-widest bg-gold/10 rounded-full px-3 py-1">LIVE STATS</span>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { country: '🇺🇸 USA', rate: 78 },
                                        { country: '🇬🇧 UK', rate: 85 },
                                        { country: '🇦🇺 Australia', rate: 88 },
                                        { country: '🇨🇦 Canada', rate: 82 },
                                        { country: '🇨🇳 China', rate: 92 },
                                    ].map((item) => (
                                        <div key={item.country}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white/70">{item.country}</span>
                                                <span className="text-gold font-semibold">{item.rate}%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <motion.div
                                                    className="progress-fill"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.rate}%` }}
                                                    transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                                    <p className="text-white/30 text-xs">Visa Success Rates — 2025-26</p>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-5 -right-5 bg-gold text-oxford-blue rounded-2xl px-4 py-2 shadow-xl"
                            >
                                <div className="text-xs font-bold">✓ Free Consultation</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -bottom-5 -left-5 bg-oxford-blue-light border border-gold/30 rounded-2xl px-4 py-2 shadow-xl"
                            >
                                <div className="text-xs font-semibold text-gold">🎓 5000+ Alumni</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
            >
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ChevronDown size={20} />
                </motion.div>
            </motion.div>

            {/* Subtle Plane Animation */}
            <FloatingPlane className="top-1/4 left-[-10%]" delay={0} />
            <FloatingPlane className="bottom-1/3 left-[-20%]" delay={10} />
        </section>
    )
}

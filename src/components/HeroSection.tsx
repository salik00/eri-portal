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

            {/* Background Orbs & Globe Aura */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-oxford-blue-light/30 blur-[100px]" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />

                {/* Globe Wireframe Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-gold/5 animate-[spin_60s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-gold/10 animate-[spin_90s_linear_infinite_reverse]" />
            </div>

            {/* Flying Flags */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {[
                    { code: 'us', top: '15%', left: '10%', delay: 0 },
                    { code: 'gb', top: '20%', right: '15%', delay: 2 },
                    { code: 'au', bottom: '25%', left: '12%', delay: 4 },
                    { code: 'ca', bottom: '20%', right: '10%', delay: 1 },
                    { code: 'eu', top: '45%', left: '5%', delay: 3 },
                    { code: 'jp', bottom: '45%', right: '5%', delay: 5 },
                ].map((f, i) => (
                    <motion.div
                        key={i}
                        className="absolute filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        style={{ top: f.top, left: f.left, right: f.right, bottom: f.bottom }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, 20, 0],
                            rotate: [0, 15, 0],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 5,
                            repeat: Infinity,
                            delay: f.delay,
                            ease: "easeInOut"
                        }}
                    >
                        <img
                            src={`https://flagcdn.com/w80/${f.code}.png`}
                            className="w-12 h-8 object-cover rounded shadow-2xl opacity-40 grayscale-[0.5]"
                            alt=""
                        />
                    </motion.div>
                ))}
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Text */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-20"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6 backdrop-blur-md">
                            <Star size={14} className="text-gold fill-gold" />
                            <span className="text-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Global Excellence • Trusted by 5k+ Students</span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            <span className="text-white/40 block text-2xl md:text-3xl mb-4 font-medium tracking-wide">Chase your</span>
                            Elite <span className="gradient-text">Ambition</span>
                            <br />
                            <span className="text-white/90 italic font-serif">Abroad</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-white/50 text-xl leading-relaxed mb-10 max-w-lg font-light">
                            Experience a <strong className="text-white">Full-Fledged</strong> application journey with Nepal&apos;s most premium consultancy.
                            From MIT to Oxford — we bridge the gap with <span className="text-gold border-b border-gold/30">unrivaled expertise</span>.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
                            <Link href="/auth?tab=register" className="btn-primary flex items-center gap-2 group animate-pulse-gold">
                                Start Your Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/#course-finder" className="btn-outline px-8 py-4 rounded-full border-white/20 text-white hover:bg-white/5 transition-all">
                                Explore Universities
                            </Link>
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
                        initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: 'circOut' }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative mx-auto w-96 transform-gpu hover:scale-105 transition-transform duration-700">
                            {/* Back cards for 3D effect */}
                            <div className="absolute inset-0 bg-gold/5 border border-gold/10 rounded-3xl rotate-12 scale-90 blur-[2px]" />
                            <div className="absolute inset-0 bg-oxford-blue-light/20 border border-gold/10 rounded-3xl rotate-6 scale-95" />

                            {/* Main card */}
                            <div className="relative glass-premium p-10 rounded-[2.5rem] border-white/10 overflow-hidden group">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors" />

                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-3 bg-gold/20 rounded-2xl">
                                        <Globe size={32} className="text-gold animate-spin-slow" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Live Success</div>
                                        <div className="text-gold font-bold">REAL-TIME DATA</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { country: 'USA', code: 'us', rate: 78, color: 'from-blue-500' },
                                        { country: 'UK', code: 'gb', rate: 85, color: 'from-red-500' },
                                        { country: 'Australia', code: 'au', rate: 88, color: 'from-emerald-500' },
                                        { country: 'Canada', code: 'ca', rate: 82, color: 'from-red-400' },
                                    ].map((item) => (
                                        <div key={item.country} className="group/item">
                                            <div className="flex justify-between items-center text-sm mb-2">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={`https://flagcdn.com/w40/${item.code}.png`}
                                                        className="w-6 h-4 object-cover rounded shadow-sm"
                                                        alt=""
                                                    />
                                                    <span className="text-white font-medium group-hover/item:text-gold transition-colors">{item.country}</span>
                                                </div>
                                                <span className="text-gold font-black tracking-tighter">{item.rate}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full bg-gradient-to-r ${item.color} to-gold`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.rate}%` }}
                                                    transition={{ duration: 2, delay: 1, ease: 'anticipate' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating badges */}
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-6 -right-8 bg-gold text-oxford-blue rounded-2xl px-5 py-3 shadow-2xl font-black text-sm z-30"
                            >
                                ✓ PREMIUM GUIDANCE
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                className="absolute -bottom-8 -left-10 glass-premium border-gold/30 rounded-2xl px-5 py-3 shadow-2xl z-30"
                            >
                                <div className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">Total Placements</div>
                                <div className="text-2xl font-black text-white">5,000+</div>
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

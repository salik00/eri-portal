'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, ShieldCheck, Mail, Lock, ArrowRight, Loader2, UserPlus, CheckCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, signup } from '@/app/auth/actions'
import Link from 'next/link'

export default function AuthContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login'

    const [tab, setTab] = useState<'login' | 'register'>(initialTab)
    const [userType, setUserType] = useState<'student' | 'admin'>('student')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    })

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setMessage('')

        try {
            const data = new FormData()
            data.append('email', formData.email)
            data.append('password', formData.password)
            if (tab === 'register') data.append('fullName', formData.fullName)

            if (tab === 'login') {
                const result = await login(data)
                if (result?.error) throw new Error(result.error)

                // Redirect based on type
                if (userType === 'admin') window.location.href = '/admin'
                else window.location.href = '/student/dashboard'
            } else {
                const result = await signup(data)
                if (result?.error) throw new Error(result.error)
                setMessage('Registration successful! Please check your email for verification.')
                setTab('login')
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-oxford-blue flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-80 h-80 bg-gold/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-oxford-blue-light/40 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-oxford-blue-dark/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
                {/* Branding */}
                <div className="p-8 pb-4 text-center">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap size={28} className="text-oxford-blue" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>Enlightened</div>
                            <div className="text-gold text-[10px] font-bold tracking-widest uppercase">Research Institute</div>
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-white/40 text-sm">Nepal&apos;s Elite Education Consultancy Portal</p>
                </div>

                {/* Tabs */}
                <div className="px-8 flex gap-2">
                    <button
                        onClick={() => setTab('login')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-2xl transition-all ${tab === 'login' ? 'bg-gold text-oxford-blue' : 'text-white/40 hover:bg-white/5'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setTab('register')}
                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-2xl transition-all ${tab === 'register' ? 'bg-gold text-oxford-blue' : 'text-white/40 hover:bg-white/5'}`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleAuth} className="p-8 pt-6 space-y-6">
                    {/* User Type Toggle (Login Only) */}
                    {tab === 'login' && (
                        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setUserType('student')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${userType === 'student' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40'}`}
                            >
                                <GraduationCap size={14} /> Student Access
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${userType === 'admin' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40'}`}
                            >
                                <ShieldCheck size={14} /> Administration
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs text-center">
                                {error}
                            </motion.div>
                        )}
                        {message && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
                                <CheckCircle size={14} /> {message}
                            </motion.div>
                        )}

                        {tab === 'register' && (
                            <div className="relative">
                                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    name="fullName"
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold/50 outline-none transition-all"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold/50 outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                name="password"
                                type="password"
                                placeholder="Security Token / Password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gold hover:bg-gold-dark text-oxford-blue font-black py-4 rounded-2xl shadow-2xl shadow-gold/10 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <><Loader2 className="animate-spin" size={20} /> Authenticating...</>
                        ) : (
                            <>{tab === 'login' ? 'Enter Portal' : 'Create Account'} <ArrowRight size={20} /></>
                        )}
                    </button>

                    <p className="text-center text-xs text-white/20 pt-4">
                        Secure connection via Supabase Auth & ERI Shield
                    </p>
                </form>
            </motion.div>
        </div>
    )
}

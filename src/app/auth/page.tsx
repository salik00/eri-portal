'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import toast from 'react-hot-toast'

function AuthForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { login, register, user } = useAuth()
    const [tab, setTab] = useState<'login' | 'register'>(
        searchParams.get('tab') === 'register' ? 'register' : 'login'
    )
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) router.push(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    }, [user, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (tab === 'login') {
            const result = await login(form.email, form.password)
            if (result.success) {
                toast.success('Welcome back!')
            } else {
                toast.error(result.error || 'Login failed')
            }
        } else {
            if (!form.name) { toast.error('Please enter your name'); setLoading(false); return }
            if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); setLoading(false); return }
            const result = await register(form.name, form.email, form.password)
            if (result.success) {
                toast.success('Account created! Welcome to ERI 🎓')
            } else {
                toast.error(result.error || 'Registration failed')
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 bg-gradient-oxford relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <GraduationCap size={32} className="text-oxford-blue" />
                    </div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tab === 'login' ? 'Welcome Back' : 'Join ERI'}
                    </h1>
                    <p className="text-white/50 mt-2 text-sm">
                        {tab === 'login' ? 'Sign in to your student portal' : 'Start your overseas education journey'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/5 rounded-2xl p-1 mb-6 border border-white/10">
                    {(['login', 'register'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${tab === t ? 'bg-gold text-oxford-blue shadow-lg' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            {t === 'login' ? 'Sign In' : 'Register'}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <div className="card-luxury p-8 rounded-3xl border-gold/20">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence>
                            {tab === 'register' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                >
                                    <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><User size={11} /> Full Name</label>
                                    <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your full name" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><Mail size={11} /> Email Address</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
                        </div>

                        <div>
                            <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><Lock size={11} /> Password</label>
                            <div className="relative">
                                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} className="input-field pr-10" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 mt-2">
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-oxford-blue/30 border-t-oxford-blue rounded-full animate-spin" />
                            ) : (
                                <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    {tab === 'login' && (
                        <div className="mt-4 pt-4 border-t border-white/5 text-center">
                            <p className="text-white/30 text-xs">Admin? Use <span className="text-gold">admin@enlightened.com</span></p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default function AuthPage() {
    return (
        <Suspense>
            <AuthForm />
        </Suspense>
    )
}

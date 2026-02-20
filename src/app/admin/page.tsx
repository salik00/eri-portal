'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap } from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
    const { login, user } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user?.role === 'admin') router.push('/admin/dashboard')
    }, [user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const result = await login(email, password)
        if (result.success) {
            toast.success('Welcome, Administrator!')
            router.push('/admin/dashboard')
        } else {
            toast.error('Invalid admin credentials')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-oxford-blue-dark relative overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(197,160,89,0.05) 0%, transparent 60%)', backgroundSize: 'cover' }} />
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(197,160,89,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

            <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-2xl shadow-gold/20">
                            <Shield size={36} className="text-oxford-blue" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-oxford-blue-dark" />
                    </div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Admin Portal</h1>
                    <p className="text-white/40 text-sm mt-1">Enlightened Research Institute</p>
                </div>

                <div className="card-luxury p-8 rounded-3xl border-gold/30">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><Mail size={11} /> Admin Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="admin@enlightened.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><Lock size={11} /> Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input-field pr-10"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-4 mt-2">
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-oxford-blue/30 border-t-oxford-blue rounded-full animate-spin" />
                            ) : (
                                <>Access Admin Panel <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 pt-5 border-t border-white/5 bg-gold/5 rounded-xl p-4 -mx-2">
                        <p className="text-xs text-white/30 text-center mb-1">Demo Credentials</p>
                        <p className="text-xs text-gold text-center font-mono">admin@enlightened.com</p>
                        <p className="text-xs text-gold text-center font-mono">ERI_Admin_2026</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Perform actual Auth via API route to set cookies securely
        try {
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (response.ok) {
                router.push('/admin')
                router.refresh()
            } else {
                setError(result.error || 'Invalid credentials or access denied.')
                setIsLoading(false)
            }
        } catch (err) {
            setError('System error. Please contact IT support.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-oxford-blue flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-oxford-blue-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10"
            >
                {/* Header */}
                <div className="p-8 text-center border-b border-white/5 relative bg-gradient-to-b from-white/5 to-transparent">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                        <ShieldCheck size={32} className="text-oxford-blue" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Command Center</h1>
                    <p className="text-white/60 text-sm">Secure access for ERI personnel only.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Organization Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-white/20"
                                placeholder="name@enlightened.com.np"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-white/80">Security Token</label>
                                <a href="#" className="text-xs text-gold hover:text-gold-dark transition-colors">Forgot Token?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-white/20"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gold hover:bg-gold-dark text-oxford-blue font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] mt-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Enter Command Center
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-white/40 pt-4">
                        Protected by ERI Auth & Supabase
                    </p>
                </form>
            </motion.div>
        </div>
    )
}

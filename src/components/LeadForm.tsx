'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, Mail, Phone, Globe, Wallet, MessageSquare, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { triggerNewLeadNotification } from '@/lib/notifications'
import { COUNTRIES } from '@/lib/mockData'
import { createClient } from '@/utils/supabase/client'

interface FormData {
    name: string; email: string; phone: string
    country: string; budget: string; message: string
}

const BUDGETS = ['Under $15,000', '$15,000 - $25,000', '$25,000 - $40,000', '$40,000 - $60,000', 'Over $60,000']

export default function LeadForm() {
    const supabase = createClient()
    const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', country: '', budget: '', message: '' })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.phone || !form.country) {
            toast.error('Please fill in all required fields')
            return
        }
        setLoading(true)

        try {
            // Split name into first and last
            const nameParts = form.name.trim().split(' ')
            const firstName = nameParts[0]
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.'

            const { error } = await supabase.from('leads').insert({
                first_name: firstName,
                last_name: lastName,
                email: form.email,
                phone: form.phone,
                country: form.country,
                budget: form.budget,
                message: form.message,
                status: 'new',
                source: 'Landing Page'
            })

            if (error) throw error

            triggerNewLeadNotification(form.name, form.country)
            setSubmitted(true)
        } catch (error: any) {
            console.error('Lead submission error:', error)
            toast.error('Failed to submit inquiry. Please try again or contact us directly.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <section id="contact" className="py-24 bg-oxford-blue-dark">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
                        <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={36} className="text-gold" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Inquiry Received! 🎉
                        </h3>
                        <p className="text-white/50 mb-8">
                            Thank you <strong className="text-gold">{form.name}</strong>! Our expert counselors will reach out to you within 24 hours.
                        </p>
                        <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', country: '', budget: '', message: '' }) }}
                            className="btn-outline">
                            Submit Another Inquiry
                        </button>
                    </motion.div>
                </div>
            </section>
        )
    }

    return (
        <section id="contact" className="py-24 bg-oxford-blue-dark relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div>
                        <p className="section-subtitle mb-3">Free Consultation</p>
                        <h2 className="section-title mb-6">Start Your <span className="gradient-text">Journey</span> Today</h2>
                        <p className="text-white/50 leading-relaxed mb-8">
                            Fill in your details and one of our certified education counselors will contact you within 24 hours for a personalized consultation — completely free of charge.
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: '🎓', title: 'Expert Guidance', desc: 'Qualified counselors with 10+ years experience' },
                                { icon: '📋', title: 'Complete Application Support', desc: 'From shortlisting to visa approval' },
                                { icon: '💰', title: 'Scholarship Assistance', desc: 'We help you find and apply for financial aid' },
                                { icon: '🏅', title: '95%+ Visa Success Rate', desc: 'One of the highest in Nepal' },
                            ].map(item => (
                                <div key={item.title} className="flex items-start gap-4">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <div className="text-white font-semibold text-sm">{item.title}</div>
                                        <div className="text-white/40 text-sm">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Form */}
                    <motion.form
                        initial={{ x: 40, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="card-luxury p-8 rounded-3xl border-gold/20 space-y-5"
                    >
                        <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Get Free Consultation</h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><User size={11} /> Full Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your full name" required />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><Mail size={11} /> Email *</label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="your@email.com" required />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><Phone size={11} /> Phone / WhatsApp *</label>
                                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+977-98XXXXXXXX" required />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs mb-1.5 flex items-center justify-between gap-1">
                                    <span className="flex items-center gap-1"><Globe size={11} /> Country of Interest *</span>
                                    {form.country && (
                                        <motion.img
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={form.country}
                                            src={`https://flagcdn.com/w40/${COUNTRIES.find(c => c.name === form.country)?.isoCode || 'un'}.png`}
                                            className="w-5 h-3.5 object-cover rounded shadow-sm"
                                            alt=""
                                        />
                                    )}
                                </label>
                                <select name="country" value={form.country} onChange={handleChange} className="input-field" required>
                                    <option value="">Select destination</option>
                                    {COUNTRIES.map(c => <option key={c.slug} value={c.name}>{c.flag} {c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><Wallet size={11} /> Annual Tuition Budget</label>
                            <select name="budget" value={form.budget} onChange={handleChange} className="input-field">
                                <option value="">Select budget range</option>
                                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1"><MessageSquare size={11} /> Message</label>
                            <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Tell us about your academic background and goals..." />
                        </div>

                        <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-4 text-base rounded-2xl">
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-oxford-blue/30 border-t-oxford-blue rounded-full animate-spin" /> Submitting...</>
                            ) : (
                                <><Send size={18} /> Submit Free Consultation Request</>
                            )}
                        </button>

                        <p className="text-white/20 text-xs text-center">
                            By submitting, you agree to be contacted by ERI. Your data is kept confidential.
                        </p>
                    </motion.form>
                </div>
            </div>
        </section>
    )
}

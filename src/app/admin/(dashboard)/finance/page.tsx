'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingUp, CreditCard, PieChart, ArrowUpRight, ArrowDownRight, Printer, Filter, Loader2, Search } from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts'
import { useFinance } from '@/hooks/useFinance'
import { useStudents } from '@/hooks/useStudents'

const REVENUE_DATA = [
    { month: 'Sep', amount: 12.5 },
    { month: 'Oct', amount: 18.2 },
    { month: 'Nov', amount: 25.8 },
    { month: 'Dec', amount: 22.1 },
    { month: 'Jan', amount: 35.4 },
    { month: 'Feb', amount: 30.8 },
]

const SERVICE_BREAKDOWN = [
    { name: 'Visa Processing', value: 45, color: '#C5A059' },
    { name: 'IELTS/PTE Coaching', value: 25, color: '#3b82f6' },
    { name: 'University App Fee', value: 20, color: '#a855f7' },
    { name: 'Other Services', value: 10, color: '#10b981' },
]

export default function FinancePage() {
    const [showRecordModal, setShowRecordModal] = useState(false)
    const { records, loading, addTransaction } = useFinance()

    const totalRevenue = records.reduce((acc, curr) => acc + Number(curr.amount), 0)
    const formattedTotal = (totalRevenue / 100000).toFixed(2)

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Financial Oversight</h1>
                    <p className="text-white/60 text-sm">Track office revenue, service fees, and financial growth.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                        <Printer size={16} /> Print Statement
                    </button>
                    <button
                        onClick={() => setShowRecordModal(true)}
                        className="bg-gold hover:bg-gold-dark text-oxford-blue font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    >
                        + Record Payment
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-oxford-blue-dark border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-gold/10 rounded-xl text-gold">
                            <DollarSign size={20} />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                            <ArrowUpRight size={14} /> + Live
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">रु {formattedTotal}L</div>
                    <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Total Ledger Revenue</div>
                </div>

                <div className="bg-oxford-blue-dark border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                            <TrendingUp size={20} />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                            <ArrowUpRight size={14} /> +8.2%
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">रु 5.12L</div>
                    <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Net Margin (This Month)</div>
                </div>

                <div className="bg-oxford-blue-dark border border-white/5 p-6 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                            <CreditCard size={20} />
                        </div>
                        <div className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                            <ArrowDownRight size={14} /> -2.1%
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">रु 1.25L</div>
                    <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Operational Expenses</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <div className="bg-oxford-blue-dark border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Revenue Growth</h3>
                        <div className="text-xs text-white/40">Past 6 Months</div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `रु${v}L`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#001530', border: '1px solid rgba(197,160,89,0.2)', borderRadius: '12px', color: '#fff' }}
                                    formatter={(v) => [`रु ${v} Lakhs`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#C5A059" strokeWidth={3} fillOpacity={1} fill="url(#colorFinance)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Breakdown */}
                <div className="bg-oxford-blue-dark border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white">Service Popularity</h3>
                            <PieChart size={16} className="text-gold/50" />
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SERVICE_BREAKDOWN} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#fff" fontSize={11} width={120} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#001530', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {SERVICE_BREAKDOWN.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Ledger */}
            <div className="bg-oxford-blue-dark border border-white/5 rounded-2xl overflow-hidden min-h-[300px]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                    {loading && <Loader2 size={16} className="animate-spin text-gold" />}
                    <button className="text-xs text-gold hover:text-gold-dark transition-colors flex items-center gap-1">
                        <Filter size={14} /> Full Ledger
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/70">
                        <thead className="text-xs text-white/30 uppercase bg-white/5">
                            <tr>
                                <th className="px-6 py-4">Transaction Date</th>
                                <th className="px-6 py-4">Source Student</th>
                                <th className="px-6 py-4">Service Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {records.map((txn) => (
                                    <motion.tr
                                        key={txn.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(txn.transaction_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{(txn as any).student?.full_name || 'N/A'}</span>
                                                <span className="text-[10px] text-white/30 font-mono">{(txn as any).student?.student_id_format}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white/60 capitalize">{txn.transaction_type.replace('_', ' ')}</td>
                                        <td className="px-6 py-4 font-bold text-white">{txn.currency} {Number(txn.amount).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${txn.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold/10 text-gold'
                                                }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {records.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-white/20 italic">No financial transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showRecordModal && (
                    <RecordPaymentModal
                        onClose={() => setShowRecordModal(false)}
                        onSubmit={async (data) => {
                            await addTransaction(data)
                            setShowRecordModal(false)
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function RecordPaymentModal({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: any) => Promise<void> }) {
    const { students } = useStudents()
    const [form, setForm] = useState({
        student_id: '',
        transaction_type: 'service_fee',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0]
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const filteredStudents = students.filter(s =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_id_format?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubmit = async () => {
        if (!form.student_id || !form.amount) return
        setIsSubmitting(true)
        await onSubmit({
            ...form,
            amount: Number(form.amount)
        })
        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-oxford-blue/90 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-oxford-blue-dark border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
            >
                <h2 className="text-xl font-bold text-white mb-6">Record New Payment</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Select Student</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-white/20" size={14} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-t-xl p-3 pl-9 text-white focus:outline-none focus:border-gold/50 text-sm"
                                placeholder="Search student by name..."
                            />
                            <div className="max-h-32 overflow-y-auto bg-black/40 border-x border-b border-white/10 rounded-b-xl">
                                {filteredStudents.map(student => (
                                    <button
                                        key={student.id}
                                        onClick={() => {
                                            setForm({ ...form, student_id: student.id })
                                            setSearchTerm(student.full_name)
                                        }}
                                        className={`w-full text-left p-3 text-xs hover:bg-gold/10 transition-colors flex justify-between items-center ${form.student_id === student.id ? 'bg-gold/20 text-gold font-bold' : 'text-white/60'}`}
                                    >
                                        <span>{student.full_name}</span>
                                        <span className="text-[10px] opacity-40 font-mono">{student.student_id_format}</span>
                                    </button>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <div className="p-3 text-xs text-white/20 italic">No students found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Type</label>
                            <select
                                value={form.transaction_type}
                                onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-gold/50 text-sm"
                            >
                                <option value="service_fee" className="bg-oxford-blue">Service Fee</option>
                                <option value="tuition_deposit" className="bg-oxford-blue">Tuition Deposit</option>
                                <option value="expense" className="bg-oxford-blue">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Amount (रु)</label>
                            <input
                                type="number"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-gold/50 text-sm"
                                placeholder="e.g. 50000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-white/40 uppercase font-bold mb-1.5 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-gold/50 text-sm resize-none"
                            rows={2}
                            placeholder="Add details about this payment..."
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 text-white/40 py-3 font-bold hover:text-white transition-colors">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !form.student_id || !form.amount}
                        className="flex-1 bg-gold text-oxford-blue font-bold py-3 rounded-xl shadow-lg shadow-gold/10 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Recording...' : 'Record Entry'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

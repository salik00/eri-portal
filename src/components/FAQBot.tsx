'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Bot, Send, ChevronDown } from 'lucide-react'
import { FAQ_DATA } from '@/lib/mockData'

interface Message {
    id: number
    text: string
    isBot: boolean
    isTyping?: boolean
}

export default function FAQBot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: "Hi! I'm ERI's AI assistant 🎓 I can help you with common questions about studying abroad. Click a question below or type your own!", isBot: true },
    ])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)

    const findAnswer = (q: string) => {
        const lower = q.toLowerCase()
        const match = FAQ_DATA.find(item =>
            item.q.toLowerCase().split(' ').some(word => word.length > 3 && lower.includes(word))
        )
        return match?.a ?? "I don't have a specific answer for that, but our expert counselors can help! Please fill the inquiry form or WhatsApp us directly. 😊"
    }

    const addBotMessage = (text: string) => {
        const tempId = Date.now()
        setTyping(true)
        setTimeout(() => {
            setTyping(false)
            setMessages(prev => [...prev, { id: tempId, text, isBot: true }])
        }, 800 + Math.random() * 600)
    }

    const handleSend = (text: string) => {
        if (!text.trim()) return
        const userMsg: Message = { id: Date.now(), text, isBot: false }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        addBotMessage(findAnswer(text))
    }

    const handleFAQ = (item: typeof FAQ_DATA[0]) => {
        const userMsg: Message = { id: Date.now(), text: item.q, isBot: false }
        setMessages(prev => [...prev, userMsg])
        addBotMessage(item.a)
    }

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.3, type: 'spring', stiffness: 200 }}
                onClick={() => setOpen(!open)}
                className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-oxford-blue border-2 border-gold shadow-2xl shadow-oxford-blue/50 flex items-center justify-center group"
                title="Ask ERI AI"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={22} className="text-gold" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                            <Bot size={22} className="text-gold" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="absolute right-16 bg-oxford-blue-dark border border-gold/20 text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                    ERI AI Assistant
                </div>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-44 right-6 z-50 w-80 sm:w-96 h-[480px] flex flex-col rounded-2xl overflow-hidden border border-gold/20 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="bg-oxford-blue px-4 py-3 border-b border-gold/20 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                                <Bot size={16} className="text-gold" />
                            </div>
                            <div>
                                <div className="text-white text-sm font-semibold">ERI AI Assistant</div>
                                <div className="text-green-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Online</div>
                            </div>
                            <button onClick={() => setOpen(false)} className="ml-auto text-white/40 hover:text-white">
                                <ChevronDown size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-oxford-blue-dark">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.isBot
                                            ? 'bg-oxford-blue border border-gold/10 text-white/80 rounded-tl-none'
                                            : 'bg-gold text-oxford-blue font-medium rounded-tr-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {typing && (
                                <div className="flex justify-start">
                                    <div className="bg-oxford-blue border border-gold/10 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FAQ Chips */}
                        <div className="bg-oxford-blue border-t border-gold/10 px-3 py-2">
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {FAQ_DATA.slice(0, 4).map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleFAQ(item)}
                                        className="shrink-0 text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/50 hover:text-gold hover:border-gold/30 transition-all"
                                    >
                                        {item.q.split(' ').slice(0, 4).join(' ')}...
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="bg-oxford-blue border-t border-gold/10 p-3 flex gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                                placeholder="Ask about visa, costs, scholarships..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/30"
                            />
                            <button
                                onClick={() => handleSend(input)}
                                className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center hover:bg-gold-light transition-colors"
                            >
                                <Send size={15} className="text-oxford-blue" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

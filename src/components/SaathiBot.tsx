'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Bot, Send, ChevronDown, User, Sparkles } from 'lucide-react'

interface Message {
    id: number
    text: string
    isBot: boolean
}

export default function SaathiBot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: "Namaste! Ma Saathi hun — ERI ko AI education counsellor. Tapaaiko study abroad ko kura garau?", isBot: true },
    ])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, typing])

    const handleSend = async (text: string) => {
        if (!text.trim() || typing) return

        const userMsg: Message = { id: Date.now(), text, isBot: false }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setTyping(true)

        try {
            const response = await fetch('/api/ai/counselor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            })

            const data = await response.json()

            setMessages(prev => [...prev, {
                id: Date.now(),
                text: data.text || data.message || "I'm here to help! Could you please repeat that? 😊",
                isBot: true
            }])
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "Mero connection ma sabaai problem bhayo. Please try again! 🙏",
                isBot: true
            }])
        } finally {
            setTyping(false)
        }
    }

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                onClick={() => setOpen(!open)}
                className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-oxford-blue border-2 border-gold shadow-2xl shadow-oxford-blue/50 flex items-center justify-center group"
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
                    Talk to Saathi AI 🎓
                </div>
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-44 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] flex flex-col rounded-2xl overflow-hidden border border-gold/20 shadow-2xl bg-oxford-blue-dark"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-oxford-blue to-oxford-blue-light px-4 py-4 border-b border-gold/20 flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                                    <Bot size={20} className="text-gold" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-oxford-blue rounded-full" />
                            </div>
                            <div className="flex-1">
                                <div className="text-white text-base font-bold flex items-center gap-2">
                                    Saathi AI <Sparkles size={12} className="text-gold animate-pulse" />
                                </div>
                                <div className="text-white/50 text-xs">Enterprise AI Counselor</div>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gold/20">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                    {msg.isBot && (
                                        <div className="mt-1 w-7 h-7 shrink-0 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                                            <Bot size={14} className="text-gold" />
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.isBot
                                            ? 'bg-oxford-blue border border-gold/5 text-white/90 rounded-tl-none'
                                            : 'bg-gold text-oxford-blue font-medium rounded-tr-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    {!msg.isBot && (
                                        <div className="mt-1 w-7 h-7 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                            <User size={14} className="text-white/60" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {typing && (
                                <div className="flex justify-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                                        <Bot size={14} className="text-gold" />
                                    </div>
                                    <div className="bg-oxford-blue border border-gold/5 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-oxford-blue border-t border-gold/10 items-end flex gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSend(input)
                                        }
                                    }}
                                    placeholder="Type a message in English or Nepali..."
                                    rows={1}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-gold/30 resize-none transition-all pr-10"
                                />
                                <div className="absolute right-3 bottom-2.5 text-[10px] text-white/20">Saathi v3.0</div>
                            </div>
                            <button
                                onClick={() => handleSend(input)}
                                disabled={!input.trim() || typing}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${!input.trim() || typing
                                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                        : 'bg-gold text-oxford-blue hover:bg-gold-light shadow-lg shadow-gold/20'
                                    }`}
                            >
                                <Send size={18} />
                            </button>
                        </div>

                        {/* Disclaimer */}
                        <div className="px-4 py-2 bg-oxford-blue-dark text-center border-t border-gold/5">
                            <p className="text-[10px] text-white/30 italic">
                                AI can make mistakes. For official advice, visit our office in KTM.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

'use client'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function WhatsAppWidget() {
    const pathname = usePathname()
    if (pathname?.startsWith('/admin')) return null

    return (
        <motion.a
            href="https://wa.me/9771XXXXXXXX?text=Hello%20ERI%2C%20I%20would%20like%20to%20inquire%20about%20overseas%20education."
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-2xl shadow-green-500/40 flex items-center justify-center group"
            title="Chat on WhatsApp"
        >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 .007C5.373.007 0 5.373 0 12s5.373 11.993 12 11.993S24 18.627 24 12 18.627.007 12 .007zM12 22c-1.828 0-3.577-.44-5.121-1.213L1.5 22l1.246-4.623A9.934 9.934 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

            {/* Tooltip */}
            <div className="absolute right-16 bg-oxford-blue-dark border border-white/10 text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                Chat on WhatsApp
            </div>
        </motion.a>
    )
}

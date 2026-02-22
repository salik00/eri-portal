'use client'
import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'

export default function FloatingPlane({ className = "", delay = 0 }: { className?: string, delay?: number }) {
    return (
        <motion.div
            initial={{ x: -100, y: 0, opacity: 0, rotate: 15 }}
            animate={{
                x: [null, 1500],
                y: [null, -300],
                opacity: [0, 1, 1, 0]
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.9, 1],
                delay: delay
            }}
            className={`absolute pointer-events-none z-0 ${className}`}
        >
            <div className="relative group">
                <Plane size={64} className="text-gold/30 fill-gold/10 drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
                {/* Shimmering Trail */}
                <div className="absolute top-1/2 left-0 w-48 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-gold/10 -translate-x-full blur-[1px]" />
                <div className="absolute top-1/2 left-0 w-32 h-[1px] bg-gold/20 -translate-x-full blur-[2px] animate-pulse" />
            </div>
        </motion.div>
    )
}

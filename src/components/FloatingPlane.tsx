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
                <Plane size={24} className="text-gold/20 fill-gold/5" />
                <div className="absolute top-1/2 left-0 w-20 h-[1px] bg-gradient-to-r from-transparent to-gold/20 -translate-x-full" />
            </div>
        </motion.div>
    )
}

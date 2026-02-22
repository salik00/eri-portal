'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, GraduationCap, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/authContext'

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Countries', href: '/#countries' },
    { label: 'Course Finder', href: '/#course-finder' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout, isAdmin } = useAuth()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (pathname?.startsWith('/admin')) return null



    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-oxford-blue-dark/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-gold/10'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <GraduationCap size={22} className="text-oxford-blue" />
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Enlightened
                                </div>
                                <div className="text-gold text-xs font-medium tracking-widest uppercase">Research Institute</div>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-8">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors duration-200 hover:text-gold relative group ${pathname === link.href ? 'text-gold' : 'text-white/80'
                                        }`}
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link href="/admin/dashboard" className="text-sm font-medium text-gold/80 hover:text-gold transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:border-gold/30 transition-all duration-200"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                                            <User size={14} className="text-oxford-blue" />
                                        </div>
                                        <span className="text-sm text-white max-w-24 truncate">{user.name}</span>
                                        <ChevronDown size={14} className={`text-white/50 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-48 bg-oxford-blue-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                            >
                                                {user.role === 'student' && (
                                                    <Link href="/student/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">
                                                        <User size={14} className="text-gold" /> Document Vault
                                                    </Link>
                                                )}
                                                {isAdmin && (
                                                    <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">
                                                        <GraduationCap size={14} className="text-gold" /> Admin Panel
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => { logout(); setProfileOpen(false) }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                                                >
                                                    <LogOut size={14} /> Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <>
                                    <Link href="/auth" className="btn-outline text-sm py-2 px-5">Sign In</Link>
                                    <Link href="/auth?tab=register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-oxford-blue-dark/98 backdrop-blur-xl border-t border-white/5"
                        >
                            <div className="px-6 py-4 space-y-1">
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="block py-3 px-3 text-white/80 hover:text-gold hover:bg-white/5 rounded-xl transition-all"
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                <div className="pt-4 flex flex-col gap-3">
                                    {user ? (
                                        <button onClick={() => { logout(); setMenuOpen(false) }} className="btn-outline w-full justify-center">Sign Out</button>
                                    ) : (
                                        <>
                                            <Link href="/auth" onClick={() => setMenuOpen(false)} className="btn-outline w-full justify-center">Sign In</Link>
                                            <Link href="/auth?tab=register" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">Get Started</Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Click outside to close profile dropdown */}
            {profileOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
            )}
        </>
    )
}

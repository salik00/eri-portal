'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const FOOTER_COUNTRIES = ['USA', 'UK', 'Australia', 'Canada', 'Denmark', 'New Zealand', 'France', 'Italy', 'China']
const FOOTER_LINKS = [
    { label: 'About ERI', href: '/#about' },
    { label: 'Course Finder', href: '/#course-finder' },
    { label: 'Student Portal', href: '/dashboard' },
    { label: 'Admin Login', href: '/admin' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
]

export default function Footer() {
    const pathname = usePathname()
    if (pathname?.startsWith('/admin')) return null

    return (
        <footer className="bg-oxford-blue-dark border-t border-gold/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                                <GraduationCap size={22} className="text-oxford-blue" />
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Enlightened</div>
                                <div className="text-gold text-xs font-medium tracking-widest uppercase">Research Institute</div>
                            </div>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed mb-6">
                            Your trusted partner for overseas education. Helping Nepali students achieve their global academic dreams since 2014.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: '#' },
                                { icon: Instagram, href: '#' },
                                { icon: Youtube, href: '#' },
                                { icon: Twitter, href: '#' },
                            ].map(({ icon: Icon, href }, i) => (
                                <a key={i} href={href} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold/20 hover:border-gold/30 transition-all duration-200 text-white/40 hover:text-gold">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Countries */}
                    <div>
                        <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">Destinations</h4>
                        <ul className="space-y-2">
                            {FOOTER_COUNTRIES.map((country) => (
                                <li key={country}>
                                    <Link href={`/countries/${country.toLowerCase().replace(' ', '-')}`} className="text-white/50 hover:text-gold text-sm transition-colors duration-200">
                                        {country}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-white/50 hover:text-gold text-sm transition-colors duration-200">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">Contact Us</h4>
                        <div className="space-y-4">
                            <a href="tel:+97714XXXXXXX" className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gold/20 transition-colors">
                                    <Phone size={14} className="text-gold" />
                                </div>
                                <div>
                                    <div className="text-white/30 text-xs">Phone / WhatsApp</div>
                                    <div className="text-white/70 text-sm group-hover:text-gold transition-colors">+977-1-XXXXXXX</div>
                                </div>
                            </a>
                            <a href="mailto:info@enlightened.com.np" className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gold/20 transition-colors">
                                    <Mail size={14} className="text-gold" />
                                </div>
                                <div>
                                    <div className="text-white/30 text-xs">Email</div>
                                    <div className="text-white/70 text-sm group-hover:text-gold transition-colors">info@enlightened.com.np</div>
                                </div>
                            </a>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin size={14} className="text-gold" />
                                </div>
                                <div>
                                    <div className="text-white/30 text-xs">Address</div>
                                    <div className="text-white/70 text-sm">Kathmandu, Nepal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-sm">
                        © {new Date().getFullYear()} Enlightened Research Institute. All rights reserved.
                    </p>
                    <p className="text-white/20 text-xs">
                        Empowering students to achieve their global dreams. 🌏
                    </p>
                </div>
            </div>
        </footer>
    )
}

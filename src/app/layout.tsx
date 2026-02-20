import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/authContext'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import SaathiBot from '@/components/SaathiBot'

export const metadata: Metadata = {
    title: 'Enlightened Research Institute | Overseas Education Consultancy',
    description: 'Your trusted partner for overseas education. Expert guidance for studying in USA, UK, Australia, Canada, Denmark, New Zealand, France, Italy, and China.',
    keywords: 'overseas education Nepal, study abroad, student visa, ERI, Enlightened Research Institute',
    openGraph: {
        title: 'Enlightened Research Institute',
        description: 'Premium overseas education consultancy with 95%+ visa success rate.',
        type: 'website',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <AuthProvider>
                    <Toaster position="top-right" />
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                    <WhatsAppWidget />
                    <SaathiBot />
                </AuthProvider>
            </body>
        </html>
    )
}

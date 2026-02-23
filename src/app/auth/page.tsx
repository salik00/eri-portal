import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import AuthContent from '@/components/auth/AuthContent'

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-oxford-blue flex items-center justify-center">
                <Loader2 className="animate-spin text-gold" size={40} />
            </div>
        }>
            <AuthContent />
        </Suspense>
    )
}

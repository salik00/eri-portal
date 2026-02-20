// Firebase configuration and service initialization
// In demo mode (NEXT_PUBLIC_DEMO_MODE=true), this file still exports
// the same interface but operations are handled by mockData utilities

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

if (!isDemoMode && typeof window !== 'undefined') {
    // Only initialize Firebase when not in demo mode
    const initFirebase = async () => {
        const { initializeApp, getApps } = await import('firebase/app')
        const { getAuth } = await import('firebase/auth')
        const { getFirestore } = await import('firebase/firestore')
        const { getStorage } = await import('firebase/storage')

        if (!getApps().length) {
            app = initializeApp(firebaseConfig)
        }
        auth = getAuth(app)
        db = getFirestore(app)
        storage = getStorage(app)
    }
    initFirebase()
}

export { app, auth, db, storage }

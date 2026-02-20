'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
    uid: string
    email: string
    name: string
    role: 'student' | 'admin'
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const ADMIN_EMAIL = 'admin@enlightened.com'
const ADMIN_PASSWORD = 'ERI_Admin_2026'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Restore session from localStorage
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('eri_user')
            if (stored) {
                try { setUser(JSON.parse(stored)) } catch { }
            }
            setLoading(false)
        }
    }, [])

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Admin check
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const adminUser: User = { uid: 'admin-001', email, name: 'ERI Administrator', role: 'admin' }
            setUser(adminUser)
            localStorage.setItem('eri_user', JSON.stringify(adminUser))
            return { success: true }
        }

        // Student check (demo mode - any email with 6+ char password)
        const students = JSON.parse(localStorage.getItem('eri_students') || '[]')
        const found = students.find((s: any) => s.email === email && s.password === password)
        if (found) {
            const studentUser: User = { uid: found.uid, email: found.email, name: found.name, role: 'student' }
            setUser(studentUser)
            localStorage.setItem('eri_user', JSON.stringify(studentUser))
            return { success: true }
        }

        return { success: false, error: 'Invalid email or password' }
    }

    const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const students = JSON.parse(localStorage.getItem('eri_students') || '[]')
        if (students.find((s: any) => s.email === email)) {
            return { success: false, error: 'Email already registered' }
        }
        const newStudent = { uid: `student-${Date.now()}`, email, name, password, createdAt: new Date().toISOString() }
        students.push(newStudent)
        localStorage.setItem('eri_students', JSON.stringify(students))
        const studentUser: User = { uid: newStudent.uid, email, name, role: 'student' }
        setUser(studentUser)
        localStorage.setItem('eri_user', JSON.stringify(studentUser))
        return { success: true }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('eri_user')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

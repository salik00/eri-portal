'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Student, Visa, FinanceRecord } from '@/types/crm'
import toast from 'react-hot-toast'

export function useStudentData() {
    const [student, setStudent] = useState<Student | null>(null)
    const [visa, setVisa] = useState<Visa | null>(null)
    const [finance, setFinance] = useState<FinanceRecord[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchStudentContext = async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Get Student Profile
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('profile_id', user.id)
                .single()

            if (studentError) {
                if (studentError.code !== 'PGRST116') throw studentError
                return // Not linked yet
            }
            setStudent(studentData)

            // 2. Get Visa Status
            const { data: visaData } = await supabase
                .from('visas')
                .select('*')
                .eq('student_id', studentData.id)
                .single()
            setVisa(visaData)

            // 3. Get Financial Ledger
            const { data: financeData } = await supabase
                .from('finance')
                .select('*')
                .eq('student_id', studentData.id)
            setFinance(financeData || [])

        } catch (error: any) {
            console.error('Error fetching student context:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudentContext()
    }, [])

    return { student, visa, finance, loading, refresh: fetchStudentContext }
}

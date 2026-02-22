'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CRMDocument, Student } from '@/types/crm'
import toast from 'react-hot-toast'

export type VerificationTask = CRMDocument & {
    student: Student
}

export function useVerification() {
    const [tasks, setTasks] = useState<VerificationTask[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('documents')
                .select('*, student:students(*)')
                .order('uploaded_at', { ascending: false })

            if (error) throw error
            setTasks(data || [])
        } catch (error: any) {
            console.error('Error fetching verification tasks:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()

        const channel = supabase.channel('doc-verification')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, fetchTasks)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const updateDocStatus = async (id: string, status: 'verified' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('documents')
                .update({ status })
                .eq('id', id)

            if (error) throw error
            toast.success(`Document ${status} successfully`)
            // Optimistic update locally
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
        } catch (error: any) {
            toast.error('Failed to update document status')
        }
    }

    return { tasks, loading, updateDocStatus, refreshTasks: fetchTasks }
}

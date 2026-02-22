'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FinanceRecord } from '@/types/crm'
import toast from 'react-hot-toast'

export function useFinance() {
    const [records, setRecords] = useState<FinanceRecord[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchRecords = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('finance')
                .select(`
                    *,
                    student:students (
                        full_name,
                        student_id_format
                    )
                `)
                .order('transaction_date', { ascending: false })

            if (error) throw error
            setRecords(data || [])
        } catch (error: any) {
            console.error('Error fetching finance records:', error.message)
            toast.error('Failed to load financial ledger')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRecords()

        const channel = supabase
            .channel('public:finance')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'finance' }, () => {
                fetchRecords()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const addTransaction = async (record: Omit<FinanceRecord, 'id' | 'created_at'>) => {
        try {
            const { error } = await supabase
                .from('finance')
                .insert([record])

            if (error) throw error
            toast.success('Transaction recorded successfully')
        } catch (error: any) {
            toast.error('Failed to record transaction')
        }
    }

    return { records, loading, addTransaction, refreshFinance: fetchRecords }
}

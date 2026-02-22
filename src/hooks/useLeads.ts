'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Lead } from '@/types/crm'
import toast from 'react-hot-toast'

export function useLeads() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchLeads = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setLeads(data || [])
        } catch (error: any) {
            console.error('Error fetching leads:', error.message)
            toast.error('Failed to load leads')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()

        // Real-time subscription
        const channel = supabase
            .channel('public:leads')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
                fetchLeads()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const updateLeadStatus = async (id: string, status: Lead['status']) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)

            if (error) throw error
            toast.success('Lead status updated')
        } catch (error: any) {
            toast.error('Failed to update status')
        }
    }

    const createLead = async (data: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
        try {
            const { error } = await supabase
                .from('leads')
                .insert([{ ...data, status: 'new' }])

            if (error) throw error
            toast.success('Lead captured successfully')
            fetchLeads()
        } catch (error: any) {
            console.error('Lead creation error:', error)
            toast.error(error.message || 'Failed to save lead')
        }
    }

    const convertToStudent = async (lead: Lead) => {
        try {
            // 1. Create student record
            const { error: studentError } = await supabase
                .from('students')
                .insert([{
                    lead_id: lead.id,
                    full_name: `${lead.first_name} ${lead.last_name}`,
                    preferred_country: lead.country,
                    student_id_format: `ERI-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
                }])

            if (studentError) throw studentError

            // 2. Update lead status
            const { error: leadError } = await supabase
                .from('leads')
                .update({ status: 'converted', updated_at: new Date().toISOString() })
                .eq('id', lead.id)

            if (leadError) throw leadError

            toast.success('Lead converted to Student!')
            fetchLeads()
        } catch (error: any) {
            console.error('Conversion error:', error)
            toast.error(error.message || 'Failed to convert lead')
        }
    }

    return { leads, loading, updateLeadStatus, createLead, convertToStudent, refreshLeads: fetchLeads }
}

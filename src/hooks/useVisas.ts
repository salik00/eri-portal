'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Visa } from '@/types/crm'
import toast from 'react-hot-toast'

export function useVisas() {
    const [visas, setVisas] = useState<Visa[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchVisas = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('visas')
                .select(`
                    *,
                    student:students (
                        full_name,
                        preferred_country
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setVisas(data || [])
        } catch (error: any) {
            console.error('Error fetching visas:', error.message)
            toast.error('Failed to load visa records')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVisas()

        const channel = supabase
            .channel('public:visas')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'visas' }, () => {
                fetchVisas()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const updateVisaStatus = async (id: string, status: Visa['status']) => {
        try {
            const { error } = await supabase
                .from('visas')
                .update({ status })
                .eq('id', id)

            if (error) throw error
            toast.success('Visa status updated')
        } catch (error: any) {
            toast.error('Failed to update visa status')
        }
    }

    const lodgeVisa = async (data: Omit<Visa, 'id' | 'created_at' | 'status'>) => {
        try {
            const { error } = await supabase
                .from('visas')
                .insert([{ ...data, status: 'pending' }])

            if (error) throw error
            toast.success('Visa application lodged')
            fetchVisas()
        } catch (error: any) {
            toast.error('Failed to lodge visa')
        }
    }

    return { visas, loading, updateVisaStatus, lodgeVisa, refreshVisas: fetchVisas }
}

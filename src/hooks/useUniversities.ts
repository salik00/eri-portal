'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { University } from '@/types/crm'
import toast from 'react-hot-toast'

export function useUniversities() {
    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchUniversities = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('universities')
                .select('*')
                .order('ranking', { ascending: true })

            if (error) throw error
            setUniversities(data || [])
        } catch (error: any) {
            console.error('Error fetching universities:', error.message)
            toast.error('Failed to load universities')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUniversities()

        const channel = supabase
            .channel('public:universities')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'universities' }, () => {
                fetchUniversities()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const addUniversity = async (data: Omit<University, 'id' | 'created_at'>) => {
        try {
            const { error } = await supabase
                .from('universities')
                .insert([data])

            if (error) throw error
            toast.success('University added to global registry')
            fetchUniversities()
        } catch (error: any) {
            toast.error('Failed to add university')
        }
    }

    return { universities, loading, addUniversity, refreshUniversities: fetchUniversities }
}

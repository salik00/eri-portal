'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Student } from '@/types/crm'
import toast from 'react-hot-toast'

export function useStudents() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setStudents(data || [])
        } catch (error: any) {
            console.error('Error fetching students:', error.message)
            toast.error('Failed to load students')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()

        const channel = supabase
            .channel('public:students')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
                fetchStudents()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const enrollStudent = async (data: Omit<Student, 'id' | 'created_at'>) => {
        try {
            const { error } = await supabase
                .from('students')
                .insert([data])
            if (error) throw error
            toast.success('Student enrolled successfully')
            fetchStudents()
        } catch (error: any) {
            toast.error('Failed to enroll student')
        }
    }

    const linkProfile = async (studentId: string, profileId: string) => {
        try {
            const cleanProfileId = profileId.trim()
            if (!cleanProfileId) throw new Error('Invalid UUID')

            const { error } = await supabase
                .from('students')
                .update({ profile_id: cleanProfileId })
                .eq('id', studentId)
            if (error) throw error
            toast.success('Profile linked successfully')
            fetchStudents()
        } catch (error: any) {
            toast.error(error.message || 'Failed to link profile')
        }
    }

    return { students, loading, enrollStudent, linkProfile, refreshStudents: fetchStudents }
}

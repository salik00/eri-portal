'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'

export interface SiteSettings {
    id: string
    agency_name: string
    contact_email: string
    office_address: string
    service_fee_npr: number
    express_fee_npr: number
    portal_enabled: boolean
    notifications_enabled: boolean
}

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('id', 'global')
                .single()

            if (error) throw error
            setSettings(data)
        } catch (error: any) {
            console.error('Error fetching settings:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const updateSettings = async (updates: Partial<SiteSettings>) => {
        try {
            const { error } = await supabase
                .from('settings')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', 'global')

            if (error) throw error
            setSettings(prev => prev ? { ...prev, ...updates } : null)
            toast.success('Configuration updated')
        } catch (error: any) {
            toast.error('Failed to update settings')
        }
    }

    return { settings, loading, updateSettings, refresh: fetchSettings }
}

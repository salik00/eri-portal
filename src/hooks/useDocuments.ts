'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CRMDocument } from '@/types/crm'
import toast from 'react-hot-toast'

export function useDocuments(studentId?: string) {
    const [documents, setDocuments] = useState<CRMDocument[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchDocuments = async () => {
        if (!studentId) return
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('student_id', studentId)
                .order('uploaded_at', { ascending: false })

            if (error) throw error
            setDocuments(data || [])
        } catch (error: any) {
            console.error('Error fetching documents:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [studentId])

    const uploadDocument = async (file: File, type: string) => {
        if (!studentId) return
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${studentId}/${Date.now()}.${fileExt}`
            const filePath = `student-docs/${fileName}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('eri-portal-docs')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Clear previous metadata for this type if needed? 
            // Better to just insert new one.

            // 3. Save Metadata
            const { error: metaError } = await supabase
                .from('documents')
                .insert({
                    student_id: studentId,
                    name: file.name,
                    type,
                    url: filePath,
                    size: `${(file.size / 1024).toFixed(1)} KB`,
                    status: 'pending'
                })

            if (metaError) throw metaError

            toast.success(`${file.name} uploaded successfully`)
            fetchDocuments()
        } catch (error: any) {
            console.error('Upload error:', error.message)
            toast.error('Failed to upload document')
        }
    }

    const deleteDocument = async (id: string, storagePath: string) => {
        try {
            // Delete from storage
            await supabase.storage.from('eri-portal-docs').remove([storagePath])

            // Delete metadata
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', id)

            if (error) throw error
            setDocuments(prev => prev.filter(d => d.id !== id))
            toast.success('Document removed')
        } catch (error: any) {
            toast.error('Failed to remove document')
        }
    }

    return { documents, loading, uploadDocument, deleteDocument, refreshDocuments: fetchDocuments }
}

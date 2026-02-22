'use client'
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex h-screen bg-oxford-blue text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <AdminHeader onMenuClick={() => setMobileOpen(true)} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#0a1128] p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

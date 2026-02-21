import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata = {
    title: 'Command Center | ERI Portal',
    description: 'Enlightened Research Institute Admin Dashboard and CRM',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-oxford-blue text-white overflow-hidden font-sans">
            {/* Sidebar (Hidden on Mobile, flex on MD+) */}
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <AdminHeader />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#0a1128] p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

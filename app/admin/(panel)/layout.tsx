import { Suspense } from 'react'
import { AdminNav, AdminNavFallback, AdminSidebarFrame } from '@/components/admin/AdminSidebar'
import { PhaseNotice } from '@/components/admin/AdminUi'

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminSidebarFrame>
        <Suspense fallback={<AdminNavFallback />}>
          <AdminNav />
        </Suspense>
      </AdminSidebarFrame>
      <main id="main" className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-10 sm:px-8 lg:px-14">
        <PhaseNotice />
        {children}
      </main>
    </div>
  )
}

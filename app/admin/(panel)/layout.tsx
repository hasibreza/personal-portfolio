import { Suspense } from 'react'
import { AdminNav, AdminNavFallback, AdminSidebarFrame } from '@/components/admin/AdminSidebar'
import { signOut } from './actions'

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <AdminSidebarFrame
        footer={
          <form action={signOut}>
            <button
              type="submit"
              className="text-ink-2 hover:text-ink min-h-11 cursor-pointer border-0 bg-transparent px-2 text-left"
            >
              Sign out
            </button>
          </form>
        }
      >
        <Suspense fallback={<AdminNavFallback />}>
          <AdminNav />
        </Suspense>
      </AdminSidebarFrame>
      <main id="main" className="flex min-w-0 flex-1 flex-col gap-8 px-4 py-10 sm:px-8 lg:px-14">
        <Suspense fallback={<p className="text-ink-2 m-0">Loading…</p>}>{children}</Suspense>
      </main>
    </div>
  )
}

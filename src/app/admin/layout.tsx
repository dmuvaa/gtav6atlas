import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminStaffBar } from "@/components/admin/AdminStaffBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell
      staffBar={
        <Suspense fallback={<span className="text-sm text-muted">…</span>}>
          <AdminStaffBar />
        </Suspense>
      }
    >
      {children}
    </AdminShell>
  );
}
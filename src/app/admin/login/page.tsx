import Link from "next/link";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { ADMIN_CONSOLE_MIN_ROLE } from "@/lib/auth/staff-access";

export const metadata = buildMetadata({
  title: "Staff sign-in",
  description: "GTA6AtlasHQ staff console",
  path: "/admin/login",
  noIndex: true,
});

export default function AdminLoginPage(props: PageProps<"/admin/login">) {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginPageContent {...props} />
    </Suspense>
  );
}

function AdminLoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <p className="text-muted">Loading…</p>
    </div>
  );
}

async function AdminLoginPageContent({
  searchParams,
}: PageProps<"/admin/login">) {
  const params = await searchParams;
  const from =
    typeof params?.from === "string" ? params.from : "/admin/dashboard";
  const next = encodeURIComponent(from);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-vi-pink-bright">
          Staff console
        </p>
        <h1 className="mt-2 font-display text-2xl text-foreground">
          Sign in with staff access
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Use your normal site account. Access requires{" "}
          <strong className="text-foreground">
            {ROLE_LABELS[ADMIN_CONSOLE_MIN_ROLE]}
          </strong>{" "}
          role or higher on your profile.
        </p>
        <Link
          href={`/auth/login?next=${next}`}
          className="btn-primary mt-8 block w-full rounded-xl px-5 py-3 text-center text-sm"
        >
          Sign in
        </Link>
        <p className="mt-6 text-xs text-muted">
          No access? Ask a site administrator to grant staff access, then sign in
          again.
        </p>
        <p className="mt-4 text-xs text-muted">
          <Link href="/" className="text-vi-pink-bright hover:underline">
            ← Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}
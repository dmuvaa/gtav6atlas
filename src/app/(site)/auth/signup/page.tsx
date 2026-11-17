import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create account",
  description: "Create a GTA6AtlasHQ account",
  path: "/auth/signup",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Create account" },
        ]}
      />
      <PageHeader
        title="Create account"
        description="Optional accounts unlock saved entries and discovery tracking in later phases."
      />
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
        <AuthForm mode="signup" />
        <p className="mt-6 text-center text-sm text-muted">
          Already registered?{" "}
          <Link href="/auth/login" className="text-vi-pink-bright underline">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
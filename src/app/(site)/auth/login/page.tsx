import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to GTA6AtlasHQ",
  path: "/auth/login",
  noIndex: true,
});

export default function LoginPage(props: PageProps<"/auth/login">) {
  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sign in" },
        ]}
      />
      <PageHeader
        title="Sign in"
        description="Save progress, submissions and companion tools (as they roll out)."
      />
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
        <Suspense fallback={null}>
          <LoginFormWithRedirect searchParams={props.searchParams} />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/auth/signup" className="text-vi-pink-bright underline">
            Create one
          </Link>
        </p>
      </div>
    </Container>
  );
}

async function LoginFormWithRedirect({
  searchParams,
}: {
  searchParams: PageProps<"/auth/login">["searchParams"];
}) {
  const params = await searchParams;
  const redirectTo =
    typeof params?.next === "string" ? params.next : "/";
  return <AuthForm mode="login" redirectTo={redirectTo} />;
}
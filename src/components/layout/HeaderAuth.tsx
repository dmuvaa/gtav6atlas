"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function HeaderAuth() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (mounted) setSignedIn(!!data.session);
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) setSignedIn(!!session);
      });
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } catch {
      if (mounted) setSignedIn(false);
      return () => {
        mounted = false;
      };
    }
  }, []);

  if (signedIn === null) {
    return (
      <span className="text-sm font-medium text-muted" aria-hidden>
        …
      </span>
    );
  }

  if (signedIn) {
    return (
      <Link
        href="/account"
        className="text-sm font-medium text-vi-pink-bright hover:text-foreground"
      >
        Account
      </Link>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="text-sm font-medium text-muted hover:text-vi-pink-bright"
    >
      Sign in
    </Link>
  );
}
"use client";

import { useEffect, useState } from "react";

type LocationOption = { id: string; name: string; slug: string };

export function LocationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/cms/options/locations");
      const data = await res.json().catch(() => ({}));
      if (!cancelled && Array.isArray(data.locations)) {
        setOptions(data.locations);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
    >
      <option value="">{loading ? "Loading locations…" : "— No location —"}</option>
      {options.map((loc) => (
        <option key={loc.id} value={loc.id}>
          {loc.name} ({loc.slug})
        </option>
      ))}
    </select>
  );
}
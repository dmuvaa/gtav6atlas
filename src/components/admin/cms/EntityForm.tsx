"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CMS_ENTITIES,
  type CmsEntityDefinition,
  type CmsEntityKey,
} from "@/lib/cms/entity-registry";
import { slugify } from "@/lib/cms/slug";
import { CmsDeleteButton } from "./CmsDeleteButton";
import { HeroImageField } from "./HeroImageField";
import { LocationPicker } from "./LocationPicker";

export function EntityForm({
  entityKey,
  entityId,
}: {
  entityKey: CmsEntityKey;
  entityId?: string;
}) {
  const mode = entityId ? "edit" : "create";
  const def = CMS_ENTITIES[entityKey];
  const router = useRouter();
  const initial = useMemo(() => buildInitialState(def), [def]);
  const [values, setValues] = useState<Record<string, unknown> | null>(
    mode === "create" ? initial : null,
  );
  const [status, setStatus] = useState<
    "loading" | "idle" | "saving" | "error" | "done"
  >(mode === "edit" ? "loading" : "idle");
  const [message, setMessage] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "create") return;
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/cms/${entityKey}/${entityId}`);
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Failed to load record");
        return;
      }
      setValues({ ...initial, ...(data.values as Record<string, unknown>) });
      setStatus("idle");
    })();
    return () => {
      cancelled = true;
    };
  }, [entityKey, entityId, mode]);

  function setField(name: string, value: unknown) {
    setValues((v) => {
      if (!v) return v;
      const next = { ...v, [name]: value };
      const titleKey =
        "title" in v ? "title" : "name" in v ? "name" : undefined;
      if (
        titleKey &&
        name === titleKey &&
        typeof value === "string" &&
        !String(v.slug ?? "").length
      ) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  const entitySlug =
    typeof values?.slug === "string" && values.slug.length
      ? values.slug
      : typeof values?.name === "string"
        ? slugify(values.name)
        : typeof values?.title === "string"
          ? slugify(values.title)
          : "draft";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setStatus("saving");
    setMessage("");
    const payload = { ...values };
    if (payload.slug === "") delete payload.slug;

    const url =
      mode === "edit"
        ? `/api/cms/${entityKey}/${entityId}`
        : `/api/cms/${entityKey}`;
    const res = await fetch(url, {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Save failed");
      return;
    }
    setStatus("done");
    setMessage(mode === "edit" ? "Saved." : `Created (id ${data.id})`);
    setResultUrl(data.publicUrl ?? null);
    if (mode === "create" && data.id) {
      router.push(`/admin/edit/${entityKey}/${data.id}`);
    }
  }

  if (!values || status === "loading") {
    return <p className="text-sm text-muted">Loading form…</p>;
  }

  const recordName =
    typeof values.name === "string"
      ? values.name
      : typeof values.title === "string"
        ? values.title
        : def.label;

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {def.fields.map((field) => (
        <Field
          key={field.name}
          field={field}
          value={values[field.name]}
          entityKey={entityKey}
          entitySlug={entitySlug}
          entityId={entityId}
          onChange={(val) => setField(field.name, val)}
        />
      ))}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-primary rounded-xl px-5 py-2.5 text-sm"
        >
          {status === "saving"
            ? "Saving…"
            : mode === "edit"
              ? "Save changes"
              : `Create ${def.label.toLowerCase()}`}
        </button>
      </div>
      {status === "error" ? (
        <p className="text-sm text-red-400" role="status">
          {message}
        </p>
      ) : null}
      {status === "done" ? (
        <p className="text-sm text-vi-pink-bright" role="status">
          {message}
          {resultUrl ? (
            <>
              {" "}
              <Link href={resultUrl} className="underline">
                View public URL
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
      {mode === "edit" && entityId ? (
        <CmsDeleteButton
          entityKey={entityKey}
          entityId={entityId}
          recordName={recordName}
          redirectTo={adminListPath(entityKey)}
        />
      ) : null}
    </form>
  );
}

function adminListPath(key: CmsEntityKey): string {
  const map: Record<CmsEntityKey, string> = {
    character: "/admin/characters",
    location: "/admin/locations",
    vehicle: "/admin/vehicles",
    business: "/admin/businesses",
    discovery: "/admin/discoveries",
    article: "/admin/articles",
    "map-layer": "/admin/maps",
    "map-marker": "/admin/maps",
    source: "/admin/create",
    "media-asset": "/admin/create",
  };
  return map[key];
}

function buildInitialState(def: CmsEntityDefinition) {
  const state: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (f.type === "checkbox") state[f.name] = false;
    else if (f.type === "number") state[f.name] = "";
    else if (f.type === "select" && f.options?.[0]) {
      state[f.name] =
        f.name === "verification_status" ? "unverified" : f.options[0].value;
    } else state[f.name] = "";
  }
  return state;
}

function Field({
  field,
  value,
  onChange,
  entityKey,
  entitySlug,
  entityId,
}: {
  field: CmsEntityDefinition["fields"][number];
  value: unknown;
  onChange: (v: unknown) => void;
  entityKey: CmsEntityKey;
  entitySlug: string;
  entityId?: string;
}) {
  const id = `field-${field.name}`;
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted">
        {field.label}
        {field.required ? " *" : ""}
      </label>
      {field.type === "hero" ? (
        <HeroImageField
          entityType={entityKey}
          entitySlug={entitySlug}
          entityId={entityId}
          value={String(value ?? "")}
          onChange={(path) => onChange(path)}
        />
      ) : field.type === "location" ? (
        <LocationPicker
          value={String(value ?? "")}
          onChange={(v) => onChange(v)}
        />
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          required={field.required}
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      ) : field.type === "checkbox" ? (
        <div className="mt-1">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4"
          />
        </div>
      ) : field.type === "select" ? (
        <select
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : "text"}
          required={field.required}
          placeholder={field.placeholder}
          value={value === "" || value === undefined ? "" : String(value)}
          onChange={(e) =>
            onChange(
              field.type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value,
            )
          }
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}
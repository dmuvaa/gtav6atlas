import { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_ISO } from "@/lib/constants";

export function LegalDoc({
  children,
  lastUpdated = LEGAL_LAST_UPDATED,
}: {
  children: React.ReactNode;
  lastUpdated?: string;
}) {
  return (
    <>
      <p className="text-sm text-muted">
        Last updated{" "}
        <time dateTime={LEGAL_LAST_UPDATED_ISO}>{lastUpdated}</time>
      </p>
      <div className="prose-atlas mt-8 max-w-3xl">{children}</div>
    </>
  );
}
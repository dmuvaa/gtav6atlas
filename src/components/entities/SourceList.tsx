import type { Source } from "@/lib/types";

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) {
    return (
      <p className="text-sm text-muted">No sources recorded yet.</p>
    );
  }
  return (
    <ul className="space-y-3">
      {sources.map((source) => (
        <li
          key={source.id}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:underline"
          >
            {source.title}
          </a>
          <p className="mt-1 text-sm text-muted">
            {source.publisher}
            {source.publicationDate
              ? ` · ${source.publicationDate}`
              : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
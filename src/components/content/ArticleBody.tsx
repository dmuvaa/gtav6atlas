function renderInline(text: string) {
  const linkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (linkMatch) {
    const [full, label, href] = linkMatch;
    const [before, after] = text.split(full);
    return (
      <>
        {before}
        <a href={href} className="text-accent underline underline-offset-2">
          {label}
        </a>
        {after}
      </>
    );
  }
  return text;
}

export function ArticleBody({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="prose-atlas max-w-3xl">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return <h2 key={i}>{trimmed.replace(/^##\s+/, "")}</h2>;
        }
        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j}>{renderInline(item.replace(/^-\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <p key={i} className="font-medium text-foreground">
              {trimmed.replace(/\*\*/g, "")}
            </p>
          );
        }
        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}
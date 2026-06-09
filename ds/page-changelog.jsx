/* Tollerud DS — Changelog page: fetches ../CHANGELOG.md and renders it. → window.PageChangelog */
function PageChangelog() {
  const [entries, setEntries] = useState(null);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch('./CHANGELOG.md')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(md => setEntries(parseChangelog(md)))
      .catch(e => setError(e.message));
  }, []);

  if (error) return (
    <Section title="Changelog">
      <p style={{ color: 'var(--destructive)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
        Failed to load CHANGELOG.md — {error}
      </p>
    </Section>
  );

  if (!entries) return (
    <Section title="Changelog">
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        <div className="tollerud-spinner" style={{ width: 16, height: 16 }}/>
        Loading…
      </div>
    </Section>
  );

  return (
    <div>
      <Section title="Changelog" desc="Every release, in order. All API changes are noted." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {entries.map((entry, i) => (
          <ChangelogEntry key={i} entry={entry} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}

/* ── Entry component ── */
function ChangelogEntry({ entry, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      background: 'var(--surface-raised)',
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
          gap: 12, padding: '14px 20px', background: 'none', border: 'none',
          cursor: 'pointer', borderBottom: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
          color: 'var(--tollerud-yellow)', minWidth: 60,
        }}>
          {entry.version || '—'}
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', flex: 1 }}>
          {entry.title}
        </span>
        {entry.date && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {entry.date}
          </span>
        )}
        <span style={{
          fontSize: 11, color: 'var(--text-muted)', marginLeft: 4,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
          display: 'inline-block',
        }}>▼</span>
      </button>

      {/* Body */}
      {open && (
        <div style={{ padding: '16px 20px' }}>
          <ChangelogBody blocks={entry.blocks} />
        </div>
      )}
    </div>
  );
}

/* ── Render parsed blocks ── */
function ChangelogBody({ blocks }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
      {blocks.map((block, i) => {
        if (block.type === 'p') return (
          <p key={i} style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: inlineMarkdown(block.text) }}/>
        );
        if (block.type === 'h3') return (
          <p key={i} style={{ margin: '4px 0 2px', fontWeight: 600, color: 'var(--foreground)', borderTop: i > 0 ? '1px solid var(--border)' : 'none', paddingTop: i > 0 ? 12 : 0 }}
             dangerouslySetInnerHTML={{ __html: inlineMarkdown(block.text) }}/>
        );
        if (block.type === 'ul') return (
          <ul key={i} style={{ margin: 0, paddingLeft: 20, listStyleType: 'disc' }}>
            {block.items.map((item, j) => (
              <li key={j} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }}/>
            ))}
          </ul>
        );
        if (block.type === 'code') return (
          <pre key={i} style={{
            margin: 0, padding: '10px 14px', borderRadius: 6, fontSize: 12, lineHeight: 1.6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', overflowX: 'auto', color: 'var(--foreground)',
          }}><code>{block.text}</code></pre>
        );
        return null;
      })}
    </div>
  );
}

/* ── Parser ── */
function parseChangelog(md) {
  const lines = md.split('\n');
  const entries = [];
  let current = null;
  let inCode = false;
  let codeLines = [];
  let afterBlank = true; // start true so first line of an entry starts a fresh paragraph

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code fence
    if (line.trimStart().startsWith('```')) {
      if (inCode) {
        inCode = false;
        if (current) current.blocks.push({ type: 'code', text: codeLines.join('\n') });
        codeLines = [];
      } else {
        inCode = true;
      }
      afterBlank = true;
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    // Blank line — break paragraph continuity
    if (!line.trim()) {
      afterBlank = true;
      continue;
    }

    // H2 = new entry  (## 1.1.3 — 2026-06-09 — Title)
    if (/^## /.test(line)) {
      if (current) entries.push(current);
      const rest = line.slice(3).trim();
      const versionMatch = rest.match(/^(\d+\.\d+\.\d+)\s*[—–-]\s*/);
      let version = null, remainder = rest;
      if (versionMatch) {
        version = versionMatch[1];
        remainder = rest.slice(versionMatch[0].length);
      }
      const dateMatch = remainder.match(/^(\d{4}-\d{2}-\d{2})\s*[—–-]\s*/);
      let date = null;
      if (dateMatch) {
        date = dateMatch[1];
        remainder = remainder.slice(dateMatch[0].length);
      }
      current = { version, date, title: remainder.trim(), blocks: [] };
      afterBlank = true;
      continue;
    }

    if (!current) continue;

    // H3
    if (/^### /.test(line)) {
      current.blocks.push({ type: 'h3', text: line.slice(4).trim() });
      afterBlank = true;
      continue;
    }

    // H4
    if (/^#### /.test(line)) {
      current.blocks.push({ type: 'h3', text: line.slice(5).trim() });
      afterBlank = true;
      continue;
    }

    // Bold line used as a section heading (e.g. **1. Title**)
    if (/^\*\*[^*]+\*\*/.test(line.trim()) && afterBlank) {
      current.blocks.push({ type: 'h3', text: line.trim() });
      afterBlank = false;
      continue;
    }

    // List item
    if (/^[-*] /.test(line.trimStart())) {
      const text = line.trimStart().slice(2).trim();
      const last = current.blocks[current.blocks.length - 1];
      if (last && last.type === 'ul') {
        last.items.push(text);
      } else {
        current.blocks.push({ type: 'ul', items: [text] });
      }
      afterBlank = false;
      continue;
    }

    // Paragraph — only continue previous p if no blank line since it
    const trimmed = line.trim();
    const last = current.blocks[current.blocks.length - 1];
    if (!afterBlank && last && last.type === 'p') {
      last.text += ' ' + trimmed;
    } else {
      current.blocks.push({ type: 'p', text: trimmed });
    }
    afterBlank = false;
  }

  // Flush any unclosed code block at EOF
  if (inCode && current && codeLines.length) {
    current.blocks.push({ type: 'code', text: codeLines.join('\n') });
  }
  if (current) entries.push(current);
  return entries;
}

/* ── Inline markdown → HTML ── */
function inlineMarkdown(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);font-size:0.9em;background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1px 5px">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:var(--tollerud-yellow);text-decoration:underline;text-underline-offset:2px">$1</a>');
}

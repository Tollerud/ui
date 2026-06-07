/* Tollerud DS — DataTable: config-driven table with search, filter, sort,
   selection + bulk actions, per-row menus, pagination and an empty state.
   → window.DataTable

   columns: [{ key, header, sortable, align, width, render(row) }]
   props:   rows, rowKey, searchable, searchKeys, searchPlaceholder,
            filter:{ key, options?, allLabel }, selectable, pageSize,
            bulkActions:[{ label, icon, variant, onRun(ids, clear) }],
            rowMenu(row) -> items[], toolbarRight, emptyState
*/
function DataTable({
  rows = [], rowKey = 'id', columns = [],
  searchable = false, searchKeys, searchPlaceholder = 'Search…',
  filter, selectable = false, pageSize = 8,
  bulkActions = [], rowMenu, toolbarRight, emptyState, loading = false, skeletonRows = 5,
}) {
  const [q, setQ] = useState('');
  const [fval, setFval] = useState('all');
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [sel, setSel] = useState([]);
  const [page, setPage] = useState(1);

  const keyOf = (row) => row[rowKey];
  const filterOpts = filter ? (filter.options || Array.from(new Set(rows.map(r => r[filter.key])))) : null;
  const skeys = searchKeys || columns.map(c => c.key);

  let view = rows.filter(r =>
    (!filter || fval === 'all' || r[filter.key] === fval) &&
    (!q || skeys.some(k => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase()))));
  if (sort.key) {
    view = [...view].sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = String(bv).toLowerCase(); }
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.dir === 'asc' ? 1 : -1);
    });
  }

  const pages = Math.max(1, Math.ceil(view.length / pageSize));
  const cur = Math.min(page, pages);
  const pageRows = view.slice((cur - 1) * pageSize, cur * pageSize);

  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  const allOnPage = pageRows.length > 0 && pageRows.every(r => sel.includes(keyOf(r)));
  const toggleAll = () => setSel(allOnPage ? sel.filter(id => !pageRows.find(r => keyOf(r) === id)) : Array.from(new Set([...sel, ...pageRows.map(keyOf)])));
  const toggleOne = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const clearSel = () => setSel([]);
  const colSpan = columns.length + (selectable ? 1 : 0) + (rowMenu ? 1 : 0);

  const SortHead = ({ col }) => (
    <th style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none', textAlign: col.align || 'left', width: col.width }}
      onClick={col.sortable ? () => toggleSort(col.key) : undefined}>
      <span className="ds-row" style={{ gap: 4, display: 'inline-flex', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
        {col.header}
        {col.sortable && (
          <span style={{ opacity: sort.key === col.key ? 1 : 0.25, color: sort.key === col.key ? 'var(--tollerud-yellow)' : 'currentColor', display: 'inline-flex' }}>
            <Icons.chevDown size={12} style={{ transform: sort.key === col.key && sort.dir === 'desc' ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}/>
          </span>
        )}
      </span>
    </th>
  );

  return (
    <div className="tollerud-card ds-themed" style={{ padding: 0, overflow: 'hidden' }}>
      {/* toolbar */}
      {(searchable || filter || toolbarRight) && (
        <div className="ds-row" style={{ justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <div className="ds-row" style={{ gap: 10, flexWrap: 'wrap' }}>
            {searchable && (
              <div className="tollerud-input ds-row" style={{ gap: 8, width: 230, padding: '0 11px', height: 36 }}>
                <Icons.search size={15}/>
                <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder={searchPlaceholder}
                  style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--foreground)', fontSize: 13.5, fontFamily: 'var(--font-sans)' }}/>
                {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><Icons.x size={13}/></button>}
              </div>
            )}
            {filter && (
              <div className="tollerud-segmented ds-themed">
                <button aria-pressed={fval === 'all'} onClick={() => { setFval('all'); setPage(1); }}>{filter.allLabel || 'All'}</button>
                {filterOpts.map(o => <button key={o} aria-pressed={fval === o} onClick={() => { setFval(o); setPage(1); }}>{o}</button>)}
              </div>
            )}
          </div>
          {toolbarRight}
        </div>
      )}

      {/* bulk bar */}
      {selectable && sel.length > 0 && (
        <div className="ds-row" style={{ justifyContent: 'space-between', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'color-mix(in srgb, var(--tollerud-yellow) 7%, transparent)' }}>
          <span className="ds-row" style={{ gap: 8, fontSize: 13, color: 'var(--foreground)' }}>
            <span className="tollerud-badge tollerud-badge--accent">{sel.length}</span> selected
          </span>
          <div className="ds-row" style={{ gap: 8 }}>
            {bulkActions.map((b, i) => (
              <Button key={i} variant={b.variant || 'ghost'} size="sm" onClick={() => b.onRun(sel, clearSel)}>
                {b.icon && React.createElement(Icons[b.icon], { size: 13 })}{b.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* table, skeleton or empty */}
      {loading ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="ds-table ds-table--rows" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                {selectable && <th style={{ width: 40, paddingRight: 0 }}></th>}
                {columns.map(col => <th key={col.key} style={{ textAlign: col.align || 'left' }}>{col.header}</th>)}
                {rowMenu && <th style={{ width: 44 }}></th>}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i}>
                  {selectable && <td style={{ paddingRight: 0 }}><Skeleton w={16} h={16} r={4}/></td>}
                  {columns.map((col, j) => (
                    <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                      <Skeleton w={j === 0 ? '70%' : (col.align === 'right' ? '40%' : '55%')} h={12}/>
                    </td>
                  ))}
                  {rowMenu && <td><Skeleton w={16} h={16} r={4}/></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : view.length === 0 ? (
        <div style={{ padding: emptyState ? 8 : 0 }}>
          {emptyState || <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 13 }}>No results.</div>}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="ds-table ds-table--rows" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                {selectable && <th style={{ width: 40, paddingRight: 0 }}><Checkbox checked={allOnPage} onChange={toggleAll}/></th>}
                {columns.map(col => <SortHead key={col.key} col={col}/>)}
                {rowMenu && <th style={{ width: 44 }}></th>}
              </tr>
            </thead>
            <tbody>
              {pageRows.map(row => {
                const id = keyOf(row);
                const isSel = sel.includes(id);
                return (
                  <tr key={id} style={isSel ? { background: 'color-mix(in srgb, var(--tollerud-yellow) 5%, transparent)' } : undefined}>
                    {selectable && <td style={{ paddingRight: 0 }}><Checkbox checked={isSel} onChange={() => toggleOne(id)}/></td>}
                    {columns.map(col => (
                      <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                        {col.render ? col.render(row) : <span className="ds-mono" style={{ fontSize: 12.5 }}>{row[col.key]}</span>}
                      </td>
                    ))}
                    {rowMenu && (
                      <td>
                        <DropdownMenu trigger={<button className="ds-iconbtn" style={{ width: 28, height: 28, border: 'none', background: 'transparent' }}><Icons.settings size={15}/></button>} items={rowMenu(row)}/>
                      </td>
                    )}
                  </tr>
                );
              })}
              {Array.from({ length: Math.max(0, pageSize - pageRows.length) }).map((_, i) => (
                <tr key={`__spacer_${i}`} aria-hidden="true" style={{ height: 49 }}>
                  <td colSpan={colSpan}/>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* footer / pagination */}
      {!loading && view.length > 0 && (
        <div className="ds-row" style={{ justifyContent: 'space-between', gap: 12, padding: '12px 16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Showing {(cur - 1) * pageSize + 1}–{(cur - 1) * pageSize + pageRows.length} of {view.length}
          </span>
          {pages > 1 && (
            <div className="tollerud-pagination ds-themed">
              <button disabled={cur === 1} onClick={() => setPage(cur - 1)}><Icons.chevLeft size={15}/></button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} aria-current={cur === n ? 'page' : undefined} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button disabled={cur === pages} onClick={() => setPage(cur + 1)}><Icons.chevRight size={15}/></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
window.DataTable = DataTable;

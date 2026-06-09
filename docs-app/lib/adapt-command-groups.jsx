import { Icons } from '../components/kit/icons'

/** Map docs command items (string icon keys) to npm CommandMenu ActionItem shape. */
export function adaptCommandGroups(groups) {
  return groups.map((g) => ({
    label: g.label,
    items: g.items.map((it) => {
      const Icon = it.icon ? Icons[it.icon] : null
      return {
        id: it.id,
        label: it.label,
        description: it.description,
        shortcut: it.shortcut,
        onSelect: it.onSelect,
        icon: Icon ? <Icon size={17} /> : undefined,
        searchText: it.searchText,
      }
    }),
  }))
}

/** npm CommandMenu filter — respects docs searchText from cmd-registry. */
export function docsCommandFilter(query, groups) {
  if (!query.trim()) return groups
  const q = query.toLowerCase()
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        const hay = [it.label, it.description, it.searchText].filter(Boolean).join(' ').toLowerCase()
        return hay.includes(q)
      }),
    }))
    .filter((g) => g.items.length > 0)
}

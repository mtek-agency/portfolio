export function parseTags(tags: string | null | undefined): string[] {
  return (tags ?? '').split(',').map(t => t.trim()).filter(Boolean)
}

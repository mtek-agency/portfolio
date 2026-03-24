export function coverImageSrc(path: string | null | undefined): string | null {
  if (!path) return null
  return path.startsWith('http') ? path : `/api/images/${path}`
}

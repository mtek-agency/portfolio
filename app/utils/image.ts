// Les images viennent de l'API Studio sous forme d'URL absolues (stockage public).
export function coverImageSrc(path: string | null | undefined): string | null {
  return path || null
}

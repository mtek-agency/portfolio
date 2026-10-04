// Anciennes URLs d'images (/api/images/<clé>) : encore présentes dans des pages indexées et des liens externes.
// On renvoie vers l'API Studio, qui redirige vers le stockage public après avoir validé le chemin.
export default defineEventHandler((event) => {
  const { apiUrl, publicUrl } = useRuntimeConfig(event).studio
  const raw = (event.path.split('?')[0] ?? '').replace(/^\/api\/images\//, '')
  // Chaque segment est décodé puis ré-encodé : l'adresse de redirection est toujours bien formée.
  const path = raw.split('/').map((s) => {
    try { return encodeURIComponent(decodeURIComponent(s)) }
    catch { return '' }
  }).join('/')
  return sendRedirect(event, `${publicUrl || apiUrl}/api/images/${path}`, 301)
})

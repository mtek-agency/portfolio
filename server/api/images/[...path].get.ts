// Anciennes URLs d'images (/api/images/<clé>) : encore présentes dans des pages indexées et des liens externes.
// On renvoie vers l'API Studio, qui redirige vers le stockage public après avoir validé le chemin.
export default defineEventHandler((event) => {
  const { apiUrl } = useRuntimeConfig(event).studio
  const raw = (event.path.split('?')[0] ?? '').replace(/^\/api\/images\//, '')
  return sendRedirect(event, `${apiUrl}/api/images/${raw}`, 301)
})

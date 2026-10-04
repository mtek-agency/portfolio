export default defineEventHandler(async (event) => {
  const { projects } = await fetchSitemap(event)
  return projects.map(p => ({ loc: `/projets/${p.slug}`, lastmod: p.updated_at, changefreq: 'monthly', priority: 0.7 }))
})

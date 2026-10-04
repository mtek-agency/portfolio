export default defineEventHandler(async (event) => {
  const { articles } = await fetchSitemap(event)
  return articles.map(a => ({ loc: `/blog/${a.slug}`, lastmod: a.updated_at, changefreq: 'weekly', priority: 0.8 }))
})

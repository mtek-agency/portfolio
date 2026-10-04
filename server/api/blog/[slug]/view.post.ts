export default defineEventHandler(async (event) => {
  await studioFetch(event, `/articles/${encodeURIComponent(getRouterParam(event, 'slug') ?? '')}/views`, { method: 'POST' })
  setResponseStatus(event, 204)
  return null
})

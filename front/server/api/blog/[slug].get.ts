export default defineEventHandler(event => fetchPost(event, getRouterParam(event, 'slug') ?? ''))

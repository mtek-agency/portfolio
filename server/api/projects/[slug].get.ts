export default defineEventHandler(event => fetchProject(event, getRouterParam(event, 'slug') ?? ''))

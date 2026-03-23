import { tools } from '~~/server/db/schema'

// Runs only in development and only if tables are empty
export default defineNitroPlugin(async (): Promise<void> => {

    return
    // ── Tools ─────────────────────────────────────────────────────────────────
    await db.insert(tools).values([
        // Dev & Code
        { name: 'GitHub', url: 'https://github.com', category: 'dev', order: 0, isActive: true },
        { name: 'VS Code', url: 'https://code.visualstudio.com', category: 'dev', order: 1, isActive: true },
        { name: 'Nuxt', url: 'https://nuxt.com', category: 'dev', order: 2, isActive: true },
        { name: 'Drizzle ORM', url: 'https://orm.drizzle.team', category: 'dev', order: 3, isActive: true },
        { name: 'npm', url: 'https://www.npmjs.com', category: 'dev', order: 4, isActive: true },
        // Design
        { name: 'Figma', url: 'https://figma.com', category: 'design', order: 0, isActive: true },
        { name: 'Unsplash', url: 'https://unsplash.com', category: 'design', order: 1, isActive: true },
        { name: 'Iconify', url: 'https://iconify.design', category: 'design', order: 2, isActive: true },
        // Hosting & Cloud
        { name: 'NuxtHub', url: 'https://hub.nuxt.com', category: 'hosting', order: 0, isActive: true },
        { name: 'Cloudflare', url: 'https://cloudflare.com', category: 'hosting', order: 1, isActive: true },
        { name: 'Vercel', url: 'https://vercel.com', category: 'hosting', order: 2, isActive: false },
        // Analytics
        { name: 'Umami', url: 'https://umami.is', category: 'analytics', order: 0, isActive: true },
        { name: 'Brevo', url: 'https://brevo.com', category: 'analytics', order: 1, isActive: true },
        // Social
        { name: 'Twitter / X', url: 'https://x.com', category: 'social', order: 0, isActive: true },
        { name: 'LinkedIn', url: 'https://linkedin.com', category: 'social', order: 1, isActive: true },
        // Productivity
        { name: 'Notion', url: 'https://notion.so', category: 'productivity', order: 0, isActive: true },
        { name: 'Linear', url: 'https://linear.app', category: 'productivity', order: 1, isActive: true },
        { name: 'Raycast', url: 'https://raycast.com', category: 'productivity', order: 2, isActive: true },
    ])

    console.log('[seed] Done ✓ — 5 projects, 9 messages (4 unread), 18 tools')
})
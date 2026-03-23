import { projects, messages } from '~~/server/db/schema'

// Runs only in development and only if tables are empty
export default defineNitroPlugin(async (): Promise<void> => {
    return
    console.log('[seed] Seeding database...')

    // ── Projects ────────────────────────────────────────────────────────────
    await db.insert(projects).values({
        name: 'Portfolio v5',
        slug: 'portfolio-v5',
        description: 'Mon portfolio personnel construit avec Nuxt 4, Nuxt UI et NuxtHub. Inclut un back-office pour gérer les projets, une newsletter et une boîte de réception centralisée.',
        year: '2025',
        tags: 'portfolio, nuxt, open-source',
        stack: 'Nuxt 4, Nuxt UI, NuxtHub, Drizzle ORM, Brevo',
        urlWebsite: 'https://matteobonneval.com',
        urlRepository: 'https://github.com/matteobonneval/portfolio',
        isDisabled: false,
    }).returning()

    await db.insert(projects).values({
        name: 'SaaS Dashboard',
        slug: 'saas-dashboard',
        description: 'Application SaaS de gestion de projets avec tableau de bord analytique, gestion des équipes et facturation intégrée via Stripe.',
        year: '2024',
        tags: 'saas, dashboard, analytics',
        stack: 'Nuxt 3, TailwindCSS, Prisma, PostgreSQL, Stripe',
        urlWebsite: null,
        urlRepository: null,
        isDisabled: false,
    }).returning()

    await db.insert(projects).values({
        name: 'App Mobile Fitness',
        slug: 'app-mobile-fitness',
        description: 'Application mobile de suivi fitness avec programmes d\'entraînement personnalisés, tracking des performances et synchronisation avec les wearables.',
        year: '2024',
        tags: 'mobile, fitness, react-native',
        stack: 'React Native, Expo, Supabase, TypeScript',
        urlWebsite: null,
        urlRepository: 'https://github.com/matteobonneval/fitness-app',
        isDisabled: true,
    })

    await db.insert(projects).values({
        name: 'E-commerce Sneakers',
        slug: 'ecommerce-sneakers',
        description: 'Boutique en ligne spécialisée sneakers avec catalogue produits, panier, paiement Stripe et gestion des stocks en temps réel.',
        year: '2023',
        tags: 'e-commerce, stripe, nuxt',
        stack: 'Nuxt 3, Stripe, Pinia, TailwindCSS',
        urlWebsite: 'https://sneakers-demo.vercel.app',
        urlRepository: null,
        isDisabled: false,
    })

    await db.insert(projects).values({
        name: 'CLI DevTools',
        slug: 'cli-devtools',
        description: 'Suite d\'outils CLI pour automatiser les tâches répétitives en développement : scaffolding, migrations, déploiement et monitoring.',
        year: '2023',
        tags: 'cli, devtools, node',
        stack: 'Node.js, TypeScript, Commander.js',
        urlWebsite: null,
        urlRepository: 'https://github.com/matteobonneval/cli-devtools',
        isDisabled: false,
    })

    // ── Messages ─────────────────────────────────────────────────────────────
    const now = new Date()
    const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)

    await db.insert(messages).values([
        // Unread contacts
        {
            type: 'contact',
            name: 'Sophie Martin',
            email: 'sophie.martin@gmail.com',
            message: 'Bonjour, je suis responsable technique chez une startup fintech et je cherche un développeur freelance pour un projet Nuxt. Votre portfolio est vraiment impressionnant. Seriez-vous disponible pour en discuter ?',
            isRead: false,
            createdAt: daysAgo(0),
        },
        {
            type: 'contact',
            name: 'Thomas Leroux',
            email: 'thomas.leroux@agence-pixel.fr',
            message: 'Salut ! Je travaille dans une agence digitale et on cherche quelqu\'un pour renforcer notre équipe frontend sur plusieurs projets. Vos compétences en Nuxt et design system correspondent exactement à ce qu\'on cherche.',
            isRead: false,
            createdAt: daysAgo(1),
        },
        {
            type: 'newsletter',
            name: null,
            email: 'dev.curious@protonmail.com',
            message: null,
            isRead: false,
            createdAt: daysAgo(1),
        },
        {
            type: 'contact',
            name: 'Amélie Durand',
            email: 'amelie.durand@startup.io',
            message: 'Hello ! J\'ai découvert votre travail via GitHub. On construit un outil SaaS B2B et on cherche quelqu\'un capable de gérer à la fois le front et les intégrations API. Votre stack correspond parfaitement.',
            isRead: false,
            createdAt: daysAgo(2),
        },
        // Read messages
        {
            type: 'newsletter',
            name: 'Lucas Bernard',
            email: 'lucas.bernard@mail.com',
            message: null,
            isRead: true,
            createdAt: daysAgo(5),
        },
        {
            type: 'contact',
            name: 'Julie Fontaine',
            email: 'julie.fontaine@design-co.fr',
            message: 'Bonjour Mattéo, je suis UX designer et j\'aimerais collaborer avec vous sur un projet de refonte d\'application web. J\'ai vu votre travail sur le portfolio v4 et j\'adore votre sensibilité pour le design.',
            isRead: true,
            createdAt: daysAgo(7),
        },
        {
            type: 'newsletter',
            name: null,
            email: 'marc.dupont@outlook.com',
            message: null,
            isRead: true,
            createdAt: daysAgo(10),
        },
        {
            type: 'contact',
            name: 'Romain Petit',
            email: 'romain.petit@freelance.dev',
            message: 'Coucou, est-ce que tu seras à la VueJS Paris en octobre ? Ce serait cool de se rencontrer !',
            isRead: true,
            createdAt: daysAgo(14),
        },
        {
            type: 'newsletter',
            name: 'Clara Moreau',
            email: 'clara.moreau@icloud.com',
            message: null,
            isRead: true,
            createdAt: daysAgo(21),
        },
    ])

    console.log('[seed] Done ✓ — 5 projects, 4 images, 9 messages (4 unread)')
})
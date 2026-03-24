import {pgTable, text, serial, timestamp, integer, boolean} from 'drizzle-orm/pg-core'
import type {InferInsertModel, InferSelectModel} from 'drizzle-orm'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
    id: serial().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    avatar: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
})

export const projects = pgTable('projects', {
    id: serial().primaryKey(),
    name: text().notNull(),
    description: text().notNull(),
    urlWebsite: text(),
    urlRepository: text(),
    year: text().notNull(),
    tags: text(),
    slug: text().notNull().unique(),
    stack: text(),
    isDisabled: boolean().notNull().default(false),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
})

export const projectImages = pgTable('project_images', {
    id: serial().primaryKey(),

    projectId: integer()
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),

    url: text().notNull(),
    filename: text().notNull(),
    mimeType: text(),
    size: integer(),
    order: integer().default(0),

    createdAt: timestamp().notNull().defaultNow(),
})

// user
export type User = InferSelectModel<typeof users>
export type UserSession = User & Omit<Project, 'id'>

// project
export type Project = InferSelectModel<typeof projects>
export type ProjectInsert = InferInsertModel<typeof projects>
export type ProjectUpdate = Partial<ProjectInsert>

// image
export type ProjectImage = InferSelectModel<typeof projectImages>
export type ProjectImageInsert = InferInsertModel<typeof projectImages>

export const messages = pgTable('messages', {
    id: serial().primaryKey(),
    type: text({ enum: ['contact', 'newsletter'] }).notNull(),
    name: text(),
    email: text().notNull(),
    message: text(),
    isRead: boolean().notNull().default(false),
    createdAt: timestamp().notNull().defaultNow(),
})

export type Message = InferSelectModel<typeof messages>
export type MessageInsert = InferInsertModel<typeof messages>

export const tools = pgTable('tools', {
    id: serial().primaryKey(),
    name: text().notNull(),
    url: text().notNull(),
    icon: text(),
    description: text(),
    category: text().notNull(),
    isActive: boolean().notNull().default(true),
    isPublic: boolean().notNull().default(false),
    isDailyDriver: boolean().notNull().default(false),
    clicks: integer().notNull().default(0),
    order: integer().default(0),
    createdAt: timestamp().notNull().defaultNow(),
})

export type Tool = InferSelectModel<typeof tools>
export type ToolInsert = InferInsertModel<typeof tools>

export const projectViews = pgTable('project_views', {
    id: serial().primaryKey(),
    projectId: integer().notNull().references(() => projects.id, { onDelete: 'cascade' }),
    viewedAt: timestamp().notNull().defaultNow(),
})

export type ProjectView = InferSelectModel<typeof projectViews>

export const projectsRelations = relations(projects, ({ many }) => ({
    images: many(projectImages),
    views: many(projectViews),
}))

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
    project: one(projects, {
        fields: [projectImages.projectId],
        references: [projects.id],
    }),
}))

export const projectViewsRelations = relations(projectViews, ({ one }) => ({
    project: one(projects, {
        fields: [projectViews.projectId],
        references: [projects.id],
    }),
}))

export const posts = pgTable('posts', {
    id: serial().primaryKey(),
    title: text().notNull(),
    slug: text().notNull().unique(),
    excerpt: text(),
    content: text().notNull().default(''),
    coverImage: text('cover_image'),
    tags: text(),
    status: text({ enum: ['draft', 'published'] }).notNull().default('draft'),
    isFeatured: boolean('is_featured').notNull().default(false),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Post = InferSelectModel<typeof posts>
export type PostInsert = InferInsertModel<typeof posts>

export const postViews = pgTable('post_views', {
    id: serial().primaryKey(),
    postId: integer().notNull().references(() => posts.id, { onDelete: 'cascade' }),
    viewedAt: timestamp().notNull().defaultNow(),
})

export type PostView = InferSelectModel<typeof postViews>

export const postsRelations = relations(posts, ({ many }) => ({
    views: many(postViews),
}))

export const postViewsRelations = relations(postViews, ({ one }) => ({
    post: one(posts, {
        fields: [postViews.postId],
        references: [posts.id],
    }),
}))
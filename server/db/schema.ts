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

export const projectsRelations = relations(projects, ({ many }) => ({
    images: many(projectImages),
}))

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
    project: one(projects, {
        fields: [projectImages.projectId],
        references: [projects.id],
    }),
}))
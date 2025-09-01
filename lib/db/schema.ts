import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Priority enum
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

// Columns table
export const columns = pgTable('columns', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priority: priorityEnum('priority').notNull().default('medium'),
  assignee: text('assignee'),
  dueDate: timestamp('due_date'),
  columnId: uuid('column_id')
    .references(() => columns.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types for TypeScript
export type Column = typeof columns.$inferSelect;
export type NewColumn = typeof columns.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

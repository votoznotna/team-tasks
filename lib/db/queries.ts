import { eq, asc } from 'drizzle-orm';
import { db } from './index';
import {
  columns,
  tasks,
  type Column,
  type Task,
  type NewColumn,
  type NewTask,
} from './schema';

// Column queries
export async function getAllColumns(): Promise<Column[]> {
  return await db.select().from(columns).orderBy(asc(columns.order));
}

export async function getColumnById(id: string): Promise<Column | undefined> {
  const result = await db.select().from(columns).where(eq(columns.id, id));
  return result[0];
}

export async function createColumn(data: NewColumn): Promise<Column> {
  const result = await db.insert(columns).values(data).returning();
  return result[0];
}

export async function updateColumn(
  id: string,
  data: Partial<NewColumn>
): Promise<Column | undefined> {
  const result = await db
    .update(columns)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(columns.id, id))
    .returning();
  return result[0];
}

export async function deleteColumn(id: string): Promise<void> {
  await db.delete(columns).where(eq(columns.id, id));
}

// Task queries
export async function getTasksByColumnId(columnId: string): Promise<Task[]> {
  return await db
    .select()
    .from(tasks)
    .where(eq(tasks.columnId, columnId))
    .orderBy(asc(tasks.order));
}

export async function getAllTasks(): Promise<Task[]> {
  return await db.select().from(tasks).orderBy(asc(tasks.order));
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const result = await db.select().from(tasks).where(eq(tasks.id, id));
  return result[0];
}

export async function createTask(data: NewTask): Promise<Task> {
  const result = await db.insert(tasks).values(data).returning();
  return result[0];
}

export async function updateTask(
  id: string,
  data: Partial<NewTask>
): Promise<Task | undefined> {
  const result = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return result[0];
}

export async function deleteTask(id: string): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id));
}

export async function moveTask(
  taskId: string,
  newColumnId: string,
  newOrder?: number
): Promise<Task | undefined> {
  const result = await db
    .update(tasks)
    .set({
      columnId: newColumnId,
      order: newOrder ?? 0,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();
  return result[0];
}

// Combined queries for kanban board
export async function getKanbanBoardData() {
  const allColumns = await getAllColumns();
  const allTasks = await getAllTasks();

  return allColumns.map((column) => ({
    ...column,
    tasks: allTasks.filter((task) => task.columnId === column.id),
  }));
}

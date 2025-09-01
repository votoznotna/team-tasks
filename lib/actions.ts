'use server';

import { createTask, updateTask, deleteTask, moveTask } from '@/lib/db/queries';
import type { NewTask } from '@/lib/db/schema';

export async function createTaskAction(data: {
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  columnId: string;
}) {
  try {
    const newTask: NewTask = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignee: data.assignee || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      columnId: data.columnId,
      order: 0,
    };

    const createdTask = await createTask(newTask);
    // Remove revalidatePath to avoid page refresh
    // return { success: true, task: createdTask };
    return { success: true, task: createdTask };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
}

export async function updateTaskAction(
  taskId: string,
  data: {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }
) {
  try {
    const updatedTask = await updateTask(taskId, {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignee: data.assignee || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
    // Remove revalidatePath to avoid page refresh
    return { success: true, task: updatedTask };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    await deleteTask(taskId);
    // Remove revalidatePath to avoid page refresh
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

export async function moveTaskAction(
  taskId: string,
  newColumnId: string,
  currentColumnId: string,
  newOrder?: number
) {
  try {
    // Check if task is already in the target column
    if (currentColumnId === newColumnId) {
      return { success: true, message: 'Task is already in the target column' };
    }

    await moveTask(taskId, newColumnId, newOrder);
    // Remove revalidatePath to avoid page refresh
    return { success: true };
  } catch (error) {
    console.error('Error moving task:', error);
    return { success: false, error: 'Failed to move task' };
  }
}

import { create } from 'zustand';
import type { Task, Column } from '@/lib/db/schema';

interface TaskStore {
  // Current state
  columns: (Column & { tasks: Task[] })[];

  // Actions
  setColumns: (columns: (Column & { tasks: Task[] })[]) => void;
  moveTaskOptimistically: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string
  ) => void;
  updateTaskOptimistically: (taskId: string, updates: Partial<Task>) => void;
  addTaskOptimistically: (task: Task) => void;
  removeTaskOptimistically: (taskId: string) => void;
  
  // New functions for replacing optimistic data with real data
  replaceOptimisticTask: (optimisticId: string, realTask: Task) => void;
  updateTaskWithServerData: (taskId: string, serverData: Partial<Task>) => void;
  
  // Functions to revert optimistic updates on failure
  revertOptimisticAdd: (taskId: string) => void;
  revertOptimisticUpdate: (taskId: string, originalData: Partial<Task>) => void;
  revertOptimisticDelete: (taskId: string, originalTask: Task) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  columns: [],

  setColumns: (columns) => set({ columns }),

  moveTaskOptimistically: (taskId, fromColumnId, toColumnId) => {
    set((state) => {
      // Find the task to move
      const taskToMove = state.columns
        .flatMap((col) => col.tasks)
        .find((task) => task.id === taskId);

      if (!taskToMove) {
        return state;
      }

      const newColumns = state.columns.map((column) => {
        if (column.id === fromColumnId) {
          // Remove task from source column
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        }
        if (column.id === toColumnId) {
          // Add task to destination column
          return {
            ...column,
            tasks: [...column.tasks, { ...taskToMove, columnId: toColumnId }],
          };
        }
        return column;
      });

      return { columns: newColumns };
    });
  },

  updateTaskOptimistically: (taskId, updates) => {
    set((state) => {
      const newColumns = state.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      }));

      return { columns: newColumns };
    });
  },

  addTaskOptimistically: (task) => {
    set((state) => {
      const newColumns = state.columns.map((column) => {
        if (column.id === task.columnId) {
          return {
            ...column,
            tasks: [...column.tasks, task],
          };
        }
        return column;
      });

      return { columns: newColumns };
    });
  },

  removeTaskOptimistically: (taskId) => {
    set((state) => {
      const newColumns = state.columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }));

      return { columns: newColumns };
    });
  },

  replaceOptimisticTask: (optimisticId, realTask) => {
    set((state) => {
      const newColumns = state.columns.map((column) => {
        if (column.id === realTask.columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === optimisticId ? realTask : task
            ),
          };
        }
        return column;
      });

      return { columns: newColumns };
    });
  },

  updateTaskWithServerData: (taskId, serverData) => {
    set((state) => {
      const newColumns = state.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, ...serverData } : task
        ),
      }));

      return { columns: newColumns };
    });
  },

  revertOptimisticAdd: (taskId) => {
    set((state) => {
      const newColumns = state.columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      }));

      return { columns: newColumns };
    });
  },

  revertOptimisticUpdate: (taskId, originalData) => {
    set((state) => {
      const newColumns = state.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, ...originalData } : task
        ),
      }));

      return { columns: newColumns };
    });
  },

  revertOptimisticDelete: (taskId, originalTask) => {
    set((state) => {
      const newColumns = state.columns.map((column) => {
        if (column.id === originalTask.columnId) {
          return {
            ...column,
            tasks: [...column.tasks, originalTask],
          };
        }
        return column;
      });

      return { columns: newColumns };
    });
  },
}));

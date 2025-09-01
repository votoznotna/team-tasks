'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  loadingTasks: Set<string>;
  setTaskLoading: (taskId: string, isLoading: boolean) => void;
  isTaskLoading: (taskId: string) => boolean;
  movingTask: { taskId: string; fromColumnId: string; toColumnId: string } | null;
  setMovingTask: (task: { taskId: string; fromColumnId: string; toColumnId: string } | null) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set());
  const [movingTask, setMovingTask] = useState<{ taskId: string; fromColumnId: string; toColumnId: string } | null>(null);

  const setTaskLoading = (taskId: string, isLoading: boolean) => {
    setLoadingTasks(prev => {
      const newSet = new Set(prev);
      if (isLoading) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  };

  const isTaskLoading = (taskId: string) => {
    return loadingTasks.has(taskId);
  };

  return (
    <LoadingContext.Provider value={{ 
      loadingTasks, 
      setTaskLoading, 
      isTaskLoading, 
      movingTask, 
      setMovingTask 
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';
import { createTaskAction } from '@/lib/actions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTaskStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

interface AddTaskButtonProps {
  columnId: string;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm';
  children?: React.ReactNode;
  className?: string;
}

export function AddTaskButton({
  columnId,
  variant = 'default',
  size = 'default',
  children,
  className,
}: AddTaskButtonProps) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const addTaskOptimistically = useTaskStore((state) => state.addTaskOptimistically);
  const replaceOptimisticTask = useTaskStore((state) => state.replaceOptimisticTask);
  const revertOptimisticAdd = useTaskStore((state) => state.revertOptimisticAdd);

  const handleTaskSubmit = async (data: {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }) => {
    setIsCreating(true);
    
    // Create optimistic task with temporary ID
    const optimisticId = uuidv4();
    const optimisticTask = {
      id: optimisticId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignee: data.assignee || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      columnId: columnId,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add task optimistically to UI
    addTaskOptimistically(optimisticTask);
    
    try {
      const result = await createTaskAction({
        ...data,
        columnId,
      });
      
      if (result.success && result.task) {
        // Task created successfully, replace optimistic task with real data
        replaceOptimisticTask(optimisticId, result.task);
        setIsTaskDialogOpen(false);
      } else {
        // If failed, remove the optimistic task
        revertOptimisticAdd(optimisticId);
        console.error('Failed to create task:', result.error);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      // Revert optimistic update on error
      revertOptimisticAdd(optimisticId);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsTaskDialogOpen(true)}
        className={className}
        disabled={isCreating}
      >
        {children || (
          <>
            {isCreating ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Plus className='w-4 h-4 mr-2' />
            )}
            {isCreating ? 'Creating...' : 'Add Task'}
          </>
        )}
      </Button>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSubmit={handleTaskSubmit}
      />
    </>
  );
}

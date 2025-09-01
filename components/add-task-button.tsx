'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';
import { createTaskAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
  const router = useRouter();

  const handleTaskSubmit = async (data: {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }) => {
    setIsCreating(true);
    try {
      // Add artificial delay to make loading state visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await createTaskAction({
        ...data,
        columnId,
      });
      if (result.success) {
        router.refresh();
      }
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

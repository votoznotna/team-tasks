'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit2 } from 'lucide-react';
import { type Task, type Column } from '@/lib/db/schema';
import { TaskDialog } from '@/components/task-dialog';
import { DeleteTaskDialog } from '@/components/delete-task-dialog';
import { updateTaskAction, deleteTaskAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLoading } from './loading-context';

// Interface for TaskDialog compatibility
interface TaskDialogTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
}

interface TaskCardActionsProps {
  task: Task;
  availableColumns: (Column & { tasks: Task[] })[];
  columnId: string;
}

export function TaskCardActions({
  task,
  availableColumns,
  columnId,
}: TaskCardActionsProps) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDialogTask | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { setTaskLoading, setMovingTask } = useLoading();

  const handleEdit = () => {
    const dialogTask: TaskDialogTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee || undefined,
      dueDate: task.dueDate
        ? task.dueDate.toISOString().split('T')[0]
        : undefined,
    };
    setEditingTask(dialogTask);
    setIsTaskDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleMove = async (toColumnId: string) => {
    if (columnId === toColumnId) {
      return;
    }
    setIsMoving(true);
    setTaskLoading(task.id, true);

    // Start the visual movement
    setMovingTask({
      taskId: task.id,
      fromColumnId: columnId,
      toColumnId: toColumnId,
    });

    try {
      // The visual movement will handle the database update and page refresh
      // We just need to wait for the movement to complete
      // The TaskMovement component will call moveTaskAction and router.refresh()
    } catch (error) {
      console.error('Error starting task movement:', error);
      setMovingTask(null);
    } finally {
      setIsMoving(false);
      setTaskLoading(task.id, false);
    }
  };

  const handleTaskSubmit = async (data: {
    title: string;
    description: string;
    assignee: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }) => {
    setIsUpdating(true);
    setTaskLoading(task.id, true);
    try {
      // Add artificial delay to make loading state visible
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await updateTaskAction(task.id, data);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setIsUpdating(false);
      setTaskLoading(task.id, false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setTaskLoading(task.id, true);
    try {
      // Add artificial delay to make loading state visible
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await deleteTaskAction(task.id);
      if (result.success) {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
      setTaskLoading(task.id, false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0 flex-shrink-0'
          >
            <MoreHorizontal className='w-3 h-3' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem onClick={handleEdit} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <LoadingSpinner size='sm' className='mr-2' />
                Updating...
              </>
            ) : (
              <>
                <Edit2 className='w-4 h-4 mr-2' />
                Edit Task
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>Duplicate Task</DropdownMenuItem>
          <DropdownMenuSeparator />
          {availableColumns.map((column) => (
            <DropdownMenuItem
              key={column.id}
              onClick={() => handleMove(column.id)}
              disabled={isMoving}
              className={isMoving ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isMoving ? (
                <>
                  <LoadingSpinner size='sm' className='mr-2' />
                  Moving...
                </>
              ) : (
                `Move to ${column.title}`
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-destructive'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <LoadingSpinner size='sm' className='mr-2' />
                Deleting...
              </>
            ) : (
              'Delete Task'
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Task Dialog */}
      <TaskDialog
        task={editingTask}
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSubmit={handleTaskSubmit}
      />

      {/* Delete Task Dialog */}
      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />
    </>
  );
}

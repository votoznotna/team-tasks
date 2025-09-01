'use client';

import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import type { Column, Task } from '@/lib/db/schema';
import { TaskCard } from './task-card';
import { AddTaskButton } from './add-task-button';
import { useLoading } from './loading-context';
import { TaskMovement } from './task-movement';
import { useTaskStore } from '@/lib/store';
import React from 'react';

interface KanbanBoardContentProps {
  columns: (Column & { tasks: Task[] })[];
}

export function KanbanBoardContent({ columns }: KanbanBoardContentProps) {
  const { isTaskLoading, movingTask, setMovingTask } = useLoading();
  const { columns: storeColumns, setColumns } = useTaskStore();

  // Initialize store with server data if empty
  React.useEffect(() => {
    if (storeColumns.length === 0) {
      setColumns(columns);
    }
  }, [columns, storeColumns.length, setColumns]);

  // Use store columns if available, otherwise use server columns
  const displayColumns = storeColumns.length > 0 ? storeColumns : columns;

  const handleMovementComplete = () => {
    setMovingTask(null);
  };

  return (
    <div className='h-full p-6 bg-background/50'>
      {movingTask && (
        <TaskMovement
          task={
            displayColumns
              .flatMap((col) => col.tasks)
              .find((t) => t.id === movingTask.taskId)!
          }
          fromColumnId={movingTask.fromColumnId}
          toColumnId={movingTask.toColumnId}
          columns={displayColumns}
          onComplete={handleMovementComplete}
        />
      )}

      {/* Highlight destination column during movement */}
      {movingTask && (
        <div className='fixed inset-0 pointer-events-none z-40'>
          <div className='absolute inset-0 bg-green-500/5 animate-pulse' />
        </div>
      )}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>Team Tasks Board</h1>
          <p className='text-muted-foreground'>
            Manage your team&apos;s workflow
          </p>
        </div>
        <div className='flex gap-2'>
          <AddTaskButton columnId={displayColumns[0]?.id || 'todo'} />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]'>
        {displayColumns.map((column) => (
          <div key={column.id} className='flex flex-col'>
            {/* Column Header */}
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-semibold'>{column.title}</h2>
                <Badge variant='secondary' className='text-xs'>
                  {column.tasks.length}
                </Badge>
              </div>
            </div>

            {/* Column Content */}
            <div
              className={`flex-1 bg-muted/5 border rounded-lg p-4 overflow-y-auto transition-all duration-300 ${
                movingTask && movingTask.toColumnId === column.id
                  ? 'border-green-500/50 bg-green-500/5 shadow-lg shadow-green-500/20'
                  : 'border-border/50'
              }`}
            >
              <div className='space-y-3'>
                {column.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    availableColumns={columns.filter(
                      (col) => col.id !== column.id
                    )}
                    columnId={column.id}
                    isLoading={isTaskLoading(task.id)}
                  />
                ))}
                {column.tasks.length === 0 && (
                  <div className='text-center py-8 text-muted-foreground'>
                    <p className='text-sm'>No tasks yet</p>
                    <AddTaskButton
                      columnId={column.id}
                      variant='ghost'
                      size='sm'
                      className='mt-2'
                    >
                      <Plus className='w-4 h-4 mr-1' />
                      Add Task
                    </AddTaskButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

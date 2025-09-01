import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import type { Task, Column } from '@/lib/db/schema';
import { TaskCardActions } from './task-card-actions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const priorityLabels = {
  low: 'Low Priority',
  medium: 'Medium Priority',
  high: 'High Priority',
};

interface TaskCardProps {
  task: Task;
  availableColumns: (Column & { tasks: Task[] })[];
  columnId: string;
  isLoading?: boolean;
}

export function TaskCard({
  task,
  availableColumns,
  columnId,
  isLoading = false,
}: TaskCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-sm transition-all duration-200 border border-border hover:border-border/60 bg-card relative ${
        isLoading ? 'opacity-75 pointer-events-none' : ''
      }`}
    >
      {isLoading && (
        <div className='absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10'>
          <div className='flex items-center gap-2 bg-card p-3 rounded-lg shadow-lg border'>
            <LoadingSpinner size='sm' />
            <span className='text-sm font-medium'>Processing...</span>
          </div>
        </div>
      )}
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-sm font-semibold line-clamp-2 text-foreground'>
              {task.title}
            </CardTitle>
          </div>
          <TaskCardActions
            task={task}
            availableColumns={availableColumns}
            columnId={columnId}
          />
        </div>
      </CardHeader>
      <CardContent className='pt-0 space-y-3'>
        <CardDescription className='text-xs line-clamp-2 text-muted-foreground'>
          {task.description}
        </CardDescription>

        <div className='flex items-center justify-between'>
          <Badge
            variant='secondary'
            className={`text-xs font-medium ${priorityColors[task.priority]}`}
          >
            {priorityLabels[task.priority]}
          </Badge>
        </div>

        {task.assignee && (
          <div className='flex items-center gap-2'>
            <Avatar className='w-6 h-6'>
              <AvatarImage src='' alt={task.assignee} />
              <AvatarFallback className='text-xs bg-primary/10 text-primary'>
                {getInitials(task.assignee)}
              </AvatarFallback>
            </Avatar>
            <span className='text-xs text-muted-foreground truncate'>
              {task.assignee}
            </span>
          </div>
        )}

        {task.dueDate && (
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Calendar className='w-3 h-3' />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Task, Column } from '@/lib/db/schema';
import { moveTaskAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/lib/store';

interface TaskMovementProps {
  task: Task;
  fromColumnId: string;
  toColumnId: string;
  columns: (Column & { tasks: Task[] })[];
  onComplete: () => void;
}

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

export function TaskMovement({
  task,
  fromColumnId,
  toColumnId,
  columns,
  onComplete,
}: TaskMovementProps) {
  const [progress, setProgress] = useState(0);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const [isLanding, setIsLanding] = useState(false);
  const router = useRouter();
  const moveTaskOptimistically = useTaskStore(
    (state) => state.moveTaskOptimistically
  );
  const animationStartedRef = useRef(false);

  // Add a fallback timeout to ensure cleanup
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      onComplete();
    }, 15000); // 15 second fallback

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete]);

  const fromColumn = columns.find((col) => col.id === fromColumnId);
  const toColumn = columns.find((col) => col.id === toColumnId);

  const fromIndex = columns.findIndex((col) => col.id === fromColumnId);
  const toIndex = columns.findIndex((col) => col.id === toColumnId);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    // Prevent multiple animations
    if (animationStartedRef.current) {
      return;
    }

    animationStartedRef.current = true;

    const totalSteps = Math.abs(toIndex - fromIndex);
    const stepDuration = 800; // 800ms per column
    const totalDuration = totalSteps * stepDuration;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / totalDuration, 1);

      setProgress(newProgress);

      // Calculate which column we should be in
      const currentStep = Math.floor(newProgress * totalSteps);
      const newColumnIndex =
        fromIndex + (toIndex > fromIndex ? currentStep : -currentStep);
      setCurrentColumnIndex(newColumnIndex);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete - now simulate dropping into destination column
        setIsLanding(true);

        // Apply optimistic update immediately
        moveTaskOptimistically(task.id, fromColumnId, toColumnId);

        // Start the landing animation
        setTimeout(() => {
          // Landing animation is just visual - no need to wait for it
        }, 1000);

        // Perform the database operation immediately
        (async () => {
          try {
            const result = await moveTaskAction(
              task.id,
              toColumnId,
              fromColumnId
            );
            if (result.success) {
              // Call onComplete immediately after the database operation completes
              onComplete();
            } else {
              // TODO: Revert optimistic update on error
              onComplete();
            }
          } catch {
            // TODO: Revert optimistic update on error
            onComplete();
          }
        })();
      }
    };

    requestAnimationFrame(animate);
  }, [
    fromIndex,
    toIndex,
    onComplete,
    task.id,
    toColumnId,
    fromColumnId,
    router,
    moveTaskOptimistically,
  ]);

  const currentColumn = columns[currentColumnIndex];

  return (
    <div className='fixed inset-0 z-50 pointer-events-none bg-background/20 backdrop-blur-sm'>
      {/* Progress bar at the top */}
      <div className='absolute top-4 left-1/2 transform -translate-x-1/2 w-96 h-4 bg-muted rounded-full overflow-hidden border-2 border-border'>
        <div
          className={`h-full transition-all duration-300 ease-out ${
            isLanding ? 'bg-green-500' : 'bg-primary'
          }`}
          style={{ width: `${progress * 100}%` }}
        />
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-xs font-medium text-foreground'>
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      {/* Moving task card */}
      <div
        className='absolute top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out'
        style={{
          transform: `translate(-50%, 0)`,
        }}
      >
        <Card
          className={`w-80 shadow-lg border-2 bg-card/95 backdrop-blur-sm transition-all duration-300 ${
            isLanding
              ? 'border-green-500/50 shadow-green-500/20 scale-105'
              : 'border-primary/20'
          }`}
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between gap-2'>
              <div className='flex-1 min-w-0'>
                <CardTitle className='text-sm font-semibold line-clamp-2 text-foreground'>
                  {task.title}
                </CardTitle>
              </div>
              <div className='flex items-center gap-2'>
                {isLanding ? (
                  <>
                    <div className='w-4 h-4 rounded-full bg-green-500 animate-pulse' />
                    <span className='text-xs text-green-600 font-medium'>
                      Landing...
                    </span>
                  </>
                ) : (
                  <>
                    <LoadingSpinner size='sm' />
                    <span className='text-xs text-muted-foreground'>
                      Moving...
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-0 space-y-3'>
            <CardDescription className='text-xs line-clamp-2 text-muted-foreground'>
              {task.description}
            </CardDescription>

            <div className='flex items-center justify-between'>
              <Badge
                variant='secondary'
                className={`text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
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

        {/* Movement indicator */}
        <div className='mt-4 text-center'>
          <div className='text-sm font-medium text-foreground'>
            {isLanding
              ? `Dropping into ${toColumn?.title}...`
              : `Moving from ${fromColumn?.title} to ${toColumn?.title}`}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>
            {isLanding
              ? `${toColumn?.title} • Landing task...`
              : `${currentColumn?.title} • ${Math.round(
                  progress * 100
                )}% complete`}
          </div>
        </div>
      </div>
    </div>
  );
}

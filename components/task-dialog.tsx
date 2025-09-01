'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Calendar } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Zod schema for form validation
const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  assignee: z.string().min(1, 'Please select an assignee'),
  priority: z.enum(['low', 'medium', 'high'], 'Please select a priority level'),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
}

interface TaskDialogProps {
  task?: Task | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormValues) => void;
  trigger?: React.ReactNode;
}

// Sample team members for assignee selection
const teamMembers = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Brown',
  'David Wilson',
  'Emma Davis',
  'Frank Miller',
];

const priorityOptions = [
  {
    value: 'low',
    label: 'Low Priority',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  {
    value: 'medium',
    label: 'Medium Priority',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    value: 'high',
    label: 'High Priority',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
];

export function TaskDialog({
  task,
  isOpen,
  onOpenChange,
  onSubmit,
  trigger,
}: TaskDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: '',
    },
  });

  // Reset form when dialog opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task
        setIsEditing(true);
        form.reset({
          title: task.title,
          description: task.description,
          assignee: task.assignee || '',
          priority: task.priority,
          dueDate: task.dueDate || '',
        });
      } else {
        // Creating new task
        setIsEditing(false);
        form.reset({
          title: '',
          description: '',
          assignee: '',
          priority: 'medium',
          dueDate: '',
        });
      }
    }
  }, [isOpen, task, form]);

  const handleSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {isEditing ? (
              <>
                <Edit2 className='w-5 h-5' />
                Edit Task
              </>
            ) : (
              <>
                <Plus className='w-5 h-5' />
                Create New Task
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the task details below.'
              : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter task title' {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title for the task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the task in detail'
                      className='min-h-[100px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about what needs to be done
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assignee Field */}
            <FormField
              control={form.control}
              name='assignee'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select team member' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          <div className='flex items-center gap-3'>
                            <Avatar className='w-6 h-6'>
                              <AvatarFallback className='text-xs'>
                                {getInitials(member)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose who will be responsible for this task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority and Due Date Row */}
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select priority' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className='flex items-center gap-2'>
                              <Badge
                                variant='secondary'
                                className={`text-xs ${option.color}`}
                              >
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                        <Input type='date' className='pl-10' {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      When should this task be completed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className='flex justify-end space-x-2 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size='sm' className='mr-2' />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : isEditing ? (
                  'Update Task'
                ) : (
                  'Create Task'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

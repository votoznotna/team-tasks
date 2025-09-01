'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle?: string;
}

export function DeleteTaskDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  taskTitle = 'this task',
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='w-5 h-5' />
            Delete Task
          </DialogTitle>
          <DialogDescription className='pt-2'>
            Are you sure you want to delete <strong>&ldquo;{taskTitle}&rdquo;</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className='flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
          <AlertTriangle className='w-5 h-5 text-destructive flex-shrink-0' />
          <div className='text-sm text-destructive'>
            <p className='font-medium'>Warning</p>
            <p className='text-destructive/80'>
              This will permanently remove the task and all its data from the
              board.
            </p>
          </div>
        </div>

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            className='gap-2'
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <LoadingSpinner size="sm" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className='w-4 h-4' />
                Delete Task
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

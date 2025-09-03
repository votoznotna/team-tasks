import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the UI components
jest.mock('../../components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid='dialog'>{children}</div> : null,
  DialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='dialog-content' className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dialog-header'>{children}</div>
  ),
  DialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <h2 data-testid='dialog-title' className={className}>
      {children}
    </h2>
  ),
  DialogDescription: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <p data-testid='dialog-description' className={className}>
      {children}
    </p>
  ),
  DialogFooter: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='dialog-footer' className={className}>
      {children}
    </div>
  ),
}));

jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    variant,
    onClick,
    disabled,
    className,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button
      data-testid='button'
      data-variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../components/ui/loading-spinner', () => ({
  LoadingSpinner: ({
    size,
    className,
  }: {
    size?: string;
    className?: string;
  }) => (
    <div data-testid='loading-spinner' data-size={size} className={className}>
      Loading...
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertTriangle: ({ className }: { className?: string }) => (
    <svg data-testid='alert-triangle-icon' className={className} />
  ),
  Trash2: ({ className }: { className?: string }) => (
    <svg data-testid='trash-icon' className={className} />
  ),
}));

describe('DeleteTaskDialog Component', () => {
  let DeleteTaskDialog: React.ComponentType<{
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    taskTitle?: string;
  }>;
  let mockOnOpenChange: jest.Mock;
  let mockOnConfirm: jest.Mock;

  const getDeleteButton = () => {
    const buttons = screen.getAllByTestId('button');
    return buttons.find(
      (button) => button.getAttribute('data-variant') === 'destructive'
    );
  };

  beforeEach(() => {
    mockOnOpenChange = jest.fn();
    mockOnConfirm = jest.fn().mockResolvedValue(undefined);
  });

  beforeAll(async () => {
    const deleteTaskDialogModule = await import(
      '../../components/delete-task-dialog'
    );
    DeleteTaskDialog = deleteTaskDialogModule.DeleteTaskDialog;
  });

  it('should render without crashing', () => {
    expect(() =>
      render(
        <DeleteTaskDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onConfirm={mockOnConfirm}
        />
      )
    ).not.toThrow();
  });

  it('should render dialog when open', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('dialog')).toBeDefined();
    expect(screen.getByTestId('dialog-content')).toBeDefined();
  });

  it('should not render dialog when closed', () => {
    render(
      <DeleteTaskDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('should render dialog header with title and icon', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('dialog-header')).toBeDefined();
    expect(screen.getByTestId('dialog-title')).toBeDefined();
    expect(screen.getAllByText('Delete Task').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('trash-icon').length).toBeGreaterThan(0);
  });

  it('should render dialog title with destructive styling', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const title = screen.getByTestId('dialog-title');
    expect(title.className).toContain('text-destructive');
  });

  it('should render dialog description with default task title', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('dialog-description')).toBeDefined();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeDefined();
    expect(screen.getByText(/this task/)).toBeDefined();
    expect(screen.getByText(/This action cannot be undone/)).toBeDefined();
  });

  it('should render dialog description with custom task title', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        taskTitle='Important Task'
      />
    );

    expect(screen.getByText(/Are you sure you want to delete/)).toBeDefined();
    expect(screen.getByText(/Important Task/)).toBeDefined();
    expect(screen.getByText(/This action cannot be undone/)).toBeDefined();
  });

  it('should render warning section with alert triangle icon', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('alert-triangle-icon')).toBeDefined();
    expect(screen.getByText('Warning')).toBeDefined();
    expect(
      screen.getByText(
        /This will permanently remove the task and all its data from the board/
      )
    ).toBeDefined();
  });

  it('should render warning section with proper styling', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const warningSection = screen
      .getByText('Warning')
      .closest('div')?.parentElement;
    expect(warningSection?.className).toContain('bg-destructive/10');
    expect(warningSection?.className).toContain('border-destructive/20');
    expect(warningSection?.className).toContain('rounded-lg');
  });

  it('should render dialog footer with action buttons', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('dialog-footer')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
    expect(screen.getAllByText('Delete Task').length).toBeGreaterThan(0);
  });

  it('should render cancel button with outline variant', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton.getAttribute('data-variant')).toBe('outline');
  });

  it('should render delete button with destructive variant', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    expect(deleteButton?.getAttribute('data-variant')).toBe('destructive');
  });

  it('should render delete button with trash icon', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    const trashIcon = deleteButton?.querySelector('[data-testid="trash-icon"]');
    expect(trashIcon).toBeDefined();
  });

  it('should call onOpenChange when cancel button is clicked', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call onConfirm when delete button is clicked', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton!);

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should show loading state during deletion', async () => {
    // Mock onConfirm to return a promise that resolves after a delay
    mockOnConfirm.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton!);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeDefined();
      expect(screen.getByTestId('loading-spinner')).toBeDefined();
    });

    // Buttons should be disabled during loading
    expect(screen.getByText('Cancel').getAttribute('disabled')).toBe('');
    expect(screen.getByText('Deleting...').getAttribute('disabled')).toBe('');
  });

  it('should close dialog after successful deletion', async () => {
    // Mock onConfirm to resolve immediately
    mockOnConfirm.mockResolvedValue(undefined);

    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton!);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should reset loading state after deletion completes', async () => {
    // Mock onConfirm to resolve after a delay
    mockOnConfirm.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton!);

    // Wait for loading to start
    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeDefined();
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Deleting...')).toBeNull();
      expect(screen.getAllByText('Delete Task').length).toBeGreaterThan(0);
    });
  });

  it('should render proper dialog content class', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const dialogContent = screen.getByTestId('dialog-content');
    expect(dialogContent.className).toContain('sm:max-w-[425px]');
  });

  it('should render dialog footer with proper gap styling', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const dialogFooter = screen.getByTestId('dialog-footer');
    expect(dialogFooter.className).toContain('gap-2');
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    rerender(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('dialog')).toBeDefined();
  });

  it('should maintain dialog structure across re-renders', () => {
    const { rerender } = render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    rerender(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByTestId('dialog-header')).toBeDefined();
    expect(screen.getByTestId('dialog-footer')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
    expect(screen.getAllByText('Delete Task').length).toBeGreaterThan(0);
  });

  it('should handle task title changes correctly', () => {
    const { rerender } = render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    // Initially should show default task title
    expect(screen.getByText(/this task/)).toBeDefined();

    // Change to custom task title
    rerender(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
        taskTitle='Custom Task'
      />
    );

    expect(screen.getByText(/Custom Task/)).toBeDefined();
  });

  it('should render loading spinner with proper size', async () => {
    mockOnConfirm.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton!);

    await waitFor(() => {
      const loadingSpinner = screen.getByTestId('loading-spinner');
      expect(loadingSpinner.getAttribute('data-size')).toBe('sm');
    });
  });

  it('should render delete button with proper gap styling', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = getDeleteButton();
    expect(deleteButton?.className).toContain('gap-2');
  });

  it('should render alert triangle icon with proper styling', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const alertTriangle = screen.getByTestId('alert-triangle-icon');
    expect(alertTriangle.getAttribute('class')).toContain('text-destructive');
    expect(alertTriangle.getAttribute('class')).toContain('flex-shrink-0');
  });

  it('should render trash icon in title with proper size', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const titleTrashIcon = screen.getAllByTestId('trash-icon')[0]; // First one is in the title
    expect(titleTrashIcon.getAttribute('class')).toContain('w-5 h-5');
  });

  it('should render trash icon in button with proper size', () => {
    render(
      <DeleteTaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onConfirm={mockOnConfirm}
      />
    );

    const buttonTrashIcon = screen.getAllByTestId('trash-icon')[1]; // Second one is in the button
    expect(buttonTrashIcon.getAttribute('class')).toContain('w-4 h-4');
  });
});

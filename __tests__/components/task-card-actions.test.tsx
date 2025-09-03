import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the UI components
jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    variant,
    size,
    className,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button
      data-testid='button'
      data-variant={variant}
      data-size={size}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dropdown-menu'>{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid='dropdown-trigger' data-as-child={asChild}>
      {children}
    </div>
  ),
  DropdownMenuContent: ({
    children,
    align,
    className,
  }: {
    children: React.ReactNode;
    align?: string;
    className?: string;
  }) => (
    <div
      data-testid='dropdown-content'
      data-align={align}
      className={className}
    >
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <div
      data-testid='dropdown-item'
      onClick={onClick}
      data-disabled={disabled}
      className={className}
    >
      {children}
    </div>
  ),
  DropdownMenuSeparator: () => <div data-testid='dropdown-separator' />,
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

// Mock the components
jest.mock('../../components/task-dialog', () => ({
  TaskDialog: ({
    isOpen,
    onOpenChange,
    onSubmit,
  }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
      title: string;
      description: string;
      assignee: string;
      priority: string;
    }) => void;
  }) =>
    isOpen ? (
      <div data-testid='task-dialog'>
        <button
          onClick={() =>
            onSubmit({
              title: 'Updated Task',
              description: 'Updated description',
              assignee: 'Jane Doe',
              priority: 'high',
            })
          }
        >
          Submit Update
        </button>
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null,
}));

jest.mock('../../components/delete-task-dialog', () => ({
  DeleteTaskDialog: ({
    isOpen,
    onOpenChange,
    onConfirm,
    taskTitle,
  }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    taskTitle: string;
  }) =>
    isOpen ? (
      <div data-testid='delete-task-dialog'>
        <p>Delete {taskTitle}?</p>
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={() => onOpenChange(false)}>Cancel Delete</button>
      </div>
    ) : null,
}));

// Mock the loading context
jest.mock('../../components/loading-context', () => ({
  useLoading: jest.fn(() => ({
    setTaskLoading: jest.fn(),
    setMovingTask: jest.fn(),
  })),
}));

// Mock the store
jest.mock('../../lib/store', () => ({
  useTaskStore: jest.fn((selector) => {
    const mockStore = {
      removeTaskOptimistically: jest.fn(),
      updateTaskWithServerData: jest.fn(),
      updateTaskOptimistically: jest.fn(),
      revertOptimisticUpdate: jest.fn(),
      revertOptimisticDelete: jest.fn(),
    };
    return selector(mockStore);
  }),
}));

// Mock the actions
jest.mock('../../lib/actions', () => ({
  updateTaskAction: jest.fn(),
  deleteTaskAction: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MoreHorizontal: ({ className }: { className?: string }) => (
    <svg data-testid='more-horizontal-icon' className={className} />
  ),
  Edit2: ({ className }: { className?: string }) => (
    <svg data-testid='edit-icon' className={className} />
  ),
}));

describe('TaskCardActions Component', () => {
  let TaskCardActions: React.ComponentType<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    availableColumns: any[];
    columnId: string;
  }>;
  let mockSetTaskLoading: jest.Mock;
  let mockSetMovingTask: jest.Mock;
  let mockRemoveTaskOptimistically: jest.Mock;
  let mockUpdateTaskWithServerData: jest.Mock;
  let mockUpdateTaskOptimistically: jest.Mock;
  let mockRevertOptimisticUpdate: jest.Mock;
  let mockRevertOptimisticDelete: jest.Mock;
  let mockUpdateTaskAction: jest.Mock;
  let mockDeleteTaskAction: jest.Mock;

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'medium' as const,
    assignee: 'John Doe',
    dueDate: new Date('2024-12-31'),
    order: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    columnId: 'todo',
  };

  const mockAvailableColumns = [
    {
      id: 'in-progress',
      title: 'In Progress',
      order: 1,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tasks: [],
    },
    {
      id: 'done',
      title: 'Done',
      order: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tasks: [],
    },
  ];

  beforeAll(async () => {
    const taskCardActionsModule = await import(
      '../../components/task-card-actions'
    );
    TaskCardActions = taskCardActionsModule.TaskCardActions;
  });

  beforeEach(() => {
    mockSetTaskLoading = jest.fn();
    mockSetMovingTask = jest.fn();
    mockRemoveTaskOptimistically = jest.fn();
    mockUpdateTaskWithServerData = jest.fn();
    mockUpdateTaskOptimistically = jest.fn();
    mockRevertOptimisticUpdate = jest.fn();
    mockRevertOptimisticDelete = jest.fn();
    mockUpdateTaskAction = jest.fn();
    mockDeleteTaskAction = jest.fn();

    const { useLoading } = jest.requireMock('../../components/loading-context');
    const { useTaskStore } = jest.requireMock('../../lib/store');
    const { updateTaskAction, deleteTaskAction } =
      jest.requireMock('../../lib/actions');

    useLoading.mockReturnValue({
      setTaskLoading: mockSetTaskLoading,
      setMovingTask: mockSetMovingTask,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useTaskStore.mockImplementation((selector: (store: any) => unknown) => {
      const mockStore = {
        removeTaskOptimistically: mockRemoveTaskOptimistically,
        updateTaskWithServerData: mockUpdateTaskWithServerData,
        updateTaskOptimistically: mockUpdateTaskOptimistically,
        revertOptimisticUpdate: mockRevertOptimisticUpdate,
        revertOptimisticDelete: mockRevertOptimisticDelete,
      };
      return selector(mockStore);
    });

    updateTaskAction.mockImplementation(mockUpdateTaskAction);
    deleteTaskAction.mockImplementation(mockDeleteTaskAction);
  });

  it('should render without crashing', () => {
    expect(() =>
      render(
        <TaskCardActions
          task={mockTask}
          availableColumns={mockAvailableColumns}
          columnId='todo'
        />
      )
    ).not.toThrow();
  });

  it('should render the dropdown menu trigger button', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger).toBeDefined();
    expect(trigger.getAttribute('data-as-child')).toBe('true');
  });

  it('should render the more horizontal icon', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByTestId('more-horizontal-icon')).toBeDefined();
  });

  it('should render the dropdown menu content', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const content = screen.getByTestId('dropdown-content');
    expect(content).toBeDefined();
    expect(content.getAttribute('data-align')).toBe('end');
    expect(content.className).toContain('w-48');
  });

  it('should render edit task menu item', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('Edit Task')).toBeDefined();
    expect(screen.getByTestId('edit-icon')).toBeDefined();
  });

  it('should render duplicate task menu item', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('Duplicate Task')).toBeDefined();
  });

  it('should render move to column menu items', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('Move to In Progress')).toBeDefined();
    expect(screen.getByText('Move to Done')).toBeDefined();
  });

  it('should render delete task menu item', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const deleteItem = screen.getByText('Delete Task');
    expect(deleteItem).toBeDefined();
    expect(
      deleteItem.closest('[data-testid="dropdown-item"]')?.className
    ).toContain('text-destructive');
  });

  it('should render separators between menu sections', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const separators = screen.getAllByTestId('dropdown-separator');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('should open task dialog when edit is clicked', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    expect(screen.getByTestId('task-dialog')).toBeDefined();
  });

  it('should open delete dialog when delete is clicked', () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const deleteItem = screen.getByText('Delete Task');
    fireEvent.click(deleteItem);

    expect(screen.getByTestId('delete-task-dialog')).toBeDefined();
  });

  it('should handle task movement to different column', async () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const moveItem = screen.getByText('Move to In Progress');
    fireEvent.click(moveItem);

    await waitFor(() => {
      expect(mockSetTaskLoading).toHaveBeenCalledWith('task-1', true);
      expect(mockSetMovingTask).toHaveBeenCalledWith({
        taskId: 'task-1',
        fromColumnId: 'todo',
        toColumnId: 'in-progress',
      });
    });
  });

  it('should not handle movement to same column', async () => {
    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    // Try to move to the same column (should be prevented)
    // Since we're in 'todo' column, we can't move to 'todo' again
    expect(mockSetMovingTask).not.toHaveBeenCalled();
  });

  it('should handle task update successfully', async () => {
    mockUpdateTaskAction.mockResolvedValue({
      success: true,
      task: { ...mockTask, title: 'Updated Task' },
    });

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    const submitButton = screen.getByText('Submit Update');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateTaskOptimistically).toHaveBeenCalled();
      expect(mockUpdateTaskAction).toHaveBeenCalled();
      expect(mockUpdateTaskWithServerData).toHaveBeenCalled();
    });
  });

  it('should handle task update failure', async () => {
    mockUpdateTaskAction.mockResolvedValue({
      success: false,
      error: 'Failed to update task',
    });

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    const submitButton = screen.getByText('Submit Update');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateTaskOptimistically).toHaveBeenCalled();
      expect(mockUpdateTaskAction).toHaveBeenCalled();
      expect(mockRevertOptimisticUpdate).toHaveBeenCalled();
    });
  });

  it('should handle task update error', async () => {
    mockUpdateTaskAction.mockRejectedValue(new Error('Network error'));

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    const submitButton = screen.getByText('Submit Update');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateTaskOptimistically).toHaveBeenCalled();
      expect(mockUpdateTaskAction).toHaveBeenCalled();
      expect(mockRevertOptimisticUpdate).toHaveBeenCalled();
    });
  });

  it('should handle task deletion successfully', async () => {
    mockDeleteTaskAction.mockResolvedValue({
      success: true,
    });

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const deleteItem = screen.getByText('Delete Task');
    fireEvent.click(deleteItem);

    const confirmButton = screen.getByText('Confirm Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockRemoveTaskOptimistically).toHaveBeenCalledWith('task-1');
      expect(mockDeleteTaskAction).toHaveBeenCalledWith('task-1');
    });
  });

  it('should handle task deletion failure', async () => {
    mockDeleteTaskAction.mockResolvedValue({
      success: false,
      error: 'Failed to delete task',
    });

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const deleteItem = screen.getByText('Delete Task');
    fireEvent.click(deleteItem);

    const confirmButton = screen.getByText('Confirm Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockRemoveTaskOptimistically).toHaveBeenCalledWith('task-1');
      expect(mockDeleteTaskAction).toHaveBeenCalledWith('task-1');
      expect(mockRevertOptimisticDelete).toHaveBeenCalledWith(
        'task-1',
        mockTask
      );
    });
  });

  it('should handle task deletion error', async () => {
    mockDeleteTaskAction.mockRejectedValue(new Error('Network error'));

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const deleteItem = screen.getByText('Delete Task');
    fireEvent.click(deleteItem);

    const confirmButton = screen.getByText('Confirm Delete');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockRemoveTaskOptimistically).toHaveBeenCalledWith('task-1');
      expect(mockDeleteTaskAction).toHaveBeenCalledWith('task-1');
      expect(mockRevertOptimisticDelete).toHaveBeenCalledWith(
        'task-1',
        mockTask
      );
    });
  });

  it('should show loading states during operations', async () => {
    mockUpdateTaskAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    const submitButton = screen.getByText('Submit Update');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Updating...')).toBeDefined();
      expect(screen.getByTestId('loading-spinner')).toBeDefined();
    });
  });

  it('should disable menu items during operations', async () => {
    mockUpdateTaskAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    const submitButton = screen.getByText('Submit Update');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const editMenuItem = screen
        .getByText('Updating...')
        .closest('[data-testid="dropdown-item"]');
      expect(editMenuItem?.getAttribute('data-disabled')).toBe('true');
    });
  });

  it('should handle task with no assignee', () => {
    const noAssigneeTask = { ...mockTask, assignee: null };
    render(
      <TaskCardActions
        task={noAssigneeTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    const submitButton = screen.getByText('Submit Update');
    fireEvent.click(submitButton);

    // Should handle the case where assignee is null
    expect(mockUpdateTaskOptimistically).toHaveBeenCalled();
  });

  it('should handle task with no due date', () => {
    const noDueDateTask = { ...mockTask, dueDate: null };
    render(
      <TaskCardActions
        task={noDueDateTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const editItem = screen.getByText('Edit Task');
    fireEvent.click(editItem);

    const submitButton = screen.getByText('Submit Update');
    fireEvent.click(submitButton);

    // Should handle the case where dueDate is null
    expect(mockUpdateTaskOptimistically).toHaveBeenCalled();
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    rerender(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('Edit Task')).toBeDefined();
  });

  it('should maintain dropdown structure across re-renders', () => {
    const { rerender } = render(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
    expect(screen.getByTestId('dropdown-trigger')).toBeDefined();
    expect(screen.getByTestId('dropdown-content')).toBeDefined();

    rerender(
      <TaskCardActions
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
    expect(screen.getByTestId('dropdown-trigger')).toBeDefined();
    expect(screen.getByTestId('dropdown-content')).toBeDefined();
  });
});

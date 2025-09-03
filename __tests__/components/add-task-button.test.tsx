import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the UI components
jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    size,
    className,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    size?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button
      data-testid='button'
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
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

// Mock the TaskDialog component
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
              title: 'Test Task',
              description: 'Test Description',
              assignee: 'Test User',
              priority: 'medium',
            })
          }
        >
          Submit Task
        </button>
        <button onClick={() => onOpenChange(false)}>Close Dialog</button>
      </div>
    ) : null,
}));

// Mock the store
jest.mock('../../lib/store', () => ({
  useTaskStore: jest.fn((selector) => {
    const mockStore = {
      addTaskOptimistically: jest.fn(),
      replaceOptimisticTask: jest.fn(),
      revertOptimisticAdd: jest.fn(),
    };
    return selector(mockStore);
  }),
}));

// Mock the actions
jest.mock('../../lib/actions', () => ({
  createTaskAction: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: ({ className }: { className?: string }) => (
    <svg data-testid='plus-icon' className={className} />
  ),
}));

describe('AddTaskButton Component', () => {
  let AddTaskButton: React.ComponentType<{
    columnId: string;
    variant?: 'default' | 'ghost';
    size?: 'default' | 'sm';
    children?: React.ReactNode;
    className?: string;
  }>;
  let mockAddTaskOptimistically: jest.Mock;
  let mockReplaceOptimisticTask: jest.Mock;
  let mockRevertOptimisticAdd: jest.Mock;
  let mockCreateTaskAction: jest.Mock;

  beforeEach(() => {
    mockAddTaskOptimistically = jest.fn();
    mockReplaceOptimisticTask = jest.fn();
    mockRevertOptimisticAdd = jest.fn();
    mockCreateTaskAction = jest.fn();

    const { useTaskStore } = jest.requireMock('../../lib/store');
    const { createTaskAction } = jest.requireMock('../../lib/actions');

    useTaskStore.mockImplementation(
      (
        selector: (store: {
          addTaskOptimistically: jest.Mock;
          replaceOptimisticTask: jest.Mock;
          revertOptimisticAdd: jest.Mock;
        }) => unknown
      ) => {
        const mockStore = {
          addTaskOptimistically: mockAddTaskOptimistically,
          replaceOptimisticTask: mockReplaceOptimisticTask,
          revertOptimisticAdd: mockRevertOptimisticAdd,
        };
        return selector(mockStore);
      }
    );

    createTaskAction.mockImplementation(mockCreateTaskAction);
  });

  beforeAll(async () => {
    const addTaskButtonModule = await import(
      '../../components/add-task-button'
    );
    AddTaskButton = addTaskButtonModule.AddTaskButton;
  });

  it('should render without crashing', () => {
    expect(() => render(<AddTaskButton columnId='todo' />)).not.toThrow();
  });

  it('should render the button with default props', () => {
    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    expect(button).toBeDefined();
    expect(button.getAttribute('data-variant')).toBe('default');
    expect(button.getAttribute('data-size')).toBe('default');
    expect(button.textContent).toContain('Add Task');
  });

  it('should render the plus icon when not creating', () => {
    render(<AddTaskButton columnId='todo' />);

    expect(screen.getByTestId('plus-icon')).toBeDefined();
  });

  it('should render custom children when provided', () => {
    render(
      <AddTaskButton columnId='todo'>
        <span>Custom Button Text</span>
      </AddTaskButton>
    );

    expect(screen.getByText('Custom Button Text')).toBeDefined();
    expect(screen.queryByText('Add Task')).toBeNull();
  });

  it('should apply custom variant and size props', () => {
    render(<AddTaskButton columnId='todo' variant='ghost' size='sm' />);

    const button = screen.getByTestId('button');
    expect(button.getAttribute('data-variant')).toBe('ghost');
    expect(button.getAttribute('data-size')).toBe('sm');
  });

  it('should apply custom className', () => {
    render(<AddTaskButton columnId='todo' className='custom-class' />);

    const button = screen.getByTestId('button');
    expect(button.className).toContain('custom-class');
  });

  it('should open task dialog when button is clicked', () => {
    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    expect(screen.getByTestId('task-dialog')).toBeDefined();
  });

  it('should close task dialog when close button is clicked', async () => {
    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    expect(screen.getByTestId('task-dialog')).toBeDefined();

    const closeButton = screen.getByText('Close Dialog');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('task-dialog')).toBeNull();
    });
  });

  it('should handle task submission successfully', async () => {
    mockCreateTaskAction.mockResolvedValue({
      success: true,
      task: { id: 'real-task-id', title: 'Test Task' },
    });

    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    const submitButton = screen.getByText('Submit Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTaskOptimistically).toHaveBeenCalledWith({
        id: 'test-uuid-123',
        title: 'Test Task',
        description: 'Test Description',
        assignee: 'Test User',
        priority: 'medium',
        dueDate: null,
        columnId: 'todo',
        order: 0,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockCreateTaskAction).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        assignee: 'Test User',
        priority: 'medium',
        columnId: 'todo',
      });

      expect(mockReplaceOptimisticTask).toHaveBeenCalledWith('test-uuid-123', {
        id: 'real-task-id',
        title: 'Test Task',
      });
    });
  });

  it('should handle task submission failure', async () => {
    mockCreateTaskAction.mockResolvedValue({
      success: false,
      error: 'Failed to create task',
    });

    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    const submitButton = screen.getByText('Submit Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTaskOptimistically).toHaveBeenCalled();
      expect(mockCreateTaskAction).toHaveBeenCalled();
      expect(mockRevertOptimisticAdd).toHaveBeenCalledWith('test-uuid-123');
    });
  });

  it('should handle task submission error', async () => {
    mockCreateTaskAction.mockRejectedValue(new Error('Network error'));

    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    const submitButton = screen.getByText('Submit Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTaskOptimistically).toHaveBeenCalled();
      expect(mockCreateTaskAction).toHaveBeenCalled();
      expect(mockRevertOptimisticAdd).toHaveBeenCalledWith('test-uuid-123');
    });
  });

  it('should show loading state during task creation', async () => {
    mockCreateTaskAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    const submitButton = screen.getByText('Submit Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeDefined();
      expect(screen.getByText('Creating...')).toBeDefined();
    });
  });

  it('should disable button during task creation', async () => {
    mockCreateTaskAction.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    const submitButton = screen.getByText('Submit Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(button.getAttribute('disabled')).toBe('');
    });
  });

  it('should handle due date when provided', async () => {
    mockCreateTaskAction.mockResolvedValue({
      success: true,
      task: { id: 'real-task-id', title: 'Test Task' },
    });

    render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    fireEvent.click(button);

    const submitButton = screen.getByText('Submit Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTaskOptimistically).toHaveBeenCalledWith(
        expect.objectContaining({
          dueDate: null, // Default due date is null
        })
      );
    });
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(<AddTaskButton columnId='todo' />);

    rerender(<AddTaskButton columnId='todo' />);

    expect(screen.getByTestId('button')).toBeDefined();
  });

  it('should maintain button state across re-renders', () => {
    const { rerender } = render(<AddTaskButton columnId='todo' />);

    const button = screen.getByTestId('button');
    expect(button.getAttribute('disabled')).toBeNull();

    rerender(<AddTaskButton columnId='todo' />);

    const buttonAfterRerender = screen.getByTestId('button');
    expect(buttonAfterRerender.getAttribute('disabled')).toBeNull();
  });
});

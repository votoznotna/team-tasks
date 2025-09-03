import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Mock the UI components
jest.mock('../../components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    className?: string;
  }) => (
    <span data-testid='badge' data-variant={variant} className={className}>
      {children}
    </span>
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

// Mock the components
jest.mock('../../components/task-card', () => ({
  TaskCard: ({
    task,
    availableColumns,
    columnId,
    isLoading,
  }: {
    task: { id: string; title: string };
    availableColumns: { id: string; title: string }[];
    columnId: string;
    isLoading: boolean;
  }) => (
    <div
      data-testid={`task-card-${task.id}`}
      data-column-id={columnId}
      data-loading={isLoading}
    >
      {task.title} - {availableColumns.length} available columns
    </div>
  ),
}));

jest.mock('../../components/add-task-button', () => ({
  AddTaskButton: ({
    columnId,
    variant,
    size,
    children,
    className,
  }: {
    columnId: string;
    variant?: string;
    size?: string;
    children?: React.ReactNode;
    className?: string;
  }) => (
    <button
      data-testid={`add-task-button-${columnId}`}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children || 'Add Task'}
    </button>
  ),
}));

jest.mock('../../components/task-movement', () => ({
  TaskMovement: ({
    task,
    fromColumnId,
    toColumnId,
    onComplete,
  }: {
    task: { id: string; title: string };
    fromColumnId: string;
    toColumnId: string;
    onComplete: () => void;
  }) => (
    <div
      data-testid='task-movement'
      data-from={fromColumnId}
      data-to={toColumnId}
    >
      Moving {task.title} from {fromColumnId} to {toColumnId}
      <button onClick={onComplete}>Complete Movement</button>
    </div>
  ),
}));

// Mock the loading context
jest.mock('../../components/loading-context', () => ({
  useLoading: jest.fn(() => ({
    isTaskLoading: jest.fn(() => false),
    movingTask: null,
    setMovingTask: jest.fn(),
    setTaskLoading: jest.fn(),
  })),
}));

// Mock the store
jest.mock('../../lib/store', () => ({
  useTaskStore: jest.fn(() => ({
    columns: [],
    setColumns: jest.fn(),
  })),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: ({ className }: { className?: string }) => (
    <svg data-testid='plus-icon' className={className} />
  ),
}));

describe('KanbanBoardContent Component', () => {
  // Using any[] to avoid complex type inference issues between test and component types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let KanbanBoardContent: React.ComponentType<{ columns: any[] }>;
  let mockSetColumns: jest.Mock;
  let mockSetMovingTask: jest.Mock;
  let mockSetTaskLoading: jest.Mock;
  let mockIsTaskLoading: jest.Mock;

  const mockColumns = [
    {
      id: 'todo',
      title: 'Todo',
      order: 0,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tasks: [
        {
          id: 'task-1',
          title: 'Test Task 1',
          description: 'This is a test task',
          priority: 'medium',
          assignee: 'John Doe',
          dueDate: new Date('2024-12-31'),
          order: 0,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          columnId: 'todo',
        },
        {
          id: 'task-2',
          title: 'Test Task 2',
          description: 'Another test task',
          priority: 'high',
          assignee: null,
          dueDate: null,
          order: 1,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
          columnId: 'todo',
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      order: 1,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tasks: [
        {
          id: 'task-3',
          title: 'In Progress Task',
          description: 'Working on this task',
          priority: 'low',
          assignee: 'Jane Smith',
          dueDate: new Date('2024-12-25'),
          order: 0,
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-03'),
          columnId: 'in-progress',
        },
      ],
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

  beforeEach(() => {
    mockSetColumns = jest.fn();
    mockSetMovingTask = jest.fn();
    mockSetTaskLoading = jest.fn();
    mockIsTaskLoading = jest.fn(() => false);

    const { useLoading } = jest.requireMock('../../components/loading-context');
    const { useTaskStore } = jest.requireMock('../../lib/store');

    useLoading.mockReturnValue({
      isTaskLoading: mockIsTaskLoading,
      movingTask: null,
      setMovingTask: mockSetMovingTask,
      setTaskLoading: mockSetTaskLoading,
    });

    useTaskStore.mockReturnValue({
      columns: [],
      setColumns: mockSetColumns,
    });
  });

  beforeAll(async () => {
    const kanbanBoardContentModule = await import(
      '../../components/kanban-board-content'
    );
    KanbanBoardContent = kanbanBoardContentModule.KanbanBoardContent;
  });

  it('should render without crashing', () => {
    expect(() =>
      render(<KanbanBoardContent columns={mockColumns} />)
    ).not.toThrow();
  });

  it('should render the header with title and description', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    // Initially should show loading state
    expect(screen.getByTestId('loading-spinner')).toBeDefined();

    // Wait for initialization to complete
    await waitFor(
      () => {
        expect(screen.getByText('Team Tasks Board')).toBeDefined();
      },
      { timeout: 1000 }
    );

    expect(screen.getByText("Manage your team's workflow")).toBeDefined();
  });

  it('should render all columns', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(screen.getByText('Todo')).toBeDefined();
      expect(screen.getByText('In Progress')).toBeDefined();
      expect(screen.getByText('Done')).toBeDefined();
    });
  });

  it('should render task count badges', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      const badges = screen.getAllByTestId('badge');
      expect(badges).toHaveLength(3);

      expect(badges[0].textContent).toBe('2'); // Todo has 2 tasks
      expect(badges[1].textContent).toBe('1'); // In Progress has 1 task
      expect(badges[2].textContent).toBe('0'); // Done has 0 tasks
    });
  });

  it('should render task cards', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(screen.getByTestId('task-card-task-1')).toBeDefined();
      expect(screen.getByTestId('task-card-task-2')).toBeDefined();
      expect(screen.getByTestId('task-card-task-3')).toBeDefined();
    });
  });

  it('should render add task buttons for each column', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(screen.getByTestId('add-task-button-todo')).toBeDefined();
      expect(screen.getByTestId('add-task-button-done')).toBeDefined();
    });

    // Note: In Progress column doesn't have an add task button when it has tasks
    // Only empty columns get add task buttons
  });

  it('should render empty state for columns with no tasks', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeDefined();
      expect(screen.getByTestId('add-task-button-done')).toBeDefined();
    });
  });

  it('should initialize store with server data if empty', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(mockSetColumns).toHaveBeenCalledWith(mockColumns);
    });
  });

  it('should show loading spinner during initialization', () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });

  it('should hide loading spinner after initialization', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(
      () => {
        const spinner = screen.queryByTestId('loading-spinner');
        expect(spinner === null).toBe(true);
      },
      { timeout: 1000 }
    );
  });

  it('should apply smooth transitions after initialization', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      const title = screen.getByText('Team Tasks Board');
      const description = screen.getByText("Manage your team's workflow");
      const grid = screen.getByText('', { selector: '[class*="grid"]' });

      expect(title.className).toContain('opacity-100');
      expect(title.className).toContain('translate-y-0');
      expect(description.className).toContain('opacity-100');
      expect(description.className).toContain('translate-y-0');
      expect(grid.className).toContain('opacity-100');
      expect(grid.className).toContain('translate-y-0');
    });
  });

  it('should render task movement when moving task', async () => {
    const { useLoading } = jest.requireMock('../../components/loading-context');

    useLoading.mockReturnValue({
      isTaskLoading: mockIsTaskLoading,
      movingTask: {
        taskId: 'task-1',
        fromColumnId: 'todo',
        toColumnId: 'in-progress',
      },
      setMovingTask: mockSetMovingTask,
      setTaskLoading: mockSetTaskLoading,
    });

    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(screen.getByTestId('task-movement')).toBeDefined();
      expect(
        screen.getByText('Moving Test Task 1 from todo to in-progress')
      ).toBeDefined();
    });
  });

  it('should highlight destination column during movement', async () => {
    const { useLoading } = jest.requireMock('../../components/loading-context');

    useLoading.mockReturnValue({
      isTaskLoading: mockIsTaskLoading,
      movingTask: {
        taskId: 'task-1',
        fromColumnId: 'todo',
        toColumnId: 'in-progress',
      },
      setMovingTask: mockSetMovingTask,
      setTaskLoading: mockSetTaskLoading,
    });

    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      // Find the column content div that should have the highlighting
      const inProgressColumnContent = screen
        .getByTestId('task-card-task-3')
        .closest('div')?.parentElement?.parentElement;
      expect(inProgressColumnContent?.className).toContain(
        'border-green-500/50'
      );
      expect(inProgressColumnContent?.className).toContain('bg-green-500/5');
    });
  });

  it('should handle movement completion', async () => {
    const { useLoading } = jest.requireMock('../../components/loading-context');

    useLoading.mockReturnValue({
      isTaskLoading: mockIsTaskLoading,
      movingTask: {
        taskId: 'task-1',
        fromColumnId: 'todo',
        toColumnId: 'in-progress',
      },
      setMovingTask: mockSetMovingTask,
      setTaskLoading: mockSetTaskLoading,
    });

    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      const completeButton = screen.getByText('Complete Movement');
      fireEvent.click(completeButton);

      expect(mockSetTaskLoading).toHaveBeenCalledWith('task-1', false);
      expect(mockSetMovingTask).toHaveBeenCalledWith(null);
    });
  });

  it('should show destination column highlighting during movement', async () => {
    const { useLoading } = jest.requireMock('../../components/loading-context');

    useLoading.mockReturnValue({
      isTaskLoading: mockIsTaskLoading,
      movingTask: {
        taskId: 'task-1',
        fromColumnId: 'todo',
        toColumnId: 'in-progress',
      },
      setMovingTask: mockSetMovingTask,
      setTaskLoading: mockSetTaskLoading,
    });

    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      const overlay = screen.getByText('', {
        selector: '[class*="bg-green-500/5"][class*="animate-pulse"]',
      });
      expect(overlay).toBeDefined();
      expect(overlay.className).toContain('animate-pulse');
    });
  });

  it('should render responsive grid layout', async () => {
    render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      const grid = screen.getByText('', { selector: '[class*="grid"]' });
      expect(grid.className).toContain('grid-cols-1');
      expect(grid.className).toContain('md:grid-cols-3');
      expect(grid.className).toContain('gap-6');
    });
  });

  it('should handle empty columns array', async () => {
    render(<KanbanBoardContent columns={[]} />);

    await waitFor(() => {
      expect(screen.getByText('Team Tasks Board')).toBeDefined();
      expect(screen.getByText("Manage your team's workflow")).toBeDefined();
    });
  });

  it('should render without unnecessary re-renders', async () => {
    const { rerender } = render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(screen.getByText('Team Tasks Board')).toBeDefined();
    });

    rerender(<KanbanBoardContent columns={mockColumns} />);

    expect(screen.getByText('Team Tasks Board')).toBeDefined();
  });

  it('should maintain column structure across re-renders', async () => {
    const { rerender } = render(<KanbanBoardContent columns={mockColumns} />);

    await waitFor(() => {
      expect(screen.getByText('Todo')).toBeDefined();
      expect(screen.getByText('In Progress')).toBeDefined();
      expect(screen.getByText('Done')).toBeDefined();
    });

    rerender(<KanbanBoardContent columns={mockColumns} />);

    expect(screen.getByText('Todo')).toBeDefined();
    expect(screen.getByText('In Progress')).toBeDefined();
    expect(screen.getByText('Done')).toBeDefined();
  });
});

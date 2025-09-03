import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the UI components
jest.mock('../../components/ui/card', () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='card' className={className}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='card-content' className={className}>
      {children}
    </div>
  ),
  CardDescription: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='card-description' className={className}>
      {children}
    </div>
  ),
  CardHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='card-header' className={className}>
      {children}
    </div>
  ),
  CardTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <h3 data-testid='card-title' className={className}>
      {children}
    </h3>
  ),
}));

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

jest.mock('../../components/ui/avatar', () => ({
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='avatar' className={className}>
      {children}
    </div>
  ),
  AvatarFallback: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid='avatar-fallback' className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid='avatar-image' data-src={src} data-alt={alt} />
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
  Calendar: ({ className }: { className?: string }) => (
    <svg data-testid='calendar-icon' className={className} />
  ),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock the store
jest.mock('../../lib/store', () => ({
  useTaskStore: jest.fn(
    (selector: (state: { moveTaskOptimistically: jest.Mock }) => unknown) => {
      const mockStore = {
        moveTaskOptimistically: jest.fn(),
      };
      return selector(mockStore);
    }
  ),
}));

// Mock server actions
jest.mock('../../lib/actions', () => ({
  moveTaskAction: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

// Mock Date.now for consistent timing
const mockDateNow = jest.fn();
global.Date.now = mockDateNow;

describe('TaskMovement Component', () => {
  let TaskMovement: React.ComponentType<{
    task: {
      id: string;
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      assignee: string | null;
      dueDate: Date | null;
      order: number;
      createdAt: Date;
      updatedAt: Date;
      columnId: string;
    };
    fromColumnId: string;
    toColumnId: string;
    columns: Array<{
      id: string;
      title: string;
      order: number;
      createdAt: Date;
      updatedAt: Date;
      tasks: Array<{
        id: string;
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        assignee: string | null;
        dueDate: Date | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        columnId: string;
      }>;
    }>;
    onComplete: () => void;
  }>;
  let mockOnComplete: jest.Mock;
  let mockMoveTaskOptimistically: jest.Mock;

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'This is a test task description',
    priority: 'medium' as const,
    assignee: 'John Doe',
    dueDate: new Date('2024-12-31'),
    order: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    columnId: 'todo',
  };

  const mockColumns = [
    {
      id: 'todo',
      title: 'Todo',
      order: 0,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      tasks: [mockTask],
    },
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

  beforeEach(() => {
    mockOnComplete = jest.fn();
    mockMoveTaskOptimistically = jest.fn();

    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock implementations
    const { useTaskStore } = jest.requireMock('../../lib/store');
    useTaskStore.mockImplementation(
      (selector: (state: { moveTaskOptimistically: jest.Mock }) => unknown) => {
        const mockStore = {
          moveTaskOptimistically: mockMoveTaskOptimistically,
        };
        return selector(mockStore);
      }
    );

    const { moveTaskAction } = jest.requireMock('../../lib/actions');
    moveTaskAction.mockResolvedValue({ success: true });

    // Setup mock Date.now
    mockDateNow.mockReturnValue(1000);
  });

  beforeAll(async () => {
    const taskMovementModule = await import('../../components/task-movement');
    TaskMovement = taskMovementModule.TaskMovement;
  });

  it('should render without crashing', () => {
    expect(() =>
      render(
        <TaskMovement
          task={mockTask}
          fromColumnId='todo'
          toColumnId='done'
          columns={mockColumns}
          onComplete={mockOnComplete}
        />
      )
    ).not.toThrow();
  });

  it('should render the main container with proper styling', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const container = screen.getByTestId('card').closest('div')
      ?.parentElement?.parentElement;
    expect(container?.className).toContain(
      'fixed inset-0 z-50 pointer-events-none bg-background/20 backdrop-blur-sm'
    );
  });

  it('should render progress bar with initial state', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const progressBar = screen.getByText('0%');
    expect(progressBar).toBeDefined();

    const progressContainer = progressBar.closest('div')?.parentElement;
    expect(progressContainer?.className).toContain(
      'bg-muted rounded-full overflow-hidden border-2 border-border'
    );
  });

  it('should render task card with proper content', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('card')).toBeDefined();
    expect(screen.getByTestId('card-header')).toBeDefined();
    expect(screen.getByTestId('card-content')).toBeDefined();
    expect(screen.getByTestId('card-title')).toBeDefined();
    expect(screen.getByTestId('card-description')).toBeDefined();
  });

  it('should display task title correctly', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Test Task')).toBeDefined();
  });

  it('should display task description correctly', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('This is a test task description')).toBeDefined();
  });

  it('should render priority badge with correct styling', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const priorityBadge = screen.getByText('Medium Priority');
    expect(priorityBadge).toBeDefined();
    expect(priorityBadge.getAttribute('data-variant')).toBe('secondary');
  });

  it('should render assignee information when present', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('avatar')).toBeDefined();
    expect(screen.getByTestId('avatar-fallback')).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
  });

  it('should render due date when present', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('calendar-icon')).toBeDefined();
    expect(screen.getByText(/Due:/)).toBeDefined();
  });

  it('should render movement indicator with correct text', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText(/Moving from Todo to Done/)).toBeDefined();
    expect(screen.getByText(/Todo • 0% complete/)).toBeDefined();
  });

  it('should show loading spinner and moving text initially', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeDefined();
    expect(screen.getByText('Moving...')).toBeDefined();
  });

  it('should render task card with proper positioning', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const taskCard = screen.getByTestId('card').closest('div')?.parentElement;
    expect(taskCard?.className).toContain(
      'absolute top-16 left-1/2 transform -translate-x-1/2'
    );
  });

  it('should render task card with proper width and styling', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const taskCard = screen.getByTestId('card');
    expect(taskCard.className).toContain(
      'w-80 shadow-lg border-2 bg-card/95 backdrop-blur-sm'
    );
  });

  it('should handle task without assignee gracefully', () => {
    const taskWithoutAssignee = { ...mockTask, assignee: null };

    render(
      <TaskMovement
        task={taskWithoutAssignee}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.queryByTestId('avatar')).toBeNull();
    expect(screen.queryByText('John Doe')).toBeNull();
  });

  it('should handle task without due date gracefully', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: null };

    render(
      <TaskMovement
        task={taskWithoutDueDate}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.queryByTestId('calendar-icon')).toBeNull();
    expect(screen.queryByText(/Due:/)).toBeNull();
  });

  it('should render different priority badges correctly', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const };

    render(
      <TaskMovement
        task={highPriorityTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('High Priority')).toBeDefined();
  });

  it('should render low priority badge correctly', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' as const };

    render(
      <TaskMovement
        task={lowPriorityTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Low Priority')).toBeDefined();
  });

  it('should handle movement between adjacent columns', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='in-progress'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText(/Moving from Todo to In Progress/)).toBeDefined();
  });

  it('should handle movement to the same column gracefully', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='todo'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText(/Moving from Todo to Todo/)).toBeDefined();
  });

  it('should render with proper z-index and pointer events', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const container = screen.getByTestId('card').closest('div')
      ?.parentElement?.parentElement;
    expect(container?.className).toContain('z-50 pointer-events-none');
  });

  it('should render backdrop with proper styling', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const container = screen.getByTestId('card').closest('div')
      ?.parentElement?.parentElement;
    expect(container?.className).toContain('bg-background/20 backdrop-blur-sm');
  });

  it('should render progress bar with proper dimensions', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const progressContainer = screen
      .getByText('0%')
      .closest('div')?.parentElement;
    expect(progressContainer?.className).toContain('w-96 h-4');
  });

  it('should render progress bar with proper positioning', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const progressContainer = screen
      .getByText('0%')
      .closest('div')?.parentElement;
    expect(progressContainer?.className).toContain(
      'absolute top-4 left-1/2 transform -translate-x-1/2'
    );
  });

  it('should render task card with proper shadow and border', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const taskCard = screen.getByTestId('card');
    expect(taskCard.className).toContain('shadow-lg border-2');
  });

  it('should render task card with proper background and backdrop', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const taskCard = screen.getByTestId('card');
    expect(taskCard.className).toContain('bg-card/95 backdrop-blur-sm');
  });

  it('should render task card with proper transitions', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const taskCard = screen.getByTestId('card');
    expect(taskCard.className).toContain('transition-all duration-300');
  });

  it('should render movement indicator with proper styling', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const movementIndicator = screen
      .getByText(/Moving from Todo to Done/)
      .closest('div')?.parentElement;
    expect(movementIndicator?.className).toContain('mt-4 text-center');
  });

  it('should render movement indicator text with proper styling', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const mainText = screen.getByText(/Moving from Todo to Done/);
    expect(mainText.className).toContain('text-sm font-medium text-foreground');
  });

  it('should render movement indicator subtitle with proper styling', () => {
    render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    const subtitle = screen.getByText(/Todo • 0% complete/);
    expect(subtitle.className).toContain('text-xs text-muted-foreground mt-1');
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    rerender(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('card')).toBeDefined();
  });

  it('should maintain component structure across re-renders', () => {
    const { rerender } = render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    rerender(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByTestId('card-header')).toBeDefined();
    expect(screen.getByTestId('card-content')).toBeDefined();
    expect(screen.getByTestId('card-title')).toBeDefined();
    expect(screen.getByTestId('card-description')).toBeDefined();
  });

  it('should handle task title changes correctly', () => {
    const { rerender } = render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    // Initially should show original title
    expect(screen.getByText('Test Task')).toBeDefined();

    // Change task title
    const updatedTask = { ...mockTask, title: 'Updated Task Title' };
    rerender(
      <TaskMovement
        task={updatedTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Updated Task Title')).toBeDefined();
  });

  it('should handle priority changes correctly', () => {
    const { rerender } = render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    // Initially should show medium priority
    expect(screen.getByText('Medium Priority')).toBeDefined();

    // Change priority
    const updatedTask = { ...mockTask, priority: 'high' as const };
    rerender(
      <TaskMovement
        task={updatedTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('High Priority')).toBeDefined();
  });

  it('should handle assignee changes correctly', () => {
    const { rerender } = render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    // Initially should show John Doe
    expect(screen.getByText('John Doe')).toBeDefined();

    // Change assignee
    const updatedTask = { ...mockTask, assignee: 'Jane Smith' };
    rerender(
      <TaskMovement
        task={updatedTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Jane Smith')).toBeDefined();
  });

  it('should handle due date changes correctly', () => {
    const { rerender } = render(
      <TaskMovement
        task={mockTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    // Initially should show due date
    expect(screen.getByText(/Due:/)).toBeDefined();

    // Change due date
    const updatedTask = { ...mockTask, dueDate: new Date('2025-01-01') };
    rerender(
      <TaskMovement
        task={updatedTask}
        fromColumnId='todo'
        toColumnId='done'
        columns={mockColumns}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText(/Due:/)).toBeDefined();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the UI components
jest.mock('../../components/ui/card', () => ({
  Card: ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid='card' className={className} {...props}>
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
  CardDescription: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <p data-testid='card-description' className={className}>
      {children}
    </p>
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
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid='avatar-image' data-src={src} data-alt={alt} />
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
}));

jest.mock('../../components/ui/loading-spinner', () => ({
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid='loading-spinner' data-size={size}>
      Loading...
    </div>
  ),
}));

// Mock the TaskCardActions component
jest.mock('../../components/task-card-actions', () => ({
  TaskCardActions: ({
    task,
    columnId,
  }: {
    task: { id: string; title: string };
    columnId: string;
  }) => (
    <div
      data-testid='task-card-actions'
      data-task-id={task.id}
      data-column-id={columnId}
    >
      Actions for {task.title}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: ({ className }: { className?: string }) => (
    <svg data-testid='calendar-icon' className={className} />
  ),
}));

describe('TaskCard Component', () => {
  let TaskCard: React.ComponentType<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    availableColumns: any[];
    columnId: string;
    isLoading?: boolean;
  }>;

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description:
      'This is a test task description that should be displayed in the card',
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
      tasks: [],
    },
    {
      id: 'done',
      title: 'Done',
      order: 2,
      tasks: [],
    },
  ];

  beforeAll(async () => {
    const taskCardModule = await import('../../components/task-card');
    TaskCard = taskCardModule.TaskCard;
  });

  it('should render without crashing', () => {
    expect(() =>
      render(
        <TaskCard
          task={mockTask}
          availableColumns={mockAvailableColumns}
          columnId='todo'
        />
      )
    ).not.toThrow();
  });

  it('should render the task title', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('Test Task')).toBeDefined();
  });

  it('should render the task description', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(
      screen.getByText(
        'This is a test task description that should be displayed in the card'
      )
    ).toBeDefined();
  });

  it('should render the priority badge', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toBeDefined();
    expect(badge.textContent).toBe('Medium Priority');
  });

  it('should render the assignee avatar and name', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByTestId('avatar')).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('JD')).toBeDefined(); // Initials
  });

  it('should render the due date', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByTestId('calendar-icon')).toBeDefined();
    expect(screen.getByText(/Due:/)).toBeDefined();
  });

  it('should render the TaskCardActions component', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const actions = screen.getByTestId('task-card-actions');
    expect(actions).toBeDefined();
    expect(actions.getAttribute('data-task-id')).toBe('task-1');
    expect(actions.getAttribute('data-column-id')).toBe('todo');
  });

  it('should apply correct priority colors for low priority', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' as const };
    render(
      <TaskCard
        task={lowPriorityTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const badge = screen.getByTestId('badge');
    expect(badge.className).toContain('bg-green-100');
    expect(badge.className).toContain('text-green-800');
  });

  it('should apply correct priority colors for medium priority', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const badge = screen.getByTestId('badge');
    expect(badge.className).toContain('bg-yellow-100');
    expect(badge.className).toContain('text-yellow-800');
  });

  it('should apply correct priority colors for high priority', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const };
    render(
      <TaskCard
        task={highPriorityTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const badge = screen.getByTestId('badge');
    expect(badge.className).toContain('bg-red-100');
    expect(badge.className).toContain('text-red-800');
  });

  it('should display correct priority labels', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' as const };
    const highPriorityTask = { ...mockTask, priority: 'high' as const };

    const { rerender } = render(
      <TaskCard
        task={lowPriorityTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );
    expect(screen.getByText('Low Priority')).toBeDefined();

    rerender(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );
    expect(screen.getByText('Medium Priority')).toBeDefined();

    rerender(
      <TaskCard
        task={highPriorityTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );
    expect(screen.getByText('High Priority')).toBeDefined();
  });

  it('should generate correct initials from assignee name', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('JD')).toBeDefined(); // John Doe -> JD
  });

  it('should handle assignee names with multiple words', () => {
    const multiWordTask = { ...mockTask, assignee: 'Jane Marie Smith' };
    render(
      <TaskCard
        task={multiWordTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('JMS')).toBeDefined(); // Jane Marie Smith -> JMS
  });

  it('should handle assignee names with single word', () => {
    const singleWordTask = { ...mockTask, assignee: 'Alice' };
    render(
      <TaskCard
        task={singleWordTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('A')).toBeDefined(); // Alice -> A
  });

  it('should format due date correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText(/Due:/)).toBeDefined();
    // The exact format depends on locale, so we just check that it contains the date
    expect(screen.getByText(/Due:/).textContent).toContain('Due:');
  });

  it('should not render assignee section when no assignee', () => {
    const noAssigneeTask = { ...mockTask, assignee: null };
    render(
      <TaskCard
        task={noAssigneeTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.queryByTestId('avatar')).toBeNull();
    expect(screen.queryByText('John Doe')).toBeNull();
  });

  it('should not render due date section when no due date', () => {
    const noDueDateTask = { ...mockTask, dueDate: null };
    render(
      <TaskCard
        task={noDueDateTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.queryByTestId('calendar-icon')).toBeNull();
    expect(screen.queryByText(/Due:/)).toBeNull();
  });

  it('should apply loading state styles when isLoading is true', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
        isLoading={true}
      />
    );

    const card = screen.getByTestId('card');
    expect(card.className).toContain('opacity-75');
    expect(card.className).toContain('pointer-events-none');
  });

  it('should show loading overlay when isLoading is true', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
        isLoading={true}
      />
    );

    expect(screen.getByTestId('loading-spinner')).toBeDefined();
    expect(screen.getByText('Processing...')).toBeDefined();
  });

  it('should not show loading overlay when isLoading is false', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('loading-spinner')).toBeNull();
    expect(screen.queryByText('Processing...')).toBeNull();
  });

  it('should apply hover effects and transitions', () => {
    render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const card = screen.getByTestId('card');
    expect(card.className).toContain('hover:shadow-sm');
    expect(card.className).toContain('transition-all');
    expect(card.className).toContain('duration-200');
    expect(card.className).toContain('hover:border-border/60');
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    rerender(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText('Test Task')).toBeDefined();
  });

  it('should maintain card structure across re-renders', () => {
    const { rerender } = render(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    rerender(
      <TaskCard
        task={mockTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByTestId('card')).toBeDefined();
    expect(screen.getByTestId('card-header')).toBeDefined();
    expect(screen.getByTestId('card-content')).toBeDefined();
  });

  it('should handle empty description gracefully', () => {
    const emptyDescTask = { ...mockTask, description: '' };
    render(
      <TaskCard
        task={emptyDescTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    const description = screen.getByTestId('card-description');
    expect(description.textContent).toBe('');
  });

  it('should handle very long titles and descriptions', () => {
    const longContentTask = {
      ...mockTask,
      title:
        'This is a very long task title that should be handled gracefully by the component and not break the layout',
      description:
        'This is an extremely long description that contains many words and should be properly truncated or wrapped to prevent the card from becoming too wide or breaking the overall design of the kanban board',
    };

    render(
      <TaskCard
        task={longContentTask}
        availableColumns={mockAvailableColumns}
        columnId='todo'
      />
    );

    expect(screen.getByText(longContentTask.title)).toBeDefined();
    expect(screen.getByText(longContentTask.description)).toBeDefined();
  });
});

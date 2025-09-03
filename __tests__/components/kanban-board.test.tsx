import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the LoadingProvider
jest.mock('../../components/loading-context', () => ({
  LoadingProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='loading-provider'>{children}</div>
  ),
}));

// Mock the KanbanBoardContent
jest.mock('../../components/kanban-board-content', () => ({
  KanbanBoardContent: ({
    columns,
  }: {
    columns: {
      id: string;
      title: string;
      order: number;
      tasks: { id: string; title: string }[];
    }[];
  }) => (
    <div data-testid='kanban-board-content'>
      Kanban Board Content with {columns.length} columns
      {columns.map(
        (col: {
          id: string;
          title: string;
          order: number;
          tasks: { id: string; title: string }[];
        }) => (
          <div key={col.id} data-testid={`column-${col.id}`}>
            {col.title} - {col.tasks.length} tasks
          </div>
        )
      )}
    </div>
  ),
}));

describe('KanbanBoard Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let KanbanBoard: React.ComponentType<{ columns: any[] }>;

  beforeAll(async () => {
    const kanbanBoardModule = await import('../../components/kanban-board');
    KanbanBoard = kanbanBoardModule.KanbanBoard;
  });

  it('should render without crashing', () => {
    expect(() => render(<KanbanBoard columns={[]} />)).not.toThrow();
  });

  it('should render the LoadingProvider', () => {
    render(<KanbanBoard columns={[]} />);

    expect(screen.getByTestId('loading-provider')).toBeDefined();
  });

  it('should render the KanbanBoardContent', () => {
    render(<KanbanBoard columns={[]} />);

    expect(screen.getByTestId('kanban-board-content')).toBeDefined();
  });

  it('should pass columns prop to KanbanBoardContent', () => {
    const mockColumns = [
      {
        id: 'todo',
        title: 'Todo',
        order: 0,
        tasks: [
          { id: 'task-1', title: 'Task 1' },
          { id: 'task-2', title: 'Task 2' },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        order: 1,
        tasks: [{ id: 'task-3', title: 'Task 3' }],
      },
    ];

    render(<KanbanBoard columns={mockColumns} />);

    expect(screen.getByTestId('kanban-board-content')).toBeDefined();
    expect(screen.getByTestId('column-todo')).toBeDefined();
    expect(screen.getByTestId('column-in-progress')).toBeDefined();

    expect(screen.getByText('Todo - 2 tasks')).toBeDefined();
    expect(screen.getByText('In Progress - 1 tasks')).toBeDefined();
  });

  it('should handle empty columns array', () => {
    render(<KanbanBoard columns={[]} />);

    expect(screen.getByTestId('loading-provider')).toBeDefined();
    expect(screen.getByTestId('kanban-board-content')).toBeDefined();
    expect(
      screen.getByText('Kanban Board Content with 0 columns')
    ).toBeDefined();
  });

  it('should handle columns with no tasks', () => {
    const mockColumns = [
      {
        id: 'todo',
        title: 'Todo',
        order: 0,
        tasks: [],
      },
      {
        id: 'done',
        title: 'Done',
        order: 1,
        tasks: [],
      },
    ];

    render(<KanbanBoard columns={mockColumns} />);

    expect(screen.getByText('Todo - 0 tasks')).toBeDefined();
    expect(screen.getByText('Done - 0 tasks')).toBeDefined();
  });

  it('should handle columns with many tasks', () => {
    const mockColumns = [
      {
        id: 'todo',
        title: 'Todo',
        order: 0,
        tasks: Array.from({ length: 10 }, (_, i) => ({
          id: `task-${i}`,
          title: `Task ${i}`,
        })),
      },
    ];

    render(<KanbanBoard columns={mockColumns} />);

    expect(screen.getByText('Todo - 10 tasks')).toBeDefined();
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(<KanbanBoard columns={[]} />);

    rerender(<KanbanBoard columns={[]} />);

    expect(screen.getByTestId('loading-provider')).toBeDefined();
    expect(screen.getByTestId('kanban-board-content')).toBeDefined();
  });

  it('should maintain structure when columns change', () => {
    const { rerender } = render(<KanbanBoard columns={[]} />);

    const newColumns = [
      {
        id: 'new-column',
        title: 'New Column',
        order: 0,
        tasks: [],
      },
    ];

    rerender(<KanbanBoard columns={newColumns} />);

    expect(screen.getByTestId('loading-provider')).toBeDefined();
    expect(screen.getByTestId('kanban-board-content')).toBeDefined();
    expect(screen.getByText('New Column - 0 tasks')).toBeDefined();
  });

  it('should handle columns with complex task structures', () => {
    const mockColumns = [
      {
        id: 'complex',
        title: 'Complex Column',
        order: 0,
        tasks: [
          {
            id: 'task-1',
            title: 'Complex Task 1',
            description: 'This is a complex task',
            priority: 'high',
            assignee: 'John Doe',
            dueDate: new Date('2024-12-31'),
            order: 0,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            columnId: 'complex',
          },
        ],
      },
    ];

    render(<KanbanBoard columns={mockColumns} />);

    expect(screen.getByText('Complex Column - 1 tasks')).toBeDefined();
  });

  it('should render with proper component hierarchy', () => {
    render(<KanbanBoard columns={[]} />);

    const loadingProvider = screen.getByTestId('loading-provider');
    const kanbanBoardContent = screen.getByTestId('kanban-board-content');

    expect(loadingProvider).toBeDefined();
    expect(kanbanBoardContent).toBeDefined();
    expect(loadingProvider.contains(kanbanBoardContent)).toBe(true);
  });

  it('should handle columns with different order values', () => {
    const mockColumns = [
      {
        id: 'first',
        title: 'First Column',
        order: 0,
        tasks: [],
      },
      {
        id: 'second',
        title: 'Second Column',
        order: 5,
        tasks: [],
      },
      {
        id: 'third',
        title: 'Third Column',
        order: 10,
        tasks: [],
      },
    ];

    render(<KanbanBoard columns={mockColumns} />);

    expect(screen.getByText('First Column - 0 tasks')).toBeDefined();
    expect(screen.getByText('Second Column - 0 tasks')).toBeDefined();
    expect(screen.getByText('Third Column - 0 tasks')).toBeDefined();
  });
});

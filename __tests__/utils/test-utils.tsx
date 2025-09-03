import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../../components/theme-provider';
import { LoadingProvider } from '../../components/loading-context';

// Mock the database queries
jest.mock('../../lib/db/queries', () => ({
  getColumns: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  moveTask: jest.fn(),
}));

// Mock the Zustand store
jest.mock('../../lib/store', () => ({
  useTaskStore: jest.fn(() => ({
    columns: [],
    setColumns: jest.fn(),
    moveTaskOptimistically: jest.fn(),
    updateTaskOptimistically: jest.fn(),
    addTaskOptimistically: jest.fn(),
    removeTaskOptimistically: jest.fn(),
    replaceOptimisticTask: jest.fn(),
    updateTaskWithServerData: jest.fn(),
    revertOptimisticAdd: jest.fn(),
    revertOptimisticUpdate: jest.fn(),
    revertOptimisticDelete: jest.fn(),
  })),
}));

// Mock server actions
jest.mock('../../lib/actions', () => ({
  createTaskAction: jest.fn(),
  updateTaskAction: jest.fn(),
  deleteTaskAction: jest.fn(),
  moveTaskAction: jest.fn(),
}));

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <LoadingProvider>{children}</LoadingProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data for tests
export const mockColumns = [
  {
    id: 'todo',
    title: 'Todo',
    order: 0,
    tasks: [
      {
        id: 'task-1',
        title: 'Test Task 1',
        description: 'This is a test task',
        priority: 'medium' as const,
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
        priority: 'high' as const,
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
    tasks: [
      {
        id: 'task-3',
        title: 'In Progress Task',
        description: 'Working on this task',
        priority: 'low' as const,
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
    tasks: [],
  },
];

// @ts-expect-error - Mock data type inference issue
export const mockTasks = mockColumns.flatMap((col) => col.tasks);

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Add a simple test to prevent Jest from failing
describe('Test Utils', () => {
  it('should export custom render function', () => {
    expect(customRender).toBeDefined();
  });
});

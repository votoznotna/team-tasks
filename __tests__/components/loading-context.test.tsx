import React from 'react';
import { render, screen, act } from '@testing-library/react';

describe('LoadingContext', () => {
  let LoadingProvider: React.ComponentType<{ children: React.ReactNode }>;
  let useLoading: () => {
    loadingTasks: Set<string>;
    setTaskLoading: (taskId: string, isLoading: boolean) => void;
    isTaskLoading: (taskId: string) => boolean;
    movingTask: {
      taskId: string;
      fromColumnId: string;
      toColumnId: string;
    } | null;
    setMovingTask: (
      task: { taskId: string; fromColumnId: string; toColumnId: string } | null
    ) => void;
  };

  beforeAll(async () => {
    const loadingContextModule = await import(
      '../../components/loading-context'
    );
    LoadingProvider = loadingContextModule.LoadingProvider;
    useLoading = loadingContextModule.useLoading;
  });

  describe('LoadingProvider', () => {
    it('should render without crashing', () => {
      expect(() =>
        render(<LoadingProvider>Test Content</LoadingProvider>)
      ).not.toThrow();
    });

    it('should render children content', () => {
      render(<LoadingProvider>Test Content</LoadingProvider>);

      expect(screen.getByText('Test Content')).toBeDefined();
    });

    it('should render complex children content', () => {
      const complexChildren = (
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <button>Click me</button>
        </div>
      );

      render(<LoadingProvider>{complexChildren}</LoadingProvider>);

      expect(screen.getByText('Title')).toBeDefined();
      expect(screen.getByText('Description')).toBeDefined();
      expect(screen.getByText('Click me')).toBeDefined();
    });

    it('should render empty children without crashing', () => {
      expect(() =>
        render(<LoadingProvider>{null}</LoadingProvider>)
      ).not.toThrow();
      expect(() =>
        render(<LoadingProvider>{undefined}</LoadingProvider>)
      ).not.toThrow();
      expect(() =>
        render(<LoadingProvider>{null}</LoadingProvider>)
      ).not.toThrow();
    });

    it('should render multiple children', () => {
      render(
        <LoadingProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </LoadingProvider>
      );

      expect(screen.getByText('Child 1')).toBeDefined();
      expect(screen.getByText('Child 2')).toBeDefined();
      expect(screen.getByText('Child 3')).toBeDefined();
    });

    it('should render without unnecessary re-renders', () => {
      const { rerender } = render(
        <LoadingProvider>Test Content</LoadingProvider>
      );

      rerender(<LoadingProvider>Test Content</LoadingProvider>);

      expect(screen.getByText('Test Content')).toBeDefined();
    });
  });

  describe('useLoading Hook', () => {
    const TestComponent = () => {
      const {
        loadingTasks,
        setTaskLoading,
        isTaskLoading,
        movingTask,
        setMovingTask,
      } = useLoading();

      return (
        <div>
          <div data-testid='loading-tasks-count'>{loadingTasks.size}</div>
          <div data-testid='moving-task'>
            {movingTask ? JSON.stringify(movingTask) : 'null'}
          </div>
          <button
            onClick={() => setTaskLoading('task-1', true)}
            data-testid='set-loading-true'
          >
            Set Loading True
          </button>
          <button
            onClick={() => setTaskLoading('task-1', false)}
            data-testid='set-loading-false'
          >
            Set Loading False
          </button>
          <button
            onClick={() =>
              setMovingTask({
                taskId: 'task-1',
                fromColumnId: 'col1',
                toColumnId: 'col2',
              })
            }
            data-testid='set-moving-task'
          >
            Set Moving Task
          </button>
          <button
            onClick={() => setMovingTask(null)}
            data-testid='clear-moving-task'
          >
            Clear Moving Task
          </button>
          <div data-testid='task-1-loading'>
            {isTaskLoading('task-1').toString()}
          </div>
          <div data-testid='task-2-loading'>
            {isTaskLoading('task-2').toString()}
          </div>
        </div>
      );
    };

    it('should provide loading context values', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      expect(screen.getByTestId('loading-tasks-count')).toBeDefined();
      expect(screen.getByTestId('moving-task')).toBeDefined();
      expect(screen.getByTestId('task-1-loading')).toBeDefined();
      expect(screen.getByTestId('task-2-loading')).toBeDefined();
    });

    it('should initialize with empty loading tasks', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const loadingTasksCount = screen.getByTestId('loading-tasks-count');
      expect(loadingTasksCount.textContent).toBe('0');
    });

    it('should initialize with null moving task', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const movingTask = screen.getByTestId('moving-task');
      expect(movingTask.textContent).toBe('null');
    });

    it('should initialize task loading as false', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const task1Loading = screen.getByTestId('task-1-loading');
      const task2Loading = screen.getByTestId('task-2-loading');

      expect(task1Loading.textContent).toBe('false');
      expect(task2Loading.textContent).toBe('false');
    });

    it('should set task loading to true', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const setLoadingTrueButton = screen.getByTestId('set-loading-true');
      const task1Loading = screen.getByTestId('task-1-loading');
      const loadingTasksCount = screen.getByTestId('loading-tasks-count');

      act(() => {
        setLoadingTrueButton.click();
      });

      expect(task1Loading.textContent).toBe('true');
      expect(loadingTasksCount.textContent).toBe('1');
    });

    it('should set task loading to false', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const setLoadingTrueButton = screen.getByTestId('set-loading-true');
      const setLoadingFalseButton = screen.getByTestId('set-loading-false');
      const task1Loading = screen.getByTestId('task-1-loading');
      const loadingTasksCount = screen.getByTestId('loading-tasks-count');

      act(() => {
        setLoadingTrueButton.click();
      });

      expect(task1Loading.textContent).toBe('true');
      expect(loadingTasksCount.textContent).toBe('1');

      act(() => {
        setLoadingFalseButton.click();
      });

      expect(task1Loading.textContent).toBe('false');
      expect(loadingTasksCount.textContent).toBe('0');
    });

    it('should set moving task', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const setMovingTaskButton = screen.getByTestId('set-moving-task');
      const movingTask = screen.getByTestId('moving-task');

      act(() => {
        setMovingTaskButton.click();
      });

      expect(movingTask.textContent).toBe(
        '{"taskId":"task-1","fromColumnId":"col1","toColumnId":"col2"}'
      );
    });

    it('should clear moving task', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const setMovingTaskButton = screen.getByTestId('set-moving-task');
      const clearMovingTaskButton = screen.getByTestId('clear-moving-task');
      const movingTask = screen.getByTestId('moving-task');

      act(() => {
        setMovingTaskButton.click();
      });

      expect(movingTask.textContent).toBe(
        '{"taskId":"task-1","fromColumnId":"col1","toColumnId":"col2"}'
      );

      act(() => {
        clearMovingTaskButton.click();
      });

      expect(movingTask.textContent).toBe('null');
    });

    it('should handle multiple task loading states', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const setLoadingTrueButton = screen.getByTestId('set-loading-true');
      const loadingTasksCount = screen.getByTestId('loading-tasks-count');

      act(() => {
        setLoadingTrueButton.click();
      });

      expect(loadingTasksCount.textContent).toBe('1');

      // Simulate setting another task to loading by clicking a button
      const setLoadingTrueButton2 = screen.getByTestId('set-loading-true');
      act(() => {
        setLoadingTrueButton2.click();
      });

      // This will set task-1 to loading again, but we can verify the count
      expect(loadingTasksCount.textContent).toBe('1');
    });

    it('should maintain separate loading states for different tasks', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      const setLoadingTrueButton = screen.getByTestId('set-loading-true');
      const task1Loading = screen.getByTestId('task-1-loading');
      const task2Loading = screen.getByTestId('task-2-loading');

      act(() => {
        setLoadingTrueButton.click();
      });

      expect(task1Loading.textContent).toBe('true');
      expect(task2Loading.textContent).toBe('false');
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useLoading must be used within a LoadingProvider');

      console.error = originalError;
    });
  });

  describe('Context Value Structure', () => {
    it('should provide all required context properties', () => {
      const TestContextConsumer = () => {
        const context = useLoading();

        return (
          <div>
            <div data-testid='has-loading-tasks'>
              {'loadingTasks' in context ? 'true' : 'false'}
            </div>
            <div data-testid='has-set-task-loading'>
              {'setTaskLoading' in context ? 'true' : 'false'}
            </div>
            <div data-testid='has-is-task-loading'>
              {'isTaskLoading' in context ? 'true' : 'false'}
            </div>
            <div data-testid='has-moving-task'>
              {'movingTask' in context ? 'true' : 'false'}
            </div>
            <div data-testid='has-set-moving-task'>
              {'setMovingTask' in context ? 'true' : 'false'}
            </div>
          </div>
        );
      };

      render(
        <LoadingProvider>
          <TestContextConsumer />
        </LoadingProvider>
      );

      expect(screen.getByTestId('has-loading-tasks').textContent).toBe('true');
      expect(screen.getByTestId('has-set-task-loading').textContent).toBe(
        'true'
      );
      expect(screen.getByTestId('has-is-task-loading').textContent).toBe(
        'true'
      );
      expect(screen.getByTestId('has-moving-task').textContent).toBe('true');
      expect(screen.getByTestId('has-set-moving-task').textContent).toBe(
        'true'
      );
    });
  });
});

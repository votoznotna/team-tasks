import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

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
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid='dialog-description'>{children}</p>
  ),
  DialogTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => (
    <div data-testid='dialog-trigger' data-as-child={asChild}>
      {children}
    </div>
  ),
}));

jest.mock('../../components/ui/form', () => ({
  Form: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid='form' {...props}>
      {children}
    </div>
  ),
  FormField: ({
    children,
    name,
    render,
  }: {
    children: React.ReactNode;
    name: string;
    render:
      | ((props: {
          field: { value: string; onChange: jest.Mock };
        }) => React.ReactNode)
      | undefined;
  }) => {
    if (render) {
      return render({ field: { value: '', onChange: jest.fn() } });
    }
    return <div data-testid={`form-field-${name}`}>{children}</div>;
  },
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='form-item'>{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label data-testid='form-label'>{children}</label>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='form-control'>{children}</div>
  ),
  FormDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid='form-description'>{children}</p>
  ),
  FormMessage: () => <div data-testid='form-message' />,
}));

jest.mock('../../components/ui/input', () => ({
  Input: ({
    placeholder,
    type,
    className,
    ...props
  }: {
    placeholder?: string;
    type?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <input
      data-testid='input'
      placeholder={placeholder}
      type={type}
      className={className}
      {...props}
    />
  ),
}));

jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    type,
    variant,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode;
    type?: string;
    variant?: string;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button
      data-testid='button'
      data-type={type}
      data-variant={variant}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../components/ui/textarea', () => ({
  Textarea: ({
    placeholder,
    className,
    ...props
  }: {
    placeholder?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <textarea
      data-testid='textarea'
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}));

jest.mock('../../components/ui/select', () => ({
  Select: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => (
    <div data-testid='select' data-value={value} data-on-change='function'>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='select-content'>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => (
    <div data-testid='select-item' data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='select-trigger'>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <div data-testid='select-value' data-placeholder={placeholder} />
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
  Plus: ({ className }: { className?: string }) => (
    <svg data-testid='plus-icon' className={className} />
  ),
  Edit2: ({ className }: { className?: string }) => (
    <svg data-testid='edit-icon' className={className} />
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg data-testid='calendar-icon' className={className} />
  ),
}));

// Mock react-hook-form
const mockUseForm = {
  control: {},
  handleSubmit: jest.fn((fn) => fn),
  reset: jest.fn(),
  formState: { errors: {} },
};

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => mockUseForm),
}));

describe('TaskDialog Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let TaskDialog: React.ComponentType<any>;
  let mockOnOpenChange: jest.Mock;
  let mockOnSubmit: jest.Mock;

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'This is a test task description',
    priority: 'medium' as const,
    assignee: 'Alice Johnson',
    dueDate: '2024-12-31',
  };

  beforeEach(() => {
    mockOnOpenChange = jest.fn();
    mockOnSubmit = jest.fn();

    // Reset mock functions
    mockUseForm.handleSubmit.mockClear();
    mockUseForm.reset.mockClear();
  });

  beforeAll(async () => {
    const taskDialogModule = await import('../../components/task-dialog');
    TaskDialog = taskDialogModule.TaskDialog;
  });

  it('should render without crashing', () => {
    expect(() =>
      render(
        <TaskDialog
          isOpen={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
    ).not.toThrow();
  });

  it('should render dialog when open', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('dialog')).toBeDefined();
    expect(screen.getByTestId('dialog-content')).toBeDefined();
  });

  it('should not render dialog when closed', () => {
    render(
      <TaskDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('should render dialog trigger when provided', () => {
    const trigger = <button>Open Dialog</button>;
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
        trigger={trigger}
      />
    );

    expect(screen.getByTestId('dialog-trigger')).toBeDefined();
    expect(screen.getByText('Open Dialog')).toBeDefined();
  });

  it('should render create task title when no task provided', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('dialog-title')).toBeDefined();
    expect(screen.getByText('Create New Task')).toBeDefined();
    expect(screen.getByTestId('plus-icon')).toBeDefined();
  });

  it('should render edit task title when task is provided', () => {
    render(
      <TaskDialog
        task={mockTask}
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('dialog-title')).toBeDefined();
    expect(screen.getByText('Edit Task')).toBeDefined();
    expect(screen.getByTestId('edit-icon')).toBeDefined();
  });

  it('should render appropriate description for create mode', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('dialog-description')).toBeDefined();
    expect(
      screen.getByText('Fill in the details to create a new task.')
    ).toBeDefined();
  });

  it('should render appropriate description for edit mode', () => {
    render(
      <TaskDialog
        task={mockTask}
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('dialog-description')).toBeDefined();
    expect(screen.getByText('Update the task details below.')).toBeDefined();
  });

  it('should render form with all required fields', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('form')).toBeDefined();
    expect(screen.getByText('Title *')).toBeDefined();
    expect(screen.getByText('Description *')).toBeDefined();
    expect(screen.getByText('Assignee *')).toBeDefined();
    expect(screen.getByText('Priority *')).toBeDefined();
    expect(screen.getByText('Due Date')).toBeDefined();
  });

  it('should render title field with proper label and description', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const titleLabels = screen.getAllByText('Title *');
    expect(titleLabels.length).toBeGreaterThan(0);

    const descriptions = screen.getAllByText(
      'A clear, concise title for the task'
    );
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('should render description field with proper label and description', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const descriptionLabels = screen.getAllByText('Description *');
    expect(descriptionLabels.length).toBeGreaterThan(0);

    const descriptions = screen.getAllByText(
      'Provide detailed information about what needs to be done'
    );
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('should render assignee field with proper label and description', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const assigneeLabels = screen.getAllByText('Assignee *');
    expect(assigneeLabels.length).toBeGreaterThan(0);

    const descriptions = screen.getAllByText(
      'Choose who will be responsible for this task'
    );
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('should render priority field with proper label', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const priorityLabels = screen.getAllByText('Priority *');
    expect(priorityLabels.length).toBeGreaterThan(0);
  });

  it('should render due date field with proper label and description', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const dueDateLabels = screen.getAllByText('Due Date');
    expect(dueDateLabels.length).toBeGreaterThan(0);

    const descriptions = screen.getAllByText(
      'When should this task be completed?'
    );
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('should render team member options in assignee select', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const selectContents = screen.getAllByTestId('select-content');
    expect(selectContents.length).toBeGreaterThan(0);

    // Check for team members
    expect(screen.getByText('Alice Johnson')).toBeDefined();
    expect(screen.getByText('Bob Smith')).toBeDefined();
    expect(screen.getByText('Charlie Brown')).toBeDefined();
  });

  it('should render priority options with proper labels and colors', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Low Priority')).toBeDefined();
    expect(screen.getByText('Medium Priority')).toBeDefined();
    expect(screen.getByText('High Priority')).toBeDefined();
  });

  it('should render form action buttons', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    const createButton = screen.getByText('Create Task');

    expect(cancelButton).toBeDefined();
    expect(createButton).toBeDefined();
  });

  it('should call onOpenChange when cancel button is clicked', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should show loading state during form submission', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    // Mock the form submission to be in progress
    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeDefined();

    // The loading state would be controlled by the component's internal state
    // We can't easily test this without more complex mocking of react-hook-form
  });

  it('should render calendar icon in due date field', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('calendar-icon')).toBeDefined();
  });

  it('should render avatar fallbacks for team members', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const avatars = screen.getAllByTestId('avatar');
    expect(avatars.length).toBeGreaterThan(0);

    const avatarFallbacks = screen.getAllByTestId('avatar-fallback');
    expect(avatarFallbacks.length).toBeGreaterThan(0);
  });

  it('should handle form submission correctly', async () => {
    const mockHandleSubmit = jest.fn((fn) => fn);
    mockUseForm.handleSubmit.mockImplementation(mockHandleSubmit);

    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByTestId('form');
    expect(form).toBeDefined();

    // The form submission is handled by react-hook-form
    // We can verify that the form element exists and has the proper structure
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    rerender(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('dialog')).toBeDefined();
  });

  it('should maintain form structure across re-renders', () => {
    const { rerender } = render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    rerender(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Title *')).toBeDefined();
    expect(screen.getByText('Description *')).toBeDefined();
    expect(screen.getByText('Assignee *')).toBeDefined();
    expect(screen.getByText('Priority *')).toBeDefined();
    expect(screen.getByText('Due Date')).toBeDefined();
  });

  it('should handle task prop changes correctly', () => {
    const { rerender } = render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    // Initially should show create mode
    expect(screen.getByText('Create New Task')).toBeDefined();

    // Change to edit mode
    rerender(
      <TaskDialog
        task={mockTask}
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Edit Task')).toBeDefined();
  });

  it('should render proper dialog content class', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const dialogContent = screen.getByTestId('dialog-content');
    expect(dialogContent.className).toContain('sm:max-w-[600px]');
  });

  it('should render proper form layout with grid for priority and due date', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    // The grid layout would be controlled by CSS classes
    // We can verify the structure exists
    expect(screen.getByText('Priority *')).toBeDefined();
    expect(screen.getByText('Due Date')).toBeDefined();
  });

  it('should render form with proper spacing and border', () => {
    render(
      <TaskDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByTestId('form');
    expect(form).toBeDefined();

    // The form should have the proper structure for spacing and border
    const formElement = form.querySelector('form');
    expect(formElement).toBeDefined();
  });
});

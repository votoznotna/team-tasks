import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    setTheme: jest.fn(),
  })),
}));

// Mock UI components
jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    variant,
    size,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
    [key: string]: unknown;
  }) => (
    <button
      data-testid='button'
      data-variant={variant}
      data-size={size}
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
  }: {
    children: React.ReactNode;
    align?: string;
  }) => (
    <div data-testid='dropdown-content' data-align={align}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid='dropdown-item' onClick={onClick}>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sun: ({
    className,
    ...props
  }: {
    className?: string;
    [key: string]: unknown;
  }) => <svg data-testid='sun-icon' className={className || ''} {...props} />,
  Moon: ({
    className,
    ...props
  }: {
    className?: string;
    [key: string]: unknown;
  }) => <svg data-testid='moon-icon' className={className || ''} {...props} />,
}));

describe('ThemeToggle Component', () => {
  let ThemeToggle: React.ComponentType;
  let mockSetTheme: jest.Mock;

  beforeEach(() => {
    mockSetTheme = jest.fn();
    const { useTheme } = jest.requireMock('next-themes');
    useTheme.mockReturnValue({ setTheme: mockSetTheme });
  });

  beforeAll(async () => {
    const themeToggleModule = await import('../../components/theme-toggle');
    ThemeToggle = themeToggleModule.ThemeToggle;
  });

  it('should render without crashing', () => {
    expect(() => render(<ThemeToggle />)).not.toThrow();
  });

  it('should render the dropdown menu structure', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
    expect(screen.getByTestId('dropdown-trigger')).toBeDefined();
    expect(screen.getByTestId('dropdown-content')).toBeDefined();
  });

  it('should render the button trigger', () => {
    render(<ThemeToggle />);

    const button = screen.getByTestId('button');
    expect(button).toBeDefined();
    expect(button.getAttribute('data-variant')).toBe('outline');
    expect(button.getAttribute('data-size')).toBe('icon');
  });

  it('should render sun and moon icons', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('sun-icon')).toBeDefined();
    expect(screen.getByTestId('moon-icon')).toBeDefined();
  });

  it('should render theme options', () => {
    render(<ThemeToggle />);

    expect(screen.getByText('Light')).toBeDefined();
    expect(screen.getByText('Dark')).toBeDefined();
    expect(screen.getByText('System')).toBeDefined();
  });

  it('should render screen reader text', () => {
    render(<ThemeToggle />);

    const srText = screen.getByText('Toggle theme');
    expect(srText).toBeDefined();
    expect(srText.className).toContain('sr-only');
  });

  it('should call setTheme with "light" when Light option is clicked', () => {
    render(<ThemeToggle />);

    const lightOption = screen.getByText('Light');
    fireEvent.click(lightOption);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "dark" when Dark option is clicked', () => {
    render(<ThemeToggle />);

    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with "system" when System option is clicked', () => {
    render(<ThemeToggle />);

    const systemOption = screen.getByText('System');
    fireEvent.click(systemOption);

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('should apply correct CSS classes to sun icon', () => {
    render(<ThemeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    const className = sunIcon.getAttribute('class') || '';
    expect(className).toContain('h-[1.2rem]');
    expect(className).toContain('w-[1.2rem]');
    expect(className).toContain('rotate-0');
    expect(className).toContain('scale-100');
    expect(className).toContain('transition-all');
    expect(className).toContain('dark:-rotate-90');
    expect(className).toContain('dark:scale-0');
  });

  it('should apply correct CSS classes to moon icon', () => {
    render(<ThemeToggle />);

    const moonIcon = screen.getByTestId('moon-icon');
    const className = moonIcon.getAttribute('class') || '';
    expect(className).toContain('h-[1.2rem]');
    expect(className).toContain('w-[1.2rem]');
    expect(className).toContain('rotate-90');
    expect(className).toContain('scale-0');
    expect(className).toContain('transition-all');
    expect(className).toContain('dark:rotate-0');
    expect(className).toContain('dark:scale-100');
  });

  it('should set dropdown content alignment to end', () => {
    render(<ThemeToggle />);

    const dropdownContent = screen.getByTestId('dropdown-content');
    expect(dropdownContent.getAttribute('data-align')).toBe('end');
  });

  it('should set dropdown trigger asChild prop', () => {
    render(<ThemeToggle />);

    const dropdownTrigger = screen.getByTestId('dropdown-trigger');
    expect(dropdownTrigger.getAttribute('data-as-child')).toBe('true');
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(<ThemeToggle />);

    rerender(<ThemeToggle />);

    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
    expect(screen.getByTestId('button')).toBeDefined();
  });

  it('should handle multiple theme changes', () => {
    render(<ThemeToggle />);

    const lightOption = screen.getByText('Light');
    const darkOption = screen.getByText('Dark');

    fireEvent.click(lightOption);
    fireEvent.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(2);
  });

  it('should maintain icon positioning and transitions', () => {
    render(<ThemeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');

    // Check that both icons have positioning and transition classes
    const sunClassName = sunIcon.getAttribute('class') || '';
    const moonClassName = moonIcon.getAttribute('class') || '';
    expect(sunClassName).toContain('transition-all');
    expect(moonClassName).toContain('transition-all');
    expect(moonClassName).toContain('absolute');
  });
});

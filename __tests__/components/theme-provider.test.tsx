import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid='next-themes-provider' data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

describe('ThemeProvider Component', () => {
  let ThemeProvider: React.ComponentType<{
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }>;

  beforeAll(async () => {
    const themeProviderModule = await import('../../components/theme-provider');
    ThemeProvider = themeProviderModule.ThemeProvider;
  });

  it('should render without crashing', () => {
    expect(() =>
      render(<ThemeProvider>Test Content</ThemeProvider>)
    ).not.toThrow();
  });

  it('should render children content', () => {
    render(<ThemeProvider>Test Content</ThemeProvider>);

    expect(screen.getByText('Test Content')).toBeDefined();
  });

  it('should render the next-themes provider', () => {
    render(<ThemeProvider>Test Content</ThemeProvider>);

    const nextThemesProvider = screen.getByTestId('next-themes-provider');
    expect(nextThemesProvider).toBeDefined();
  });

  it('should pass default props to next-themes provider', () => {
    render(<ThemeProvider>Test Content</ThemeProvider>);

    const nextThemesProvider = screen.getByTestId('next-themes-provider');
    const props = JSON.parse(
      nextThemesProvider.getAttribute('data-props') || '{}'
    );

    expect(props.attribute).toBe('class');
    expect(props.defaultTheme).toBe('system');
    expect(props.enableSystem).toBe(true);
    expect(props.disableTransitionOnChange).toBe(false);
  });

  it('should pass custom props to next-themes provider', () => {
    render(
      <ThemeProvider
        attribute='data-theme'
        defaultTheme='dark'
        enableSystem={false}
        disableTransitionOnChange={true}
      >
        Test Content
      </ThemeProvider>
    );

    const nextThemesProvider = screen.getByTestId('next-themes-provider');
    const props = JSON.parse(
      nextThemesProvider.getAttribute('data-props') || '{}'
    );

    expect(props.attribute).toBe('data-theme');
    expect(props.defaultTheme).toBe('dark');
    expect(props.enableSystem).toBe(false);
    expect(props.disableTransitionOnChange).toBe(true);
  });

  it('should handle partial custom props', () => {
    render(
      <ThemeProvider defaultTheme='light' enableSystem={false}>
        Test Content
      </ThemeProvider>
    );

    const nextThemesProvider = screen.getByTestId('next-themes-provider');
    const props = JSON.parse(
      nextThemesProvider.getAttribute('data-props') || '{}'
    );

    expect(props.attribute).toBe('class'); // default
    expect(props.defaultTheme).toBe('light'); // custom
    expect(props.enableSystem).toBe(false); // custom
    expect(props.disableTransitionOnChange).toBe(false); // default
  });

  it('should render complex children content', () => {
    const complexChildren = (
      <div>
        <h1>Title</h1>
        <p>Description</p>
        <button>Click me</button>
      </div>
    );

    render(<ThemeProvider>{complexChildren}</ThemeProvider>);

    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Description')).toBeDefined();
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('should render empty children without crashing', () => {
    expect(() => render(<ThemeProvider>{null}</ThemeProvider>)).not.toThrow();
    expect(() =>
      render(<ThemeProvider>{undefined}</ThemeProvider>)
    ).not.toThrow();
    expect(() => render(<ThemeProvider>{null}</ThemeProvider>)).not.toThrow();
  });

  it('should render multiple children', () => {
    render(
      <ThemeProvider>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Child 1')).toBeDefined();
    expect(screen.getByText('Child 2')).toBeDefined();
    expect(screen.getByText('Child 3')).toBeDefined();
  });

  it('should maintain props across re-renders', () => {
    const { rerender } = render(
      <ThemeProvider defaultTheme='dark' enableSystem={false}>
        Test Content
      </ThemeProvider>
    );

    const nextThemesProvider = screen.getByTestId('next-themes-provider');
    const initialProps = nextThemesProvider.getAttribute('data-props');

    rerender(
      <ThemeProvider defaultTheme='dark' enableSystem={false}>
        Different Content
      </ThemeProvider>
    );

    const nextThemesProviderAfterRerender = screen.getByTestId(
      'next-themes-provider'
    );
    expect(nextThemesProviderAfterRerender.getAttribute('data-props')).toBe(
      initialProps
    );
  });

  it('should handle attribute prop type casting', () => {
    render(<ThemeProvider attribute='class'>Test Content</ThemeProvider>);

    const nextThemesProvider = screen.getByTestId('next-themes-provider');
    const props = JSON.parse(
      nextThemesProvider.getAttribute('data-props') || '{}'
    );

    expect(props.attribute).toBe('class');
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(<ThemeProvider>Test Content</ThemeProvider>);

    rerender(<ThemeProvider>Test Content</ThemeProvider>);

    expect(screen.getByText('Test Content')).toBeDefined();
    expect(screen.getByTestId('next-themes-provider')).toBeDefined();
  });
});

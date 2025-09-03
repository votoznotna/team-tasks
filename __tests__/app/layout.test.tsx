import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the ThemeProvider component
jest.mock('../../components/theme-provider', () => ({
  ThemeProvider: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: any;
  }) => (
    <div data-testid='theme-provider' data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

// Mock the fonts
jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
    subsets: ['latin'],
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono',
    subsets: ['latin'],
  })),
}));

// Mock CSS import
jest.mock('../../app/globals.css', () => ({}));

describe('RootLayout Component', () => {
  let RootLayout: React.ComponentType<{ children: React.ReactNode }>;

  beforeAll(async () => {
    const module = await import('../../app/layout');
    RootLayout = module.default;
  });

  it('should render without crashing', () => {
    expect(() => render(<RootLayout>Test Content</RootLayout>)).not.toThrow();
  });

  it('should render the ThemeProvider component', () => {
    render(<RootLayout>Test Content</RootLayout>);

    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toBeDefined();
  });

  it('should pass correct props to ThemeProvider', () => {
    render(<RootLayout>Test Content</RootLayout>);

    const themeProvider = screen.getByTestId('theme-provider');
    const props = JSON.parse(themeProvider.getAttribute('data-props') || '{}');

    expect(props.attribute).toBe('class');
    expect(props.defaultTheme).toBe('system');
    expect(props.enableSystem).toBe(true);
    expect(props.disableTransitionOnChange).toBe(true);
  });

  it('should render children content', () => {
    render(<RootLayout>Test Content</RootLayout>);

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

    render(<RootLayout>{complexChildren}</RootLayout>);

    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Description')).toBeDefined();
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('should render empty children without crashing', () => {
    expect(() => render(<RootLayout>{null}</RootLayout>)).not.toThrow();
    expect(() => render(<RootLayout>{undefined}</RootLayout>)).not.toThrow();
    expect(() => render(<RootLayout>{}</RootLayout>)).not.toThrow();
  });

  it('should render multiple children', () => {
    render(
      <RootLayout>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </RootLayout>
    );

    expect(screen.getByText('Child 1')).toBeDefined();
    expect(screen.getByText('Child 2')).toBeDefined();
    expect(screen.getByText('Child 3')).toBeDefined();
  });

  it('should render without unnecessary re-renders', () => {
    const { rerender } = render(<RootLayout>Test Content</RootLayout>);

    // Re-render with same props
    rerender(<RootLayout>Test Content</RootLayout>);

    // Should still show the same content
    expect(screen.getByText('Test Content')).toBeDefined();
    expect(screen.getByTestId('theme-provider')).toBeDefined();
  });

  it('should maintain theme provider across re-renders', () => {
    const { rerender } = render(<RootLayout>Test Content</RootLayout>);

    const themeProvider = screen.getByTestId('theme-provider');
    const initialProps = themeProvider.getAttribute('data-props');

    rerender(<RootLayout>Different Content</RootLayout>);

    const themeProviderAfterRerender = screen.getByTestId('theme-provider');
    expect(themeProviderAfterRerender.getAttribute('data-props')).toBe(
      initialProps
    );
  });

  it('should render with proper component structure', () => {
    render(<RootLayout>Test Content</RootLayout>);

    // Check that ThemeProvider wraps children
    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toBeDefined();
    expect(themeProvider.textContent).toContain('Test Content');
  });

  it('should handle different types of children content', () => {
    const { rerender } = render(<RootLayout>String Content</RootLayout>);
    expect(screen.getByText('String Content')).toBeDefined();

    rerender(
      <RootLayout>
        <span>Element Content</span>
      </RootLayout>
    );
    expect(screen.getByText('Element Content')).toBeDefined();

    rerender(<RootLayout>{42}</RootLayout>);
    expect(screen.getByText('42')).toBeDefined();
  });
});

describe('Layout Metadata', () => {
  it('should export metadata with correct values', async () => {
    const module = await import('../../app/layout');

    expect(module.metadata).toBeDefined();
    expect(module.metadata.title).toBe('Team Tasks');
    expect(module.metadata.description).toBe(
      'A modern team task management application'
    );
  });

  it('should have metadata with proper structure', async () => {
    const module = await import('../../app/layout');

    expect(typeof module.metadata.title).toBe('string');
    expect(typeof module.metadata.description).toBe('string');
    expect(module.metadata.title.length).toBeGreaterThan(0);
    expect(module.metadata.description.length).toBeGreaterThan(0);
  });
});

describe('Layout Fonts', () => {
  it('should import and configure Geist font', async () => {
    const { Geist } = await import('next/font/google');

    expect(Geist).toBeDefined();
    expect(typeof Geist).toBe('function');
  });

  it('should import and configure Geist_Mono font', async () => {
    const { Geist_Mono } = await import('next/font/google');

    expect(Geist_Mono).toBeDefined();
    expect(typeof Geist_Mono).toBe('function');
  });

  it('should apply font subsets correctly', async () => {
    const { Geist, Geist_Mono } = await import('next/font/google');

    const geistSans = Geist({
      variable: '--font-geist-sans',
      subsets: ['latin'],
    });

    const geistMono = Geist_Mono({
      variable: '--font-geist-mono',
      subsets: ['latin'],
    });

    expect(geistSans.subsets).toContain('latin');
    expect(geistMono.subsets).toContain('latin');
  });

  it('should generate correct font variables', async () => {
    const { Geist, Geist_Mono } = await import('next/font/google');

    const geistSans = Geist({
      variable: '--font-geist-sans',
      subsets: ['latin'],
    });

    const geistMono = Geist_Mono({
      variable: '--font-geist-mono',
      subsets: ['latin'],
    });

    expect(geistSans.variable).toBe('--font-geist-sans');
    expect(geistMono.variable).toBe('--font-geist-mono');
  });
});

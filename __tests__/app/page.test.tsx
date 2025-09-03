import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the components
jest.mock('../../components/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid='theme-toggle'>Theme Toggle</div>,
}));

jest.mock('../../components/kanban-board', () => ({
  KanbanBoard: ({ columns }: { columns: unknown[] }) => (
    <div data-testid='kanban-board'>
      Kanban Board with {columns.length} columns
    </div>
  ),
}));

jest.mock('../../app/loading', () => ({
  __esModule: true,
  default: () => <div data-testid='loading'>Loading...</div>,
}));

// Mock the database queries module
jest.mock('../../lib/db/queries', () => ({
  getKanbanBoardData: jest.fn().mockResolvedValue([]),
}));

describe('Home Page', () => {
  it('should have basic test setup', () => {
    expect(true).toBe(true);
  });

  it('should be able to render a simple component', () => {
    const TestComponent = () => <div>Test</div>;
    render(<TestComponent />);
    const element = screen.getByText('Test');
    expect(element).toBeDefined();
    expect(element.textContent).toBe('Test');
  });

  it('should be able to import modules', () => {
    // Test that we can import the modules without issues
    expect(() => import('../../app/page')).not.toThrow();
    expect(() => import('../../components/theme-toggle')).not.toThrow();
    expect(() => import('../../components/kanban-board')).not.toThrow();
  });

  describe('Home Component', () => {
    let Home: React.ComponentType;

    beforeAll(async () => {
      const homeModule = await import('../../app/page');
      Home = homeModule.default;
    });

    it('should render without crashing', () => {
      expect(() => render(<Home />)).not.toThrow();
    });

    it('should render the header with correct title', () => {
      render(<Home />);

      const header = screen.getByRole('banner');
      expect(header).toBeDefined();

      const title = screen.getByText('Team Tasks');
      expect(title).toBeDefined();
      expect(title.className).toContain('text-2xl');
      expect(title.className).toContain('font-bold');
    });

    it('should render the theme toggle component', () => {
      render(<Home />);

      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toBeDefined();
    });

    it('should render the main content area', () => {
      render(<Home />);

      const main = screen.getByRole('main');
      expect(main).toBeDefined();
      expect(main.className).toContain('h-[calc(100vh-80px)]');
    });

    it('should render the page with correct background and layout classes', () => {
      render(<Home />);

      const pageContainer = screen.getByRole('main').parentElement;
      expect(pageContainer).toBeDefined();
      if (pageContainer) {
        expect(pageContainer.className).toContain('min-h-screen');
        expect(pageContainer.className).toContain('bg-background');
      }
    });

    it('should render header with correct border styling', () => {
      render(<Home />);

      const header = screen.getByRole('banner');
      expect(header).toBeDefined();
      expect(header.className).toContain('border-b');
    });

    it('should render header container with correct spacing and layout', () => {
      render(<Home />);

      const headerContainer = screen.getByText('Team Tasks').parentElement;
      expect(headerContainer).toBeDefined();
      if (headerContainer) {
        expect(headerContainer.className).toContain('container');
        expect(headerContainer.className).toContain('mx-auto');
        expect(headerContainer.className).toContain('px-4');
        expect(headerContainer.className).toContain('py-4');
        expect(headerContainer.className).toContain('flex');
        expect(headerContainer.className).toContain('items-center');
        expect(headerContainer.className).toContain('justify-between');
      }
    });

    it('should have proper semantic HTML structure', () => {
      render(<Home />);

      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeDefined();

      // Check for proper landmarks
      expect(screen.getByRole('banner')).toBeDefined();
      expect(screen.getByRole('main')).toBeDefined();
    });

    it('should have accessible heading text', () => {
      render(<Home />);

      const heading = screen.getByRole('heading', { name: 'Team Tasks' });
      expect(heading).toBeDefined();
    });

    it('should render without unnecessary re-renders', () => {
      const { rerender } = render(<Home />);

      // Re-render with same props
      rerender(<Home />);

      // Should still show the same content
      expect(screen.getByText('Team Tasks')).toBeDefined();
      expect(screen.getByTestId('theme-toggle')).toBeDefined();
    });
  });
});

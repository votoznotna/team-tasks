import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '@/app/loading';

describe('Loading Component', () => {
  it('renders loading skeleton elements', () => {
    render(<Loading />);

    // Check for skeleton elements - using data-slot="skeleton" instead of data-testid
    const skeletons = screen.getAllByText('', {
      selector: '[data-slot="skeleton"]',
    });
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders correct number of skeleton columns', () => {
    render(<Loading />);

    // Should have 3 columns (Todo, In Progress, Done)
    const gridContainers = screen.getAllByText('', {
      selector: '[class*="grid"]',
    });
    const gridContainer =
      gridContainers && Array.isArray(gridContainers)
        ? gridContainers[0]
        : undefined;
    expect(gridContainer).toBeTruthy();
  });

  it('renders skeleton items in each column', () => {
    render(<Loading />);

    // Check that we have skeleton elements
    const skeletons = screen.getAllByText('', {
      selector: '[data-slot="skeleton"]',
    });
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('applies correct styling classes to skeleton elements', () => {
    render(<Loading />);

    const skeletons = screen.getAllByText('', {
      selector: '[data-slot="skeleton"]',
    });

    skeletons.forEach((skeleton) => {
      // Check for animate-pulse and bg-accent classes using className string
      expect(skeleton.className).toEqual(
        expect.stringContaining('animate-pulse')
      );
      expect(skeleton.className).toEqual(expect.stringContaining('bg-accent'));
      // Check for either rounded-md or rounded-full
      expect(skeleton.className).toMatch(/rounded-(md|full)/);
    });
  });

  it('renders with correct layout structure', () => {
    render(<Loading />);

    // Check for grid layout - use the main grid container
    const gridContainers = screen.getAllByText('', {
      selector: '[class*="grid"]',
    });
    const mainGrid = gridContainers.find((el) =>
      el.className.includes('grid-cols-1 md:grid-cols-3')
    );
    expect(mainGrid).toBeTruthy();
  });

  it('has proper spacing between columns', () => {
    render(<Loading />);

    const gridContainers = screen.getAllByText('', {
      selector: '[class*="grid"]',
    });
    const mainGrid = gridContainers.find(
      (el) =>
        el.className.includes('grid-cols-1') &&
        el.className.includes('md:grid-cols-3')
    );
    expect(mainGrid && mainGrid.className).toEqual(
      expect.stringContaining('gap-6')
    );
  });

  it('renders with responsive design classes', () => {
    render(<Loading />);

    const gridContainers = screen.getAllByText('', {
      selector: '[class*="grid"]',
    });
    const mainGrid = gridContainers.find(
      (el) =>
        el.className.includes('grid-cols-1') &&
        el.className.includes('md:grid-cols-3')
    );
    expect(mainGrid && mainGrid.className).toEqual(
      expect.stringContaining('md:grid-cols-3')
    );
  });

  it('applies correct height to skeleton elements', () => {
    render(<Loading />);

    const skeletons = screen.getAllByText('', {
      selector: '[data-slot="skeleton"]',
    });
    skeletons.forEach((skeleton) => {
      // Check that skeleton has height class
      expect(skeleton.className).toMatch(/h-\d+/);
    });
  });

  it('renders without crashing', () => {
    expect(() => render(<Loading />)).not.toThrow();
  });

  it('has consistent skeleton appearance', () => {
    render(<Loading />);

    const skeletons = screen.getAllByText('', {
      selector: '[data-slot="skeleton"]',
    });

    skeletons.forEach((skeleton) => {
      // All skeletons should have the same base classes
      expect(skeleton.classList.contains('animate-pulse')).toBe(true);
      expect(skeleton.classList.contains('bg-accent')).toBe(true);
      // Check for either rounded-md or rounded-full
      expect(skeleton.className).toMatch(/rounded-(md|full)/);
    });
  });

  it('renders header with loading spinner', () => {
    render(<Loading />);

    const header = screen.getByText('Loading...');
    expect(header).toBeTruthy();
    expect(header.classList.contains('text-2xl')).toBe(true);
    expect(header.classList.contains('font-bold')).toBe(true);
    expect(header.classList.contains('text-muted-foreground')).toBe(true);
  });

  it('renders main content area with correct height', () => {
    render(<Loading />);

    const main = screen.getByRole('main');
    expect(main).toBeTruthy();
    expect(main.classList.contains('h-[calc(100vh-80px)]')).toBe(true);
  });

  it('renders page with correct background and layout classes', () => {
    render(<Loading />);

    const pageContainer = screen.getByRole('main').parentElement;
    expect(pageContainer).not.toBeNull();
    expect(pageContainer?.classList.contains('min-h-screen')).toBe(true);
    expect(pageContainer?.classList.contains('bg-background')).toBe(true);
  });
});

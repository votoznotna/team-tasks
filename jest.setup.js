import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock CSS modules
jest.mock('*.module.css', () => ({}));
jest.mock('*.module.scss', () => ({}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame for consistent timing in tests
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

// Mock cancelAnimationFrame
global.cancelAnimationFrame = jest.fn();

// Mock HTMLFormElement.prototype.requestSubmit to prevent JSDOM errors
if (typeof HTMLFormElement !== 'undefined') {
  HTMLFormElement.prototype.requestSubmit = jest.fn();
}

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock window.scroll
Object.defineProperty(window, 'scroll', {
  writable: true,
  value: jest.fn(),
});

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Filter out common React testing warnings and expected errors
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: React does not recognize the') ||
        args[0].includes('Invalid value for prop') ||
        args[0].includes('In HTML, <html> cannot be a child of <div>') ||
        args[0].includes('You are mounting a new html component') ||
        args[0].includes('You are mounting a new body component') ||
        args[0].includes('A component suspended inside an `act` scope') ||
        args[0].includes('An update to') ||
        args[0].includes('is an async Client Component') ||
        args[0].includes(
          'Error: Not implemented: HTMLFormElement.prototype.requestSubmit'
        ) ||
        args[0].includes('Failed to update task:') ||
        args[0].includes('Failed to delete task:') ||
        args[0].includes('Failed to create task:') ||
        args[0].includes('Error updating task:') ||
        args[0].includes('Error deleting task:') ||
        args[0].includes('Error creating task:') ||
        args[0].includes('React does not recognize the') ||
        args[0].includes('Invalid value for prop') ||
        args[0].includes(
          'You are mounting a new html component when a previous one has not first unmounted'
        ) ||
        args[0].includes(
          'You are mounting a new body component when a previous one has not first unmounted'
        ) ||
        args[0].includes('In HTML, <html> cannot be a child of <div>'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Filter out common React testing warnings
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: React does not recognize the') ||
        args[0].includes('Invalid value for prop') ||
        args[0].includes('cannot be a child of <div>') ||
        args[0].includes('mounting a new html component') ||
        args[0].includes('mounting a new body component') ||
        args[0].includes('In HTML, <html> cannot be a child of <div>') ||
        args[0].includes('You are mounting a new html component') ||
        args[0].includes('You are mounting a new body component') ||
        args[0].includes('html') ||
        args[0].includes('body'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

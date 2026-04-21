/**
 * @jest-environment jsdom
 */
const { initDarkMode } = require('./dark mode');

describe('Dark Mode Toggle', () => {
  let mockElement;
  let mockBody;

  beforeEach(() => {
    // Setup manual DOM mocks
    const createClassList = (initialClasses = []) => {
      const classes = new Set(initialClasses);
      return {
        classes,
        add: jest.fn(c => classes.add(c)),
        remove: jest.fn(c => classes.delete(c)),
        contains: jest.fn(c => classes.has(c)),
        replace: jest.fn((oldC, newC) => {
          if (classes.has(oldC)) {
            classes.delete(oldC);
            classes.add(newC);
          }
        })
      };
    };

    mockElement = {
      classList: createClassList(['bx-moon']),
      onclick: null
    };

    mockBody = {
      classList: createClassList()
    };

    global.document = {
      querySelector: jest.fn(selector => {
        if (selector === '#darkmode') return mockElement;
        return null;
      }),
      body: mockBody
    };
  });

  afterEach(() => {
    delete global.document;
  });

  test('should toggle classes correctly when switching to dark mode', () => {
    initDarkMode();

    // Simulate click
    mockElement.onclick();

    expect(mockElement.classList.replace).toHaveBeenCalledWith('bx-moon', 'bx-sun');
    expect(mockElement.classList.classes.has('bx-sun')).toBe(true);
    expect(mockElement.classList.classes.has('bx-moon')).toBe(false);

    expect(mockBody.classList.add).toHaveBeenCalledWith('active');
    expect(mockBody.classList.classes.has('active')).toBe(true);
  });

  test('should toggle classes correctly when switching back to light mode', () => {
    // Set initial state to sun (dark mode active)
    mockElement.classList.classes.clear();
    mockElement.classList.classes.add('bx-sun');
    mockBody.classList.classes.add('active');

    initDarkMode();

    // Simulate click
    mockElement.onclick();

    expect(mockElement.classList.replace).toHaveBeenCalledWith('bx-sun', 'bx-moon');
    expect(mockElement.classList.classes.has('bx-moon')).toBe(true);
    expect(mockElement.classList.classes.has('bx-sun')).toBe(false);

    expect(mockBody.classList.remove).toHaveBeenCalledWith('active');
    expect(mockBody.classList.classes.has('active')).toBe(false);
  });

  test('should do nothing if darkmode element is not found', () => {
    global.document.querySelector.mockReturnValue(null);

    // Should not throw
    initDarkMode();

    expect(global.document.querySelector).toHaveBeenCalledWith('#darkmode');
  });
});

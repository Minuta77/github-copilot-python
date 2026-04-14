// Test for dark mode toggle logic

describe('DarkMode', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('sudoku_darkmode');
  });

  it('should enable dark mode', () => {
    setDarkMode(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('sudoku_darkmode')).toBe('1');
  });

  it('should disable dark mode', () => {
    setDarkMode(false);
    expect(document.documentElement.getAttribute('data-theme')).toBe(null);
    expect(localStorage.getItem('sudoku_darkmode')).toBe('0');
  });

  it('should toggle dark mode', () => {
    setDarkMode(false);
    toggleDarkMode();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    toggleDarkMode();
    expect(document.documentElement.getAttribute('data-theme')).toBe(null);
  });
});

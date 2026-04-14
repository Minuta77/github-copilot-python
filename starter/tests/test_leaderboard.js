// Test for leaderboard localStorage logic
function clearLeaderboard() {
  localStorage.removeItem('sudoku_leaderboard');
}

describe('Leaderboard', () => {
  beforeEach(() => clearLeaderboard());

  it('should add and retrieve leaderboard entries', () => {
    addLeaderboardEntry('Alice', 120, 'Easy');
    addLeaderboardEntry('Bob', 90, 'Medium');
    addLeaderboardEntry('Carol', 150, 'Hard');
    const entries = getLeaderboard();
    expect(entries.length).toBe(3);
    expect(entries[0].name).toBe('Bob'); // Fastest first
    expect(entries[1].name).toBe('Alice');
    expect(entries[2].name).toBe('Carol');
  });

  it('should keep only top 10 entries', () => {
    for (let i = 0; i < 12; i++) {
      addLeaderboardEntry('P' + i, 100 + i, 'Easy');
    }
    const entries = getLeaderboard();
    expect(entries.length).toBe(10);
  });
});

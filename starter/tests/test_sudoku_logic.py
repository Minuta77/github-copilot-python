import pytest
from sudoku_logic import create_empty_board, generate_puzzle, is_safe, SIZE

def test_create_empty_board():
    board = create_empty_board()
    assert len(board) == SIZE
    assert all(len(row) == SIZE for row in board)
    assert all(cell == 0 for row in board for cell in row)

def test_generate_puzzle():
    puzzle, solution = generate_puzzle(35)
    assert len(puzzle) == SIZE
    assert len(solution) == SIZE
    assert all(len(row) == SIZE for row in puzzle)
    assert all(len(row) == SIZE for row in solution)
    assert sum(cell != 0 for row in puzzle for cell in row) == 35

def test_is_safe():
    board = create_empty_board()
    board[0][0] = 5
    assert not is_safe(board, 0, 1, 5)
    assert is_safe(board, 0, 1, 3)

import pytest
from sudoku_logic import get_hint, create_empty_board, fill_board, deep_copy

def test_get_hint():
    # Create a solved board
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)

    # Remove a cell to create a hint scenario
    board[0][0] = 0

    # Get a hint
    hint = get_hint(board, solution)

    # Assert the hint is correct
    assert hint is not None
    row, col, value = hint
    assert row == 0
    assert col == 0
    assert value == solution[0][0]

    # Test with no hints available
    board = solution
    hint = get_hint(board, solution)
    assert hint is None
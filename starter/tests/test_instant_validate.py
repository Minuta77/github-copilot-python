
import sys
import os
import pytest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sudoku_logic import validate_board, create_empty_board, fill_board, deep_copy

def test_instant_validate_conflict_and_incorrect():
    # Create a solved board
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)

    # Introduce a user error (wrong value) and a conflict (duplicate)
    # Place a wrong value at (0,0) and duplicate a value from (0,1)
    wrong_value = (board[0][1] % 9) + 1
    board[0][0] = wrong_value
    board[0][1] = wrong_value  # Now both (0,0) and (0,1) are in conflict

    result = validate_board(board, solution)
    # Both cells should be incorrect
    assert (0,0) in result['incorrect']
    assert (0,1) in result['incorrect']
    # Both cells should be in duplicates
    assert (0,0) in result['duplicates']
    assert (0,1) in result['duplicates']
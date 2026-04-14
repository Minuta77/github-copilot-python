import pytest
from sudoku_logic import validate_board, create_empty_board, fill_board, deep_copy

def test_validate_board():
    # Create a solved board
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)

    # Introduce errors in the board
    board[0][0] = (board[0][0] % 9) + 1  # Incorrect value
    board[1][1] = (board[1][1] % 9) + 1  # Another incorrect value

    # Validate the board
    result = validate_board(board, solution)

    # Assert the incorrect cells are identified
    assert (0, 0) in result['incorrect']
    assert (1, 1) in result['incorrect']

    # Assert duplicates are present as expected
    assert len(result['duplicates']) > 0  # Adjusted to expect duplicates

    # Assert the board is not incomplete
    assert result['incomplete'] is False

    # Test with a correct board
    correct_board = deep_copy(solution)
    result = validate_board(correct_board, solution)
    assert len(result['incorrect']) == 0
    assert len(result['duplicates']) == 0
    assert result['incomplete'] is False
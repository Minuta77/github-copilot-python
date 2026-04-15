def count_solutions(board):
    """
    Zählt die Anzahl der Lösungen für das gegebene Sudoku-Board.
    Bricht nach 2 Lösungen ab (um Eindeutigkeit zu prüfen).
    """
    count = [0]

    def solve(b):
        for row in range(SIZE):
            for col in range(SIZE):
                if b[row][col] == EMPTY:
                    for num in range(1, SIZE + 1):
                        if is_safe(b, row, col, num):
                            b[row][col] = num
                            solve(b)
                            b[row][col] = EMPTY
                    return
        count[0] += 1
        if count[0] >= 2:
            return

    solve(deep_copy(board))
    return count[0]
import copy
import random

SIZE = 9
EMPTY = 0

def deep_copy(board):
    return copy.deepcopy(board)

def create_empty_board():
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]

def is_safe(board, row, col, num):
    # Check row and column
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False
    # Check 3x3 box
    start_row = row - row % 3
    start_col = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True

def fill_board(board):
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                possible = list(range(1, SIZE + 1))
                random.shuffle(possible)
                for candidate in possible:
                    if is_safe(board, row, col, candidate):
                        board[row][col] = candidate
                        if fill_board(board):
                            return True
                        board[row][col] = EMPTY
                return False
    return True

def remove_cells(board, clues):
    # Entferne Zellen nur, wenn das Puzzle eindeutig lösbar bleibt
    cells = [(r, c) for r in range(SIZE) for c in range(SIZE)]
    random.shuffle(cells)
    removed = 0
    max_remove = SIZE * SIZE - clues
    for row, col in cells:
        if removed >= max_remove:
            break
        backup = board[row][col]
        board[row][col] = EMPTY
        if count_solutions(board) == 1:
            removed += 1
        else:
            board[row][col] = backup

def generate_puzzle(clues=35):
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)
    remove_cells(board, clues)
    puzzle = deep_copy(board)
    return puzzle, solution

def get_hint(board, solution):
    """
    Find the first empty cell in the board and return its correct value from the solution.

    Args:
        board (list of list of int): The current state of the Sudoku board.
        solution (list of list of int): The solved Sudoku board.

    Returns:
        tuple: (row, col, value) of the hint cell, or None if no hints are available.
    """
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                return row, col, solution[row][col]
    return None

def validate_board(board, solution):
    """
    Validate the current board against the solution and return incorrect entries.

    Args:
        board (list of list of int): The current state of the Sudoku board.
        solution (list of list of int): The solved Sudoku board.

    Returns:
        dict: Validation results with keys:
            - "incorrect": List of incorrect cell coordinates [(row, col), ...].
            - "duplicates": List of duplicate cell coordinates [(row, col), ...].
            - "incomplete": Boolean indicating if the board is incomplete.
    """
    incorrect = []
    duplicates = set()
    incomplete = False

    # Check for incorrect entries and incomplete cells
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == 0:
                incomplete = True
            elif board[row][col] != solution[row][col]:
                incorrect.append((row, col))

    # Refactor duplicate detection logic
    def find_duplicates(values):
        seen = set()
        duplicates = set()
        for val in values:
            if val != 0:
                if val in seen:
                    duplicates.add(val)
                seen.add(val)
        return duplicates

    for i in range(SIZE):
        # Check rows
        row_duplicates = find_duplicates(board[i])
        if row_duplicates:
            duplicates.update((i, col) for col in range(SIZE) if board[i][col] in row_duplicates)

        # Check columns
        col_values = [board[row][i] for row in range(SIZE)]
        col_duplicates = find_duplicates(col_values)
        if col_duplicates:
            duplicates.update((row, i) for row in range(SIZE) if board[row][i] in col_duplicates)

    # Check subgrids
    for box_row in range(0, SIZE, 3):
        for box_col in range(0, SIZE, 3):
            subgrid = [
                board[row][col]
                for row in range(box_row, box_row + 3)
                for col in range(box_col, box_col + 3)
            ]
            subgrid_duplicates = find_duplicates(subgrid)
            if subgrid_duplicates:
                duplicates.update(
                    (row, col)
                    for row in range(box_row, box_row + 3)
                    for col in range(box_col, box_col + 3)
                    if board[row][col] in subgrid_duplicates
                )

    # Debugging: Log duplicates for rows, columns, and subgrids
    print(f"Duplicates detected: {duplicates}")
    print(f"Board state: {board}")

    # Enhanced debugging: Log detailed duplicate information
    print("Debugging duplicate detection:")
    print(f"Board state:\n{board}")
    print(f"Row duplicates: {[(i, board[i]) for i in range(SIZE) if find_duplicates(board[i])]}\n")
    for i in range(SIZE):
        col_values = [board[row][i] for row in range(SIZE)]
        if find_duplicates(col_values):
            print(f"Column {i} duplicates: {col_values}")
    for box_row in range(0, SIZE, 3):
        for box_col in range(0, SIZE, 3):
            subgrid = [
                board[row][col]
                for row in range(box_row, box_row + 3)
                for col in range(box_col, box_col + 3)
            ]
            if find_duplicates(subgrid):
                print(f"Subgrid ({box_row}, {box_col}) duplicates: {subgrid}")

    return {
        "incorrect": incorrect,
        "duplicates": list(duplicates),
        "incomplete": incomplete,
    }

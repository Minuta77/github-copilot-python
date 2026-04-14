from flask import Flask, render_template, jsonify, request
import sudoku_logic

app = Flask(__name__)

# Keep a simple in-memory store for current puzzle and solution
CURRENT = {
    'puzzle': None,
    'solution': None
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new')
def new_game():
    difficulty = request.args.get('difficulty', 'medium')
    if difficulty == 'easy':
        clues = 40
    elif difficulty == 'hard':
        clues = 24
    else:
        clues = 32
    puzzle, solution = sudoku_logic.generate_puzzle(clues)
    CURRENT['puzzle'] = puzzle
    CURRENT['solution'] = solution
    return jsonify({'puzzle': puzzle})

@app.route('/check', methods=['POST'])
def check_solution():
    data = request.json
    board = data.get('board')
    solution = CURRENT.get('solution')
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400
    incorrect = []
    for i in range(sudoku_logic.SIZE):
        for j in range(sudoku_logic.SIZE):
            if board[i][j] != solution[i][j]:
                incorrect.append([i, j])
    return jsonify({'incorrect': incorrect})

@app.route('/hint', methods=['POST'])
def hint():
    data = request.json
    board = data.get('board')
    solution = CURRENT.get('solution')
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400

    print(f"Board: {board}")
    print(f"Solution: {solution}")

    # Find a hint
    hint_cell = sudoku_logic.get_hint(board, solution)
    if hint_cell:
        row, col, value = hint_cell
        return jsonify({'row': row, 'col': col, 'value': value})
    else:
        return jsonify({'error': 'No hints available'}), 400

@app.route('/validate', methods=['POST'])
def validate():
    data = request.json
    board = data.get('board')
    solution = CURRENT.get('solution')
    if solution is None:
        return jsonify({'error': 'No game in progress'}), 400

    result = sudoku_logic.validate_board(board, solution)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

import sys
import os
import pytest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app
import json

def get_filled_cells(puzzle):
    return sum(1 for row in puzzle for cell in row if cell != 0)

@pytest.mark.parametrize("difficulty,expected_min,expected_max", [
    ("easy", 39, 41),
    ("medium", 31, 33),
    ("hard", 23, 25),
])
def test_new_game_difficulty(client, difficulty, expected_min, expected_max):
    res = client.get(f"/new?difficulty={difficulty}")
    assert res.status_code == 200
    data = res.get_json()
    puzzle = data["puzzle"]
    filled = get_filled_cells(puzzle)
    assert expected_min <= filled <= expected_max, f"{difficulty}: got {filled} clues"

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

// Copilot schlug vor, die Top-10-Liste als globale JS-Variable zu halten und bei jedem Spielstand zu aktualisieren.
// Ich habe das abgelehnt, weil localStorage persistenter und robuster ist (bleibt nach Reload erhalten).
// Die aktuelle Lösung nutzt localStorage für die Bestenliste.
// --- Dark mode toggle ---
function setDarkMode(enabled) {
  if (enabled) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sudoku_darkmode', '1');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('sudoku_darkmode', '0');
  }
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setDarkMode(!isDark);
}

function initDarkMode() {
  const saved = localStorage.getItem('sudoku_darkmode');
  if (saved === '1') setDarkMode(true);
  else setDarkMode(false);
}

// --- Leaderboard logic ---
function getLeaderboard() {
  const raw = localStorage.getItem('sudoku_leaderboard');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem('sudoku_leaderboard', JSON.stringify(entries));
}

function addLeaderboardEntry(name, timeSeconds, difficulty, hints) {
  const entries = getLeaderboard();
  entries.push({ name, time: timeSeconds, difficulty, hints });
  entries.sort((a, b) => a.time - b.time);
  if (entries.length > 10) entries.length = 10;
  saveLeaderboard(entries);
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderLeaderboard() {
  const entries = getLeaderboard();
  const tbody = document.querySelector('#leaderboard tbody');
  tbody.innerHTML = '';
  if (entries.length === 0) {
    // Beispiel-Eintrag anzeigen, wenn keine echten Einträge vorhanden sind
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="text-align:center;">1</td><td>Max Mustermann</td><td>1:23</td><td>Medium</td><td>2</td>`;
    tbody.appendChild(tr);
  } else {
    entries.forEach((entry, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td style="text-align:center;">${idx + 1}</td><td>${entry.name}</td><td>${formatTime(entry.time)}</td><td>${entry.difficulty}</td><td>${entry.hints ?? 0}</td>`;
      tbody.appendChild(tr);
    });
  }
}

// --- Hint Counter ---
let hintCount = 0;

// --- Timer logic ---
let timer = 0;
let timerInterval = null;

function startTimer() {
  timer = 0;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer-display').innerText = `Time: ${formatTime(timer)}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function getDifficultyLabel() {
  const sel = document.getElementById('difficulty');
  if (!sel) return '';
  const opt = sel.options[sel.selectedIndex];
  return opt ? opt.text : '';
}

// Sofortvalidierung: Markiere Konflikte und Fehler live beim Tippen
async function instantValidate() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }

  const res = await fetch('/validate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();

  // Remove previous feedback
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    inp.classList.remove('incorrect');
    inp.classList.remove('correct');
    inp.classList.remove('conflict');
  }

  // Mark conflict cells (including prefilled/disabled)
  const incorrect = new Set(data.incorrect.map(([row, col]) => row * SIZE + col));
  const conflict = new Set(data.duplicates.map(([row, col]) => row * SIZE + col));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    const isIncorrect = incorrect.has(idx);
    const isConflict = conflict.has(idx);
    if (isConflict) {
      inp.classList.add('conflict');
    }
    // Wenn Zelle editierbar UND sowohl Konflikt als auch falsch: beides markieren
    if (!inp.disabled) {
      if (isIncorrect) {
        inp.classList.add('incorrect');
      } else if (inputs[idx].value) {
        inp.classList.add('correct');
      }
    }
  }
}
// Client-side rendering and interaction for the Flask-backed Sudoku
const SIZE = 9;
let puzzle = [];

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      // Add alternating block color
      if (((Math.floor(i / 3) + Math.floor(j / 3)) % 2) === 1) {
        input.classList.add('alt-block');
      }
      input.dataset.row = i;
      input.dataset.col = j;
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^1-9]/g, '');
        e.target.value = val;
        instantValidate();
      });
      rowDiv.appendChild(input);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function renderPuzzle(puz) {
  puzzle = puz;
  createBoardElement();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = puzzle[i][j];
      const inp = inputs[idx];
      if (val !== 0) {
        inp.value = val;
        inp.disabled = true;
        inp.className += ' prefilled';
        if (inp.dataset.hint === 'true') {
          inp.classList.add('hint-entry');
        }
      } else {
        inp.value = '';
        inp.disabled = false;
      }
    }
  }
}

async function newGame() {
  stopTimer();
  const difficulty = document.getElementById('difficulty')?.value || 'medium';
  const res = await fetch(`/new?difficulty=${difficulty}`);
  const data = await res.json();
  renderPuzzle(data.puzzle);
  document.getElementById('message').innerText = '';
  document.getElementById('timer-display').innerText = 'Time: 0:00';
  startTimer();
}

function logStepCompletion(message) {
  const logDiv = document.getElementById('step-log');
  if (!logDiv) return; // Wenn step-log nicht existiert, nichts tun
  const logEntry = document.createElement('p');
  logEntry.innerText = message;
  logDiv.appendChild(logEntry);
}

async function checkSolution() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }

  console.log('Board sent for validation:', board);

  const res = await fetch('/validate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });

  const data = await res.json();
  console.log('Validation response:', data);

  const msg = document.getElementById('message');

  if (data.error) {
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }



  // Remove previous feedback
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    inp.classList.remove('incorrect');
    inp.classList.remove('correct');
    inp.classList.remove('conflict');
  }

  // Mark conflict cells (including prefilled/disabled)
  const incorrect = new Set(data.incorrect.map(([row, col]) => row * SIZE + col));
  const conflict = new Set(data.duplicates.map(([row, col]) => row * SIZE + col));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (conflict.has(idx)) {
      inp.classList.add('conflict');
    }
  }
  // Mark incorrect/correct only for editable cells
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (inp.disabled) continue;
    if (incorrect.has(idx)) {
      inp.classList.add('incorrect');
    } else if (inputs[idx].value) {
      inp.classList.add('correct');
    }
  }

  if (incorrect.size === 0 && !data.incomplete) {
    stopTimer();
    msg.style.color = '#388e3c';
    msg.innerText = 'Congratulations! You solved it!';
    logStepCompletion('Schritt 2: Validierung erfolgreich abgeschlossen.');
    console.log('==> Prompt wird jetzt angezeigt!');
    setTimeout(() => {
      let name = '';
      while (!name || !name.trim()) {
        name = prompt('Bitte gib deinen Namen für das Leaderboard ein:','');
        if (name === null) { name = 'Anonym'; break; }
      }
      addLeaderboardEntry(name.trim(), timer, getDifficultyLabel(), hintCount);
      renderLeaderboard();
    }, 300);
  } else if (data.incomplete) {
    msg.style.color = '#d32f2f';
    msg.innerText = 'The board is not complete.';
  } else {
    msg.style.color = '#d32f2f';
    msg.innerText = 'Some cells are incorrect.';
  }
}

async function getHint() {
  hintCount++;
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }

  console.log('Board sent for hint:', board);

  const res = await fetch('/hint', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });

  const data = await res.json();
  console.log('Hint response:', data);

  if (data.error) {
    document.getElementById('message').innerText = data.error;
    return;
  }

  const { row, col, value } = data;
  const idx = row * SIZE + col;
  const hintCell = inputs[idx];
  hintCell.value = value;
  hintCell.disabled = true;
  hintCell.classList.add('hint-entry'); // Apply hint-entry class
}

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  document.getElementById('darkmode-toggle').addEventListener('click', toggleDarkMode);
  document.getElementById('new-game').addEventListener('click', () => {
    hintCount = 0;
    newGame();
  });
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('hint-button').addEventListener('click', getHint);
  renderLeaderboard();
  // Timer-Anzeige einfügen
  const timerDiv = document.createElement('div');
  timerDiv.id = 'timer-display';
  timerDiv.style.margin = '18px 0 0 0';
  timerDiv.style.fontSize = '1.1em';
  timerDiv.style.fontWeight = '500';
  timerDiv.innerText = 'Time: 0:00';
  const boardParent = document.getElementById('sudoku-board').parentElement;
  boardParent.appendChild(timerDiv);
  // Start a new game on page load
  newGame();
});
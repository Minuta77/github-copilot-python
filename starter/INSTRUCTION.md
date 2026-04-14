# Copilot Instruction File

## Ziel und Kontext
Dieses Projekt ist eine Sudoku-Webanwendung mit Python (Flask) Backend und Vanilla JS/CSS Frontend. Die Anwendung soll modern, responsiv und barrierearm sein. Die Sudoku-Logik muss eindeutig lösbare Rätsel generieren, verschiedene Schwierigkeitsgrade bieten und eine Top-10-Bestenliste lokal speichern.

## Copilot-Anweisungen

- **Code-Stil:**
  - Verwende ES6+ Features (const, let, Arrow Functions, async/await).
  - Schreibe modulare, wiederverwendbare Funktionen.
  - Kommentiere komplexe Logik und wichtige Abschnitte.
  - Halte die Fehlerbehandlung konsistent und nutze try/catch bei async-Operationen.

- **Frontend (JS/CSS/HTML):**
  - Nutze Flexbox oder CSS Grid für Layouts.
  - Die 3x3-Sudoku-Blöcke sollen sich farblich abheben.
  - Buttons und Texte müssen in Light- und Dark-Mode gut lesbar sein.
  - Die App muss auf Desktop und Mobile sauber funktionieren (responsive).
  - Die Top-10-Liste wird mit localStorage gespeichert und angezeigt.
  - Der Dark-Mode-Toggle ist immer sichtbar (oben rechts).

- **Backend (Python/Flask):**
  - Trenne Sudoku-Logik (sudoku_logic.py) und API (app.py).
  - Schreibe Funktionen für Puzzle-Generierung, Validierung, Hint.
  - Stelle sicher, dass jedes generierte Rätsel nur eine Lösung hat.
  - Nutze type hints und docstrings für alle Funktionen.

- **Testing:**
  - Schreibe Unit-Tests für die Sudoku-Logik.
  - Teste insbesondere die Eindeutigkeit der Lösung und die Hint-Funktion.

- **Copilot-Nutzung:**
  - Vorschläge kritisch prüfen, ggf. anpassen oder verwerfen.
  - Dokumentiere abgelehnte Vorschläge per Kommentar oder Screenshot.

## Beispiel-Prompts
- "Erstelle eine Funktion, die ein Sudoku-Rätsel mit eindeutiger Lösung generiert."
- "Füge einen Dark-Mode-Toggle hinzu, der das Farbschema der Seite umschaltet."
- "Implementiere eine Top-10-Bestenliste mit localStorage."

## Hinweise
- Halte dich an die Projektbewertungskriterien.
- Schreibe sauberen, wartbaren und gut dokumentierten Code.
- Achte auf Barrierefreiheit und Usability.

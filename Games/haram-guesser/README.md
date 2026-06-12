# Haram or Not? — Word Guessing Game

A terminal-based two-player word guessing game. One player (or the computer) secretly picks a haram word. The other player asks yes/no questions to figure it out.

## Requirements

- [Node.js](https://nodejs.org/) v14 or higher

## Setup & Run

```bash
cd haram-guesser
npm install
npm start
```

Or directly:

```bash
node index.js
```

## How to Play

1. Choose **Player vs Computer** from the menu.
2. Pick your secret word from the displayed list.
3. The computer picks its own secret word.
4. **You go first.** Each turn, either:
   - Type a **yes/no question** about the computer's word (free text).
   - Type `guess: <word>` to guess the computer's word outright.
5. The computer asks questions about your word. Answer: `yes`, `no`, or `sometimes`.
6. Every 3 questions the computer may attempt a guess.
7. **First to correctly guess the other's word wins.**

## Word Categories

| Category | Words |
|---|---|
| Food & Drink | pork, alcohol, drugs, blood, carrion, donkey meat |
| Financial | riba, gambling, bribery, fraud, stealing |
| Speech | lying, backbiting, slander, arrogance |
| Worship | shirk, black magic, astrology, fortune telling |
| Entertainment | pornography, animal fighting |
| Body | tattoos, silk (for men), gold (for men) |

## Folder Structure

```
haram-guesser/
├── index.js      ← Entry point / game loop
├── words.js      ← Word list with property tags
├── qa-engine.js  ← Rule-based yes/no/sometimes answering engine
├── computer.js   ← Computer AI logic (question bank + word elimination)
├── package.json
└── README.md
```

## Notes

- No API key or internet connection required — all logic is fully hardcoded.
- Player vs Player mode is coming soon.

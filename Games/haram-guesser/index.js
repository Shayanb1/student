const rl = require('readline-sync');
const { WORDS, WORD_LIST } = require('./words');
const { answerQuestion } = require('./qa-engine');
const { Computer } = require('./computer');

// ─── Styling helpers ───────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  magenta:'\x1b[35m',
  gray:   '\x1b[90m',
};
const b  = (s) => `${C.bold}${s}${C.reset}`;
const g  = (s) => `${C.green}${s}${C.reset}`;
const r  = (s) => `${C.red}${s}${C.reset}`;
const y  = (s) => `${C.yellow}${s}${C.reset}`;
const cy = (s) => `${C.cyan}${s}${C.reset}`;
const m  = (s) => `${C.magenta}${s}${C.reset}`;
const gr = (s) => `${C.gray}${s}${C.reset}`;

function banner() {
  console.clear();
  console.log(b(y(`
╔══════════════════════════════════════════════════════════╗
║          🕌  HARAM OR NOT?  — Word Guessing Game  🕌      ║
╚══════════════════════════════════════════════════════════╝
`)));
}

function printWordList() {
  console.log(b('\nAvailable words to choose from:'));
  const categories = {};
  for (const [word, props] of Object.entries(WORDS)) {
    if (!categories[props.category]) categories[props.category] = [];
    categories[props.category].push(word);
  }
  for (const [cat, words] of Object.entries(categories)) {
    console.log(`  ${cy(cat.toUpperCase())}: ${words.join(', ')}`);
  }
  console.log();
}

function printLog(log) {
  console.log(b(gr('\n──── Game Log ────────────────────────────────────────────')));
  if (log.length === 0) {
    console.log(gr('  (no questions asked yet)'));
  }
  for (const entry of log) {
    const who = entry.who === 'Player' ? cy('YOU') : m('CPU');
    if (entry.type === 'question') {
      console.log(`  ${who} asked: ${entry.question}`);
      console.log(`       ${b('Answer:')} ${g(entry.answer)}`);
    } else {
      console.log(`  ${who} guessed: ${b(entry.guess)}`);
    }
  }
  console.log(b(gr('─────────────────────────────────────────────────────────\n')));
}

function separator() {
  console.log(gr('─────────────────────────────────────────────────────────'));
}

// ─── Main menu ─────────────────────────────────────────────────────────────────
function mainMenu() {
  banner();
  console.log(b('  Choose a game mode:\n'));
  console.log(`  ${g('[1]')} Player vs Computer`);
  console.log(`  ${gr('[2]')} Player vs Player (Coming Soon)`);
  console.log(`  ${r('[3]')} Quit\n`);

  const choice = rl.question('  Enter choice: ').trim();

  if (choice === '1') {
    playVsComputer();
  } else if (choice === '2') {
    console.log(y('\n  Player vs Player is coming soon! Check back later.\n'));
    rl.question('  Press Enter to return to menu...');
    mainMenu();
  } else if (choice === '3') {
    console.log(b('\n  Ma\'a salama! Goodbye! 👋\n'));
    process.exit(0);
  } else {
    console.log(r('\n  Invalid choice.'));
    rl.question('  Press Enter to try again...');
    mainMenu();
  }
}

// ─── Player vs Computer ────────────────────────────────────────────────────────
function playVsComputer() {
  banner();
  printWordList();

  // Player picks secret word
  let playerWord = '';
  while (true) {
    playerWord = rl.question(b('  Type YOUR secret word from the list above: ')).trim().toLowerCase();
    if (WORDS[playerWord]) break;
    console.log(r('  That word is not on the list. Try again.'));
  }
  console.log(g(`\n  Got it! Your secret word is locked in.\n`));

  // Computer picks secret word
  const cpu = new Computer();
  const cpuWord = cpu.pickSecretWord();

  const log = [];
  let turn = 'player'; // player goes first
  let round = 1;

  console.log(b(cy('  Game starts! You go first.\n')));
  console.log(gr('  HOW TO PLAY:'));
  console.log(gr('    - Type a yes/no question about the computer\'s word'));
  console.log(gr('    - Or type  guess: <word>  to guess the computer\'s word\n'));

  while (true) {
    separator();

    if (turn === 'player') {
      console.log(b(`\n  ${cy('YOUR TURN')} (Round ${round})`));
      printLog(log);

      const input = rl.question('  Your question or guess: ').trim();
      if (!input) continue;

      if (input.toLowerCase().startsWith('guess:')) {
        const guessed = input.slice(6).trim().toLowerCase();
        log.push({ who: 'Player', type: 'guess', guess: guessed });

        if (guessed === cpuWord) {
          endGame(true, cpuWord, playerWord, log, round);
          return;
        } else {
          console.log(r(`\n  Wrong! The computer's word was NOT "${guessed}". Keep trying!\n`));
          rl.question('  Press Enter to continue...');
        }
      } else {
        // It's a question
        const answer = answerQuestion(input, cpuWord);
        log.push({ who: 'Player', type: 'question', question: input, answer });
        console.log(g(`\n  Answer: ${b(answer)}\n`));
        rl.question('  Press Enter to continue...');
      }

      turn = 'computer';
    } else {
      // Computer's turn
      console.log(b(`\n  ${m('COMPUTER\'S TURN')} (Round ${round})`));
      printLog(log);

      rl.question('  Press Enter to see what the computer does...');

      const action = cpu.takeTurn();

      if (action.type === 'question') {
        console.log(m(`\n  Computer asks: "${b(action.question)}"`));
        let humanAns = '';
        while (!['yes','no','sometimes'].some(v => humanAns.toLowerCase().startsWith(v[0]))) {
          humanAns = rl.question('  Your answer (yes / no / sometimes): ').trim();
        }
        cpu.applyAnswer(action.question, humanAns);
        log.push({ who: 'CPU', type: 'question', question: action.question, answer: humanAns });
        console.log(g(`  Computer noted: ${humanAns}\n`));
        rl.question('  Press Enter to continue...');
      } else {
        // Computer guesses
        const guess = action.content;
        log.push({ who: 'CPU', type: 'guess', guess });
        console.log(m(`\n  Computer guesses: ${b(guess.toUpperCase())}`));

        if (guess === playerWord) {
          endGame(false, cpuWord, playerWord, log, round);
          return;
        } else {
          console.log(r(`\n  The computer guessed wrong!\n`));
          rl.question('  Press Enter to continue...');
        }
      }

      turn = 'player';
      round++;
    }
  }
}

// ─── End screen ────────────────────────────────────────────────────────────────
function endGame(playerWon, cpuWord, playerWord, log, rounds) {
  banner();
  printLog(log);

  if (playerWon) {
    console.log(b(g(`
  ╔══════════════════════════════════════╗
  ║     🎉  YOU WIN! Mashallah!  🎉      ║
  ╚══════════════════════════════════════╝
`)));
  } else {
    console.log(b(r(`
  ╔══════════════════════════════════════╗
  ║     😔  COMPUTER WINS!  Astaghfirullah  ║
  ╚══════════════════════════════════════╝
`)));
  }

  console.log(`  ${b('Reveal:')}`);
  console.log(`    Your word was:      ${b(cy(playerWord.toUpperCase()))}`);
  console.log(`    Computer's word was: ${b(m(cpuWord.toUpperCase()))}`);
  console.log(`    Rounds played:       ${rounds}\n`);

  const again = rl.question('  Play again? (y/n): ').trim().toLowerCase();
  if (again.startsWith('y')) {
    mainMenu();
  } else {
    console.log(b('\n  Ma\'a salama! Goodbye! 👋\n'));
    process.exit(0);
  }
}

// ─── Entry point ───────────────────────────────────────────────────────────────
mainMenu();

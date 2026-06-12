const { WORDS, WORD_LIST } = require('./words');

// Strategic question bank the computer uses
const QUESTION_BANK = [
  { question: "Is your word related to food or drink?",        filter: (w) => WORDS[w].isFood || WORDS[w].isDrink || WORDS[w].isConsumed },
  { question: "Is your word a physical object you can hold?",  filter: (w) => WORDS[w].isPhysicalObject },
  { question: "Is your word an action or behavior?",           filter: (w) => WORDS[w].isAction },
  { question: "Is your word related to financial matters?",    filter: (w) => WORDS[w].isFinancial },
  { question: "Is your word related to speech or talking?",    filter: (w) => WORDS[w].isSpeech },
  { question: "Is your word related to worship or aqeedah?",   filter: (w) => WORDS[w].isWorship },
  { question: "Is your word related to entertainment?",        filter: (w) => WORDS[w].isEntertainment },
  { question: "Is your word related to the body or appearance?", filter: (w) => WORDS[w].isBodyRelated },
  { question: "Does your word involve an animal?",             filter: (w) => WORDS[w].isAnimal },
  { question: "Is your word an intoxicant?",                   filter: (w) => WORDS[w].isIntoxicant },
  { question: "Is your word abstract (not a physical thing)?", filter: (w) => WORDS[w].isAbstract },
  { question: "Is your word related to deception or dishonesty?", filter: (w) => ['lying', 'fraud', 'slander', 'bribery'].includes(w) },
  { question: "Is your word related to the supernatural or occult?", filter: (w) => ['black magic', 'fortune telling', 'astrology', 'shirk'].includes(w) },
  { question: "Is your word haram specifically for men?",      filter: (w) => ['silk', 'gold'].includes(w) },
  { question: "Is your word a type of meat?",                  filter: (w) => ['pork', 'donkey meat', 'carrion'].includes(w) },
  { question: "Is your word related to money transactions?",   filter: (w) => ['riba', 'gambling', 'bribery', 'fraud', 'stealing'].includes(w) },
  { question: "Is your word related to predicting the future?", filter: (w) => ['astrology', 'fortune telling'].includes(w) },
  { question: "Does your word involve harming others?",        filter: (w) => ['animal fighting', 'stealing', 'bribery', 'slander'].includes(w) },
];

class Computer {
  constructor() {
    this.secretWord = null;
    this.remainingWords = [...WORD_LIST];
    this.questionIndex = 0;
    this.questionsSinceGuess = 0;
    this.askedQuestions = new Set();
    this.answers = {}; // question text -> 'yes'|'no'|'sometimes'
  }

  pickSecretWord() {
    const idx = Math.floor(Math.random() * WORD_LIST.length);
    this.secretWord = WORD_LIST[idx];
    return this.secretWord;
  }

  // Returns the computer's action for its turn: { type: 'question'|'guess', content }
  takeTurn() {
    this.questionsSinceGuess++;

    // Every 3 questions, try a guess if we've narrowed down enough
    if (this.questionsSinceGuess >= 3 && this.remainingWords.length <= 3) {
      this.questionsSinceGuess = 0;
      const guess = this.remainingWords[Math.floor(Math.random() * this.remainingWords.length)];
      return { type: 'guess', content: guess };
    }

    // Pick the next unasked question that would eliminate the most words
    const best = this._pickBestQuestion();
    if (best) {
      this.askedQuestions.add(best.question);
      return { type: 'question', content: best.question };
    }

    // All questions exhausted — just guess
    this.questionsSinceGuess = 0;
    const guess = this.remainingWords[Math.floor(Math.random() * this.remainingWords.length)];
    return { type: 'guess', content: guess };
  }

  _pickBestQuestion() {
    let bestQ = null;
    let bestScore = -1;

    for (const entry of QUESTION_BANK) {
      if (this.askedQuestions.has(entry.question)) continue;

      const yesCount = this.remainingWords.filter(entry.filter).length;
      const noCount = this.remainingWords.length - yesCount;
      // Pick question that splits remaining words most evenly
      const score = Math.min(yesCount, noCount);
      if (score > bestScore) {
        bestScore = score;
        bestQ = entry;
      }
    }
    return bestQ;
  }

  // Called after computer asks a question and human answers
  applyAnswer(question, answer) {
    this.answers[question] = answer.toLowerCase();
    const entry = QUESTION_BANK.find(e => e.question === question);
    if (!entry) return;

    const isYes = answer.toLowerCase().startsWith('y');
    const isNo = answer.toLowerCase().startsWith('n');

    if (isYes) {
      this.remainingWords = this.remainingWords.filter(entry.filter);
    } else if (isNo) {
      this.remainingWords = this.remainingWords.filter(w => !entry.filter(w));
    }
    // 'sometimes' — keep all remaining
  }

  // Check if the human's answer to the computer's question is correct
  checkAnswer(question, humanAnswer) {
    const { answerQuestion } = require('./qa-engine');
    const correct = answerQuestion(question, this.secretWord).toLowerCase();
    const given = humanAnswer.toLowerCase();
    return given.startsWith(correct[0]); // match first letter (y/n/s)
  }
}

module.exports = { Computer };

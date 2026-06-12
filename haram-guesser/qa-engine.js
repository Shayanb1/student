const { WORDS } = require('./words');

// Rule-based Q&A engine — no API required
function answerQuestion(question, word) {
  const props = WORDS[word];
  if (!props) return "I don't know that word.";

  const q = question.toLowerCase().trim();

  // ── Category questions ──
  if (matches(q, ['food', 'eat', 'drink', 'consume', 'swallow', 'ingest'])) {
    if (props.isFood || props.isDrink || props.isConsumed) return "Yes";
    return "No";
  }
  if (matches(q, ['eat', 'edible', 'can you eat', 'something you eat'])) {
    return props.isFood ? "Yes" : "No";
  }
  if (matches(q, ['drink', 'liquid', 'beverage', 'something you drink'])) {
    return props.isDrink ? "Yes" : "No";
  }
  if (matches(q, ['financial', 'money', 'economic', 'wealth', 'transaction', 'bank'])) {
    return props.isFinancial ? "Yes" : "No";
  }
  if (matches(q, ['speech', 'word', 'say', 'talk', 'verbal', 'tongue', 'mouth', 'speak'])) {
    return props.isSpeech ? "Yes" : "No";
  }
  if (matches(q, ['worship', 'religion', 'shirk', 'aqeedah', 'belief', 'faith', 'spiritual'])) {
    return props.isWorship ? "Yes" : "No";
  }
  if (matches(q, ['entertainment', 'fun', 'leisure', 'game', 'play', 'amusement'])) {
    return props.isEntertainment ? "Yes" : "No";
  }
  if (matches(q, ['body', 'skin', 'physical appearance', 'worn', 'wear', 'clothes', 'clothing', 'dress', 'fabric', 'material'])) {
    return props.isBodyRelated ? "Yes" : "No";
  }

  // ── Substance / object ──
  if (matches(q, ['substance', 'material', 'thing', 'physical object', 'tangible', 'hold'])) {
    return props.isPhysicalObject ? "Yes" : "No";
  }
  if (matches(q, ['action', 'act', 'doing', 'behavior', 'activity', 'practice', 'deed'])) {
    return props.isAction ? "Yes" : "No";
  }
  if (matches(q, ['abstract', 'concept', 'idea', 'invisible', 'intangible', 'not physical'])) {
    return props.isAbstract ? "Yes" : "No";
  }

  // ── Animal ──
  if (matches(q, ['animal', 'creature', 'beast', 'living', 'zoo', 'pet'])) {
    return props.isAnimal ? "Yes" : "No";
  }

  // ── Intoxicant ──
  if (matches(q, ['intoxicant', 'intoxicating', 'mind-altering', 'high', 'drunk', 'alter your mind', 'addictive'])) {
    return props.isIntoxicant ? "Yes" : "No";
  }

  // ── Specific category checks ──
  if (matches(q, ['food category', 'food and drink', 'category is food'])) {
    return props.category === 'food' ? "Yes" : "No";
  }
  if (matches(q, ['financial category', 'category is financial'])) {
    return props.category === 'financial' ? "Yes" : "No";
  }
  if (matches(q, ['speech category', 'category is speech'])) {
    return props.category === 'speech' ? "Yes" : "No";
  }
  if (matches(q, ['worship category', 'category is worship'])) {
    return props.category === 'worship' ? "Yes" : "No";
  }
  if (matches(q, ['entertainment category', 'category is entertainment'])) {
    return props.category === 'entertainment' ? "Yes" : "No";
  }
  if (matches(q, ['body category', 'category is body', 'appearance category'])) {
    return props.category === 'body' ? "Yes" : "No";
  }

  // ── Specific property edge cases ──
  if (matches(q, ['men', 'man', 'male', 'only for men', 'haram for men'])) {
    if (['silk', 'gold'].includes(word)) return "Yes";
    return "Sometimes";
  }
  if (matches(q, ['supernatural', 'occult', 'magic', 'spell', 'jinns', 'jinn'])) {
    if (['black magic', 'fortune telling'].includes(word)) return "Yes";
    if (word === 'shirk') return "Sometimes";
    return "No";
  }
  if (matches(q, ['deception', 'deceive', 'trick', 'lie', 'false', 'dishonest'])) {
    if (['lying', 'fraud', 'slander'].includes(word)) return "Yes";
    if (word === 'bribery') return "Sometimes";
    return "No";
  }
  if (matches(q, ['pride', 'ego', 'attitude', 'personality', 'character', 'trait', 'virtue', 'sin of heart'])) {
    return word === 'arrogance' ? "Yes" : "No";
  }
  if (matches(q, ['star', 'planet', 'zodiac', 'horoscope', 'celestial', 'sky', 'cosmos'])) {
    return word === 'astrology' ? "Yes" : "No";
  }
  if (matches(q, ['future', 'predict', 'prophecy', 'divination', 'psychic'])) {
    if (['fortune telling', 'astrology'].includes(word)) return "Yes";
    return "No";
  }
  if (matches(q, ['meat', 'flesh', 'slaughter'])) {
    if (['pork', 'donkey meat', 'carrion'].includes(word)) return "Yes";
    return "No";
  }
  if (matches(q, ['pig', 'swine', 'pork'])) {
    return word === 'pork' ? "Yes" : "No";
  }
  if (matches(q, ['interest', 'usury', 'loan', 'lending', 'riba'])) {
    return word === 'riba' ? "Yes" : "No";
  }
  if (matches(q, ['jewelry', 'jewel', 'ornament', 'accessory', 'ring', 'necklace', 'bracelet'])) {
    return word === 'gold' ? "Yes" : "No";
  }
  if (matches(q, ['ink', 'tattoo', 'mark on skin', 'permanent mark', 'body art'])) {
    return word === 'tattoos' ? "Yes" : "No";
  }
  if (matches(q, ['sex', 'explicit', 'nude', 'naked', 'lust', 'sexual'])) {
    return word === 'pornography' ? "Yes" : "No";
  }
  if (matches(q, ['violence', 'violent', 'harm', 'hurt', 'fight', 'combat', 'cruelty'])) {
    if (word === 'animal fighting') return "Yes";
    if (['stealing', 'bribery'].includes(word)) return "Sometimes";
    return "No";
  }
  if (matches(q, ['theft', 'steal', 'rob', 'take without permission'])) {
    return word === 'stealing' ? "Yes" : "No";
  }

  // ── Fallback by category ──
  return `Sometimes`;
}

function matches(question, keywords) {
  return keywords.some(kw => question.includes(kw));
}

module.exports = { answerQuestion };

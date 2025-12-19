// slopSniffer.js

/**
 * Detects LinkedIn-style AI slop using multiple heuristics
 */

const SlopSniffer = (() => {
  // Split on sentence-ending punctuation + optional whitespace + capital letter, or newlines
  const SENTENCE_SPLIT_REGEX = /(?<=[.:!?•…])\s*(?=[A-Z"'])|\n+/;
  
  const emDash = '\u2014';

  // Other dash-like characters (excluding em dash)
  const otherDashes = [
    '\u002D', // hyphen-minus
    '\u2010', // hyphen
    '\u2011', // non-breaking hyphen
    '\u2012', // figure dash
    '\u2013', // en dash
    '\u2015', // horizontal bar
    '\u2212'  // minus sign
  ];

  const dashRegex = new RegExp(`(\\s[${otherDashes.join('')}](?=\\s)|${emDash})`);

  // Apostrophe can be straight or curly
  const apostrophe = "['\u2019]";

  const negations = [
    `\\bit${apostrophe}s not\\b`,
    `\\cannot\\b`,
    `\\bcan${apostrophe}t\\b`,
    `\\bwon${apostrophe}t\\b`,
    //`\\bdon${apostrophe}t\\b`,
    `\\bdoesn${apostrophe}t\\b`,
    `\\bdidn${apostrophe}t\\b`,
    `\\bhasn${apostrophe}t\\b`,
    `\\bhaven${apostrophe}t\\b`,
    `\\bhadn${apostrophe}t\\b`,
    `\\baren${apostrophe}t\\b`,
    `\\bisn${apostrophe}t\\b`,
    `\\bwasn${apostrophe}t\\b`,
    `\\bweren${apostrophe}t\\b`,
    `\\bshouldn${apostrophe}t\\b`,
    `\\bcouldn${apostrophe}t\\b`,
    `\\bwouldn${apostrophe}t\\b`,
    `\\bmustn${apostrophe}t\\b`,
    `\\bneedn${apostrophe}t\\b`,
    `\\bain${apostrophe}t\\b`
  ];

  const negationRegex = new RegExp(negations.join('|'), 'i');

  function splitSentences(text) {
    // Basic sentence splitter
    return text.trim().split(SENTENCE_SPLIT_REGEX);
  }
  
  // Heuristic 1: Contrast Framing w/ Dash
  function sniffContrastFramingInline(text) {
    if (!dashRegex.test(text)) return { detected: false };
    
    const sentences = splitSentences(text);
    const offenders = sentences.filter((sentence) => dashRegex.test(sentence))
      .map((sentence) => sentence.split(dashRegex)[0].trim());

    const isDetected = offenders.some((s) => negationRegex.test(s));
    
    return {
      detected: isDetected,
      reason: isDetected ? "Contrast Framing (Inline)" : null,
      heuristic: "contrast_framing_inline"
    };
  }
  
  // Heuristic 2: Contast Framing across sentences
  function sniffContrastFramingSequential(text) {
      const sentences = text
        .trim()
        .split(SENTENCE_SPLIT_REGEX)
        .map(s => s.trim())
        .map(s => s.replace(/["\u201C\u201D]/g, '')) // Strip only double quotes (straight and curly), keep apostrophes
        .filter(Boolean);

      // Helper that handles both straight and curly apostrophes
      const startsWithPhrase = (sentence, phrase) => {
        // Replace apostrophes in the phrase with a regex that matches both types
        const escapedPhrase = phrase.replace(/'/g, "['\u2019]");
        return new RegExp(`^${escapedPhrase}`, 'i').test(sentence);
      };

      for (let i = 0; i < sentences.length - 1; i++) {
        const first = sentences[i];
        const second = sentences[i + 1];

        // Pattern 1: "Not because " -> "Because "
        if (startsWithPhrase(first, 'Not because ') && startsWithPhrase(second, 'Because ')) {
          return {
            detected: true,
            reason: "Contrast Framing (Sequential)",
            heuristic: "contrast_framing_sequential"
          };
        }
        
        // Pattern 1b: "Not because " -> "But because "
        if (startsWithPhrase(first, 'Not because ') && startsWithPhrase(second, 'But because ')) {
          return {
            detected: true,
            reason: "Contrast Framing (Sequential)",
            heuristic: "contrast_framing_sequential"
          };
        }

        // Pattern 2: "Sometimes " + contains negation -> "It's"
        if (
          startsWithPhrase(first, 'Sometimes ') &&
          negationRegex.test(first) &&
          startsWithPhrase(second, "It's")
        ) {
          return {
            detected: true,
            reason: "Contrast Framing (Sequential)",
            heuristic: "contrast_framing_sequential"
          };
        }

        // Pattern 3: "This isn't" -> "It's"
        if (startsWithPhrase(first, "This isn't") && startsWithPhrase(second, "It's")) {
          return {
            detected: true,
            reason: "Contrast Framing (Sequential)",
            heuristic: "contrast_framing_sequential"
          };
        }

        // Pattern 4: Any sentence with negation -> "It's"
        // Catches: "The hard part isn't X. It's Y."
        if (negationRegex.test(first) && startsWithPhrase(second, "It's")) {
          return {
            detected: true,
            reason: "Contrast Framing (Sequential)",
            heuristic: "contrast_framing_sequential"
          };
        }

        // Pattern 5: Any sentence with negation -> "It was"
        // Catches: "The code wasn't X. It was Y."
        if (negationRegex.test(first) && startsWithPhrase(second, "It was")) {
          return {
            detected: true,
            reason: "Contrast Framing (Sequential)",
            heuristic: "contrast_framing_sequential"
          };
        }
      }

      return { detected: false };
    }

  
  // Heuristic 3: Negative Tricolon
  function sniffNegativeTricolon(text) {
      const negationCount = (text.match(/\b(?:No|Not)\b/gi) || []).length;
      if (negationCount < 2) {
        return { detected: false };
      }

      const sentences = text
        .trim()
        .split(SENTENCE_SPLIT_REGEX)
        .map(s => s.trim())
        .filter(Boolean);

      // Helper to check start word or phrase, requiring space after
      const startsWithWord = (sentence, word) =>
        new RegExp(`^${word}`, 'i').test(sentence);

      for (let i = 0; i <= sentences.length - 3; i++) {
        const first = sentences[i];
        const second = sentences[i + 1];
        const third = sentences[i + 2];

        // Existing check for three successive sentences beginning with "No" or "Not", or two and then "Just"
        let negWord = null;
        if (startsWithWord(first, 'No ') && startsWithWord(second, 'No ')) {
          negWord = 'No ';
        } else if (startsWithWord(first, 'Not ') && startsWithWord(second, 'Not ')) {
          negWord = 'Not ';
        }

        if (negWord) {
          if (startsWithWord(third, negWord)) {
            return {
              detected: true,
              reason: "Negative Tricolon",
              heuristic: "negative_tricolon"
            };
          }
          if (startsWithWord(third, 'Just ')) {
            return {
              detected: true,
              reason: "Negative Tricolon",
              heuristic: "negative_tricolon"
            };
          }
          continue;
        }

        // Two sentences starting with "Not for " and the third with "For "
        if (
          startsWithWord(first, 'Not for ') &&
          startsWithWord(second, 'Not for ') &&
          startsWithWord(third, 'For ')
        ) {
          return {
            detected: true,
            reason: "Negative Tricolon",
            heuristic: "negative_tricolon"
          };
        }
      }

      return { detected: false };
    }



  // Main detection method - runs all heuristics
  function sniff(text) {
    const heuristics = [
      sniffContrastFramingInline,
      sniffContrastFramingSequential,
      sniffNegativeTricolon
    ];
    
    for (const heuristic of heuristics) {
      const result = heuristic(text);
      if (result.detected) {
        return result;
      }
    }
    
    return { detected: false };
  }

  return { 
    sniff,
    sniffContrastFramingInline,
    sniffContrastFramingSequential,
    sniffNegativeTricolon
  };
})();

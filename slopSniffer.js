// slopSniffer.js

/**
 * Detects LinkedIn-style AI slop based on:
 *  - presence of a dash-like character (em-dash or dash bookended by spaces)
 *  - presence of negation in the clause before the dash
 */

const SlopSniffer = (() => {
  // Em dash character
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
  const apostrophe = "['’]";

  const negations = [
    'not',
    `\\bcan${apostrophe}t\\b`,
    `\\bwon${apostrophe}t\\b`,
    `\\bdon${apostrophe}t\\b`,
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
    return text.trim().split(/(?<=[.:!?•])\s+(?=[A-Z])|(?<=\w)\n+(?=[A-Z])/);
  }

  function sniff(text) {
    const sentences = splitSentences(text);
    const offenders = sentences.filter((sentence) => dashRegex.test(sentence))
      .map((sentence) => sentence.split(dashRegex)[0].trim());

    return offenders.some((s) => negationRegex.test(s));
  }

  return { sniff };
})();

// Example usage:
// const postText = document.querySelector('.post-content-selector').innerText;
// if (SlopSniffer.sniff(postText)) { hideOrCollapsePost(); }

"""
slop_sniffer.py

Detects AI-generated sentences (a.k.a., LinkedIn content slop).
"""

import re

class SlopSniffer:
    """
    A class that detects AI-generated content slop on LinkedIn, based on:
        - A dash-like character in a sentence (bookended by white spaces if not an em-dash)
        - Contrast framing in the portion of the sentence preceding the dash.
    """

    def __init__(self):
        """
        Initializes SlopSniffer by compiling regex patterns for dash and negation patterns.
        """
        self.dash_pattern, self.negation_pattern = self._define_patterns()

    def sniff(self, text):
        """
        Analyze the input text to determine whether any sentence contains
        both a dash and a negation in the clause before the dash.
        
        Args:
            text (str): The input text to evaluate. 
        
        Returns:
            bool: True if at least one offending sentence is found, False otherwise.
        """
        all_sentences = self._split_sentences(text)
        offending_sentences = [
            self.dash_pattern.split(sentence)[0].strip() for sentence in [
                sentence for sentence in all_sentences if re.search(self.dash_pattern, sentence)
            ]
        ]
        return any(self.negation_pattern.search(sentence) for sentence in offending_sentences)

    def _define_patterns(self):
        """
        Define regular expression patterns for detecting dashes and negation.
        
        Returns:
            Tuple[Pattern, Pattern]: A tuple containing:
                - A compiled regex pattern to detect various dash characters.
                - A compiled regex pattern to detect negation forms.
        """
        em_dash = '\u2014'
        other_dashes = [0x002D, 0x2010, 0x2011, 0x2012, 0x2013, 0x2015, 0x2212]
        other_dash_chars = ''.join(chr(cp) for cp in other_dashes)

        dash_pattern = re.compile(
            fr'(\s[{re.escape(other_dash_chars)}]\s|{em_dash})'
        )

        apostrophe = "['’]"
        negation_words = [
            r"not",
            fr"\bcan{apostrophe}t\b",
            fr"\bwon{apostrophe}t\b",
            fr"\bdon{apostrophe}t\b",
            fr"\bdoesn{apostrophe}t\b",
            fr"\bdidn{apostrophe}t\b",
            fr"\bhasn{apostrophe}t\b",
            fr"\bhaven{apostrophe}t\b",
            fr"\bhadn{apostrophe}t\b",
            fr"\baren{apostrophe}t\b",
            fr"\bisn{apostrophe}t\b",
            fr"\bwasn{apostrophe}t\b",
            fr"\bweren{apostrophe}t\b",
            fr"\bshouldn{apostrophe}t\b",
            fr"\bcouldn{apostrophe}t\b",
            fr"\bwouldn{apostrophe}t\b",
            fr"\bmustn{apostrophe}t\b",
            fr"\bneedn{apostrophe}t\b",
            fr"\bain{apostrophe}t\b"
        ]
        negation_pattern = re.compile("|".join(negation_words), flags=re.IGNORECASE)
        return dash_pattern, negation_pattern

    def _split_sentences(self, text):
        """
        Splits a block of text into sentences using basic punctuation rules.
        
        Args:
            text (str): The input text to split.
        
        Returns:
            List[str]: A list of sentence-like strings.
        """
        sentence_endings = re.compile(r'(?<=[.:!?•])\s+(?=[A-Z])')
        return sentence_endings.split(text.strip())

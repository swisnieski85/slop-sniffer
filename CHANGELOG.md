# Changelog

All notable changes to the SlopSniffer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/).

## [1.2.0] - 2025-08-13
### Added
- Three new detection heuristics added: Contrast Framing (Sequential), Negative Tricolon, and Interrogative Hook
  - Contrast Framing (Sequential): Two successive sentences beginning with negations and followed by an affirmation (e.g., "Not X. Not Y. Just Z.")
  - Negative Tricolon: Three successive sentences beginning with a negation (e.g., "No X. No Y. No Z.")
  - Interrogtive Hook: A short (2-3 word) question immediately answered (e.g., "Her jaw? Dropped like she just saw Beyonce at the local gym.")
- Content mask revised to display the rule identifying a post above the feedback buttons

### Changed
- Original detection heuristic ("Contrast Framing") renamed "Contrast Framing (Inline)".


## [1.1.4] - 2025-08-11
### Fixed
- Revised manifest.json to expose logo.png only to https://www.linkedin.com/, instead of all URLs.
- Changed fallback URN identification to simply "urn-unknown" to eliminate possible privacy leaks.


## [1.1.3] - 2025-08-08
### Fixed
- Revised regex pattern to treat all linebreaks as sentence boundaries, even if not preceded or followed by an alpha character (but instead by, e.g., an emoji or punctuation); this should avoid certain false positives
- Fixed a bug in the apostrophe definition that caused some identifications to be missed if the poster used a curly apostrophe instead of a straight one.


## [1.1.2] - 2025-08-08
### Fixed
- Added word boundaries around "not" in the regex negation list, so that longer strings containing "not" as a substring are not flagged (e.g., "another").


## [1.1.1] - 2025-08-08
### Fixed
- Added ellipsis characters (…) as sentence boundaries in slopSniffer.js' splitSentences method, to reduce false positives.
- Removed config.js from .gitignore (it somehow made it into the Git repo, anyway).


## [1.1.0] - 2025-08-08
### Added
- Detection reason display in content mask showing which AI content pattern was identified.

### Changed
- Removed "don't" from list of negation words (to prevent flagging harmless constructions like, e.g., "don't delay - reserve your spot today!").
- Refactored slopSniffer.js to accommodate the introduction of new heuristics; sniff method now implements heuristic checks, with each individual heuristic assigned its own method.
- Heuristic checks now return reason text for displaying in the content mask overlay.


## [1.0.3] - 2025-08-07
### Added
- Added fast early-exit optimization to avoid unnecessary splitting and matching.

### Changed
- Masking box content now appears vertically top-aligned rather than centered.


## [1.0.2] - 2025-08-06
### Added
- Added dummy (empty) config.js file.

### Changed
- Updated README.md appropriately.

## [1.0.1] - 2025-08-06
### Added
- Added user version number to Firebase feedback

### Fixed
- False positive detections caused by algorithm not treating unpunctuated line breaks as sentence delimiters

## [1.0.0] - 2025-08-06
### Added
- Complete Chrome extension implementation
- Content script injection on LinkedIn domains
- MutationObserver for dynamic content detection
- Firebase Firestore integration for feedback collection
- Optimized z-index handling to stay behind LinkedIn navbar
- AI slop detection using JavaScript
- Gold-bordered content overlay system for flagged posts
- "Show me the slop, anyway!" reveal functionality
- Persistent gold border around revealed posts
- Post identification using LinkedIn URNs
- Performance optimizations (debouncing, targeted DOM observation)
- Feedback buttons (✅ Good catch! / ❌ False positive)
- Extension version display in overlay
- Smart post processing to avoid re-analysis
- SPA navigation handling for LinkedIn
- Configuration system for Firebase project ID

### Changed
- **BREAKING**: Complete rewrite from Python prototype to Chrome extension
- Detection now runs in browser context
- User interface completely redesigned with overlay system\

### Removed
- Original Python prototype code.

## [0.0.0] - 2025-08-05
### Added
- Initial Python draft of single-heuristic SlopSniffer.
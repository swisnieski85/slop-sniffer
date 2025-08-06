# Changelog

All notable changes to the SlopSniffer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/).

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
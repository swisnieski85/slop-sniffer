# SlopSniffer

**SlopSniffer** is a Python-based text processing tool that identifies and flags suspect or confusing sentence structures — particularly those involving em-dashes and clause-level negation. It’s intended as a backend component for browser-based tools that help users clean up or analyze written content.

This is an early prototype implementation. It currently uses a single heuristic, but future releases may include up to seven more.

## Status

**Pre-release**  
This is version `0.0.0`. It's a foundational prototype and not yet intended for production use or broad distribution. A more complete public release is planned as part of a Chrome extension.

## Features

Detects posts with at least one sentence likely to have been AI-generated, defined as a sentence containing at least one dash-like character, the pre-dash clause of which contained a negation.

## Installation

Clone the repo:

```bash
git clone https://github.com/yourusername/slop-sniffer.git
cd slop-sniffer
```

Install dependencies (if any):

```bash
pip install -r requirements.txt
```

## Usage

Example:

```python
from slop_sniffer import SlopSniffer

slop_sniffer = SlopSniffer()
good_text = "Hello, my name is Sean. What's your name?"
bad_text = "It's not just stunning - it's brave."

slop_sniffer.sniff(good_text) # False - not AI-generated
slop_sniffer.sniff(bad_text)  # True - probably AI-generated
```

The `sniff` method returns `True` if it finds a sentence with an em-dash preceded by contrast-framing.

## Development

This project is written in pure Python and is designed to be modular. Future iterations may include:

- More sophisticated parsing
- Additional heuristics for sloppiness
- Integration with JavaScript/TypeScript for browser extensions

## Contributing

Pull requests and feedback are welcome, but please note that the project is still in early development and interfaces may change frequently.

## License

[MIT](LICENSE)

## Author

Sean Wisnieski

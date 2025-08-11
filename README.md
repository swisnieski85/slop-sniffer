# SlopSniffer

**SlopSniffer** is a Google Chrome extension that automatically detects and blocks AI-generated content ("slop") on LinkedIn posts. It identifies posts with telltale AI writing patterns and covers them with a friendly warning overlay, giving users control over what content they consume.

⚠️ SlopSniffer is constantly improving! **Check back often** for updates. ⚠️

## Status

**Beta Release**  
This is version `1.1` - a working Chrome extension ready for testing. The detection algorithm uses one primary heuristic, with plans to add up to eight more detection patterns in future releases. Because the extension is still in development, it is not a packed extension available through the Google chrome Web Store. It must be downloaded and then loaded as an unpacked extension (steps on doing this are included below).

## Features

- **Regex-Based Detection**: Quickly identifies posts containing classic signs of AI authorship (e.g., a contrast-framed sentence containing an em-dash: "it's not just stunning—it's brave")
- **Clean Interface**: Covers suspected AI posts with a gold-bordered overlay indicating the reason the content was identified as AI-generated
- **User Control**: "Show me the slop, anyway!" button to reveal content when desired
- **Feedback System**: Optional feedback buttons to help improve detection accuracy when
- **Performance Optimized**: Debounced processing that won't slow down LinkedIn

## Installation

### Prerequisites (Optional - for Git beginners)

If you don't have Git installed, you have two options:

**Option 1: Download ZIP (Easiest)**
1. Click the green "Code" button on this GitHub page
2. Select "Download ZIP"
3. Extract the ZIP file to a folder on your computer
4. Skip to step 2 below

**Option 2: Install Git**
- **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
- **Mac**: Install via [Homebrew](https://brew.sh/) with `brew install git`, or download from [git-scm.com](https://git-scm.com/download/mac)
- **Linux**: Use your package manager (e.g., `sudo apt install git` on Ubuntu)

### For Users

1. Get the code:
   
   **If you installed Git:**
   ```bash
   git clone https://github.com/swisnieski85/slop-sniffer.git
   ```
   
   **If you downloaded the ZIP:**
   Extract it to a folder like `slop-sniffer`

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top-right corner)

4. Click "Load unpacked" and select the `slop-sniffer` folder (don't double-click the folder; simply select it with a single-click and then click Select Folder)

5. The extension should now appear in your extensions list and work on LinkedIn.

### To update to the latest version

1. Follow the same steps above to re-clone or download the Git repo. If you are an approved beta-tester with a non-empty config.js file, make sure to copy this file elsewhere before re-cloning or downloading, and paste it back into the target directory after, to ensure it isn't overwritten.
2. In chrome://extensions, click the refresh button (a circular arrow) in the appropriate extension window.
3. Refresh your LinkedIn feed.

## Usage

1. **Browse LinkedIn normally** - SlopSniffer runs automatically in the background
2. **AI posts get flagged** - Suspected AI-generated posts will be covered with a gold-bordered overlay
3. **Choose to view or skip** - Click "Show me the slop, anyway!" to reveal the content
4. **Provide feedback** (optional) - Help improve detection by marking posts as correctly/incorrectly identified

## Feedback System

The extension includes an optional feedback system to help improve detection accuracy. Feedback is stored in a remote Firebase database, the project ID of which is stored in config.js.

### Beta Testing

If you'd like to help improve SlopSniffer by providing feedback on detection accuracy:

1. Ensure you have downloaded the latest version of SlopSniffer and loaded it into your Google Chrome extensions.
2. When you see a masked post in your LinkedIn feed, click "Show me the slop, anyway!" and then scroll the bottom to see feedback buttons for the post.
3. Click the appropriate button to submit feedback. If the post border changes and the buttons disappear, you know feedback has been submitted successfully.

Your feedback helps train the algorithm and reduces false positives for everyone!

## How Detection Works

Currently uses one heuristic that catches a common AI writing pattern:

**Pattern**: Posts containing dash-like characters where the pre-dash clause contains negation words (evidence of contrast framing)

**Examples that get flagged**:
- "It's not just innovative — it's revolutionary"
- "This isn't your average solution - it's transformative" 
- "We don't just deliver results — we exceed expectations"

**Why this works**: AI models often use this contrast-framing structure, while humans tend to write more naturally.

## Future Plans

- **More Detection Patterns**: 8 additional heuristics planned for implementation
- **Improved Accuracy**: Refinement of heuristics based on feedback
- **Better Analytics**: Detection statistics and trends
- **Other Browser Implementations**: Maybe, eventually, expanding the extension to work for other browsers or even devices

## Contributing

Pull requests welcome! This project is actively maintained and interfaces may evolve as I add more detection methods.

**Current priorities**:
- Additional AI content detection patterns
- False positive reduction  
- Performance improvements
- User experience enhancements

## Privacy

SlopSniffer processes post content locally in your browser. No post content is transmitted externally unless you explicitly submit feedback (even then, the only data stored is your feedback, the timestamp, the LinkedIn post ID, and the SlopSniffer version number; no other data is stored regarding the user).

## License

[MIT](LICENSE)

## Author

Sean Wisnieski
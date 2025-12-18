// content.js

console.log("SlopSniffer content script loaded!");

// Debounce function to limit how often we process posts
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function findLinkedInPosts() {
  return document.querySelectorAll("div.feed-shared-update-v2");
}

function findLinkedInComments() {
  return document.querySelectorAll("article.comments-comment-entity");
}

function isJobPosting(postElement) {
  // Check 1: Look for job-specific URL (most reliable and fastest)
  if (postElement.querySelector('a[href*="linkedin.com/jobs/view"]')) {
    return true;
  }

  // Check 2: Look for job entity card container
  if (postElement.querySelector('.update-components-entity.feed-shared-update-v2__content')) {
    return true;
  }

  // Check 3: Look for "View job" button text
  const buttons = postElement.querySelectorAll('.update-components-button__text');
  for (let button of buttons) {
    if (button.textContent.trim() === 'View job') {
      return true;
    }
  }

  return false;
}

function overlayPost(postElement, reason) {
  const overlay = document.createElement("div");
  overlay.className = "slop-sniffer-overlay";

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("logo.png");
  img.alt = "SlopSniffer logo";
  img.style.width = "80px";
  img.style.marginBottom = "10px";

  const text = document.createElement("p");
  text.innerText = "Woof! AI-Generated Content Detected!";
  text.style.fontWeight = "bold";
  
  const reasonText = document.createElement("p");
  reasonText.innerText = `AI Content Pattern Detected: ${reason}`;
  reasonText.style.fontSize = "13px";
  reasonText.style.color = "#DAA520";
  reasonText.style.marginBottom = "12px";
  reasonText.style.fontWeight = "500";
  reasonText.style.fontStyle = "italic";

  const version = document.createElement("p");
  const fullVersion = chrome.runtime.getManifest().version;
  const majorMinor = fullVersion.split('.').slice(0, 2).join('.');
  version.innerText = `Post hidden courtesy of SlopSniffer v${majorMinor}`;
  version.style.fontSize = "12px";
  version.style.color = "#666";
  version.style.marginBottom = "10px";

  const button = document.createElement("button");
  button.innerText = "Show me the slop, anyway!";
  button.style.cursor = "pointer";
  button.style.border = "1px solid #ccc";
  button.style.padding = "6px 12px";
  button.style.background = "#f9f9f9";

  button.addEventListener("click", () => {
    // Instead of removing overlay, show the post with feedback buttons
    overlay.style.transition = "opacity 0.3s ease";
    overlay.style.opacity = 0;
    
    setTimeout(() => {
      overlay.remove();
      // Add persistent gold border and feedback buttons
      addFeedbackUI(postElement, reason);
    }, 300);
  });

  overlay.appendChild(img);
  overlay.appendChild(text);
  overlay.appendChild(reasonText);
  overlay.appendChild(version);
  overlay.appendChild(button);

  // Style the overlay
  Object.assign(overlay.style, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    border: "3px solid gold",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "20px",
    zIndex: 50,
  });

  // Position the overlay over the entire post
  // Always use the main post element, not a sub-container
  postElement.style.position = "relative";
  postElement.appendChild(overlay);
}

function overlayComment(commentElement, reason) {
  const overlay = document.createElement("div");
  overlay.className = "slop-sniffer-comment-overlay";

  const text = document.createElement("p");
  text.innerText = "Woof! AI-Generated Comment Detected!";
  text.style.fontWeight = "bold";
  text.style.fontSize = "13px";
  text.style.color = "#DAA520";
  text.style.marginBottom = "8px";

  const button = document.createElement("button");
  button.innerText = "Show me the slop, anyway!";
  button.style.cursor = "pointer";
  button.style.border = "1px solid #ccc";
  button.style.padding = "4px 8px";
  button.style.background = "#f9f9f9";
  button.style.fontSize = "11px";

  button.addEventListener("click", () => {
    overlay.style.transition = "opacity 0.3s ease";
    overlay.style.opacity = 0;

    setTimeout(() => {
      overlay.remove();
      // Add gold border box around revealed comment
      commentElement.style.setProperty('border', '2px solid gold', 'important');
      commentElement.style.setProperty('border-radius', '4px', 'important');
      commentElement.style.setProperty('padding', '8px', 'important');
    }, 300);
  });

  overlay.appendChild(text);
  overlay.appendChild(button);

  // Style the overlay - more compact for comments
  Object.assign(overlay.style, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    border: "2px solid gold",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    zIndex: 50,
    fontSize: "12px",
  });

  // Apply overlay to entire comment article (covers profile pic, name, and content)
  commentElement.style.position = "relative";
  commentElement.appendChild(overlay);
}

function addFeedbackUI(postElement, reason) {
  // Add gold border to the post with !important to override LinkedIn's styles
  postElement.style.setProperty('border', '3px solid gold', 'important');
  postElement.style.setProperty('border-radius', '8px', 'important');
  postElement.style.setProperty('box-sizing', 'border-box', 'important');
  
  // Create feedback container
  const feedbackContainer = document.createElement("div");
  feedbackContainer.className = "slop-feedback-container";
  feedbackContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 8px;
    background: #fff9e6;
    margin: 8px;
    border-radius: 4px;
    border: 1px solid #ffd700;
  `;
  
  if (reason) {
    const reasonDisplay = document.createElement("p");
    reasonDisplay.innerText = `AI Content Pattern Detected: ${reason}`;
    reasonDisplay.style.cssText = `
      font-size: 13px;
      justify-content: center;
      font-style: italic;
      color: #b8860b; /* goldenrod */
      margin: 0 0 6px 0;
      font-weight: 500;
    `;
    feedbackContainer.appendChild(reasonDisplay);
  }
  
  // Buttons container for horizontal layout
  const buttonsRow = document.createElement("div");
  buttonsRow.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
  `;

  const correctBtn = document.createElement("button");
  correctBtn.innerText = "✅ Good catch!";
  correctBtn.style.cssText = `
    padding: 4px 8px;
    border: 1px solid #28a745;
    background: #d4edda;
    color: #155724;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    flex: 1;
  `;

  const incorrectBtn = document.createElement("button");
  incorrectBtn.innerText = "❌ False positive";
  incorrectBtn.style.cssText = `
    padding: 4px 8px;
    border: 1px solid #dc3545;
    background: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    flex: 1;
  `;
  
  correctBtn.addEventListener("click", () => {
    sendFeedback(postElement, true);
    feedbackContainer.remove();
    postElement.style.setProperty('border', '3px solid #28a745', 'important'); // Green border for confirmed
  });
  
  incorrectBtn.addEventListener("click", () => {
    sendFeedback(postElement, false);
    feedbackContainer.remove();
    postElement.style.setProperty('border', 'none', 'important'); // Remove border for false positive
  });
  
  buttonsRow.appendChild(correctBtn);
  buttonsRow.appendChild(incorrectBtn);
  feedbackContainer.appendChild(buttonsRow);
  postElement.appendChild(feedbackContainer);
}

function sendFeedback(postElement, isCorrect) {
  let postId = null;

  // Method 1: Check the post element itself
  const directUrn = postElement.getAttribute('data-urn');
  if (directUrn && directUrn.includes('urn:li:')) {
    postId = directUrn;
  }

  // Method 2: Check for entity URNs
  if (!postId) {
    const entityUrn = postElement.getAttribute('data-entity-urn');
    if (entityUrn && entityUrn.includes('urn:li:')) {
      postId = entityUrn;
    }
  }

  // Method 3: Find URN in link hrefs
  if (!postId) {
    const anchors = postElement.querySelectorAll('a[href*="linkedin.com/feed/update/"]');
    for (const a of anchors) {
      const match = a.href.match(/urn:li:(activity|ugcPost):\d+/);
      if (match) {
        postId = match[0];
        break;
      }
    }
  }

  // Fallback
  if (!postId) {
    const postText = postElement.innerText.trim();
    const firstLine = postText.split('\n')[0].substring(0, 50);
    const timestamp = Date.now();
    postId = `urn-unknown`;
  }

  const feedback = {
    postId: postId,
    isCorrect: isCorrect,
    timestamp: new Date().toISOString(),
    version: chrome.runtime.getManifest().version
  };
  
  // Send to Firebase Firestore using REST API
  fetch(`https://firestore.googleapis.com/v1/projects/${CONFIG.firebaseProjectId}/databases/(default)/documents/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        postId: { stringValue: feedback.postId },
        isCorrect: { booleanValue: feedback.isCorrect },
        timestamp: { stringValue: feedback.timestamp },
        version: { stringValue: feedback.version }
      }
    })
  }).then(response => {
    if (response.ok) {
      console.log("Feedback sent successfully!");
    } else {
      console.log("Failed to send feedback");
    }
  }).catch(error => {
    console.log("Error sending feedback:", error);
  });
}

function processComments() {
  const comments = findLinkedInComments();

  comments.forEach((comment) => {
    // Skip if we've already processed this comment
    if (comment.hasAttribute('data-slop-processed')) {
      return;
    }

    // Mark as processed immediately to avoid re-processing
    comment.setAttribute('data-slop-processed', 'true');

    // Extract comment text from the content area
    const contentSection = comment.querySelector('.comments-comment-item__main-content');
    if (!contentSection) {
      return;
    }

    const text = contentSection.innerText;
    const result = SlopSniffer.sniff(text);
    if (result.detected) {
      overlayComment(comment, result.reason);
    }
  });
}

function processPosts() {
  const posts = findLinkedInPosts();

  posts.forEach((post) => {
    // Skip if we've already processed this post
    if (post.hasAttribute('data-slop-processed')) {
      return;
    }

    // Mark as processed immediately to avoid re-processing
    post.setAttribute('data-slop-processed', 'true');

    // Skip job postings - users want to see these even if AI-generated
    if (isJobPosting(post)) {
      return;
    }

    // Get post text but exclude comment text to avoid false positives
    // Clone the post, remove comments section, then get text
    const postClone = post.cloneNode(true);
    const commentsSection = postClone.querySelector('.comments-comments-list');
    if (commentsSection) {
      commentsSection.remove();
    }
    const text = postClone.innerText;

    const result = SlopSniffer.sniff(text);
    if (result.detected) {
      overlayPost(post, result.reason);
    }
  });
}

function processAll() {
  processPosts();
  processComments();
}

// Debounced version that only runs once every 100ms max
const debouncedProcessAll = debounce(processAll, 100);

// More targeted observer - watch for new posts and comments being added
const observer = new MutationObserver((mutations) => {
  // Only process if we actually see new LinkedIn posts or comments being added
  let shouldProcess = false;

  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if this is a LinkedIn post or contains LinkedIn posts
          if (node.matches && node.matches('div.feed-shared-update-v2')) {
            shouldProcess = true;
            break;
          }
          if (node.querySelector && node.querySelector('div.feed-shared-update-v2')) {
            shouldProcess = true;
            break;
          }
          // Check if this is a LinkedIn comment or contains LinkedIn comments
          if (node.matches && node.matches('article.comments-comment-entity')) {
            shouldProcess = true;
            break;
          }
          if (node.querySelector && node.querySelector('article.comments-comment-entity')) {
            shouldProcess = true;
            break;
          }
        }
      }
      if (shouldProcess) break;
    }
  }

  if (shouldProcess) {
    debouncedProcessAll();
  }
});

// More specific observation target - LinkedIn's main feed container
const feedContainer = document.querySelector('main.scaffold-layout__main') || document.body;

observer.observe(feedContainer, {
  childList: true,
  subtree: true,
});

// Initial processing when page loads
window.addEventListener("load", () => {
  // Small delay to let LinkedIn finish loading
  setTimeout(processAll, 1000);
});

// Also process when navigating within LinkedIn (SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Clear processed flags when navigating to new page
    document.querySelectorAll('[data-slop-processed]').forEach(el => {
      el.removeAttribute('data-slop-processed');
    });
    setTimeout(processAll, 1000);
  }
}).observe(document, { subtree: true, childList: true });

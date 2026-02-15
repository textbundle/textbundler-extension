#!/usr/bin/env bash
#
# Download Tier 2 test fixtures (full HTML pages) into tests/sites/.
# Idempotent: re-running overwrites existing files.
# Best-effort: individual failures are logged but do not abort the script.
#
# URL Manifest (SPEC Section 7.2, TASK-005):
#   01 - Wikipedia (Markdown)
#   02 - MDN Web Docs (article element)
#   03 - GitHub Blog (availability report)
#   04 - Medium (Karpathy backprop)
#   05 - Substack / Platformer (welcome)
#   06 - WordPress Blog (6.4 release)
#   07 - BBC News (science)
#   08 - The Guardian (ChatGPT one year)
#   09 - Stack Overflow (sorted array)
#   10 - arXiv (Attention paper)
#   11 - Rust Book (ownership)
#   12 - CSS-Tricks (flexbox)
#   13 - The Atlantic (longform)
#   14 - Wired (fast food AI)
#   15 - Python Docs (introduction)
#   16 - Smashing Magazine (SVG patterns)
#   17 - Ars Technica (neutron star)
#   18 - DEV Community (WXT + Angular)
#   19 - Hacker News (item 1) — non-article
#   20 - GitHub Search (markdown parser) — non-article

set -euo pipefail

if ! command -v wget &>/dev/null; then
  echo "Error: wget is required but not installed."
  echo "Install with: brew install wget"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="$SCRIPT_DIR/../tests/sites"
mkdir -p "$DEST_DIR"

FAILURES=0

download() {
  local filename="$1"
  local url="$2"
  echo "Downloading $filename ..."
  if wget --quiet --output-document="$DEST_DIR/$filename" "$url"; then
    echo "  OK: $filename"
  else
    echo "  FAILED: $filename ($url)"
    FAILURES=$((FAILURES + 1))
  fi
}

download "01-wikipedia-html.html"   "https://en.wikipedia.org/wiki/Markdown"
download "02-mdn-web-docs.html"     "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article"
download "03-github-blog.html"      "https://github.blog/news-insights/company-news/github-availability-report-january-2025/"
download "04-medium-article.html"   "https://medium.com/@karpathy/yes-you-should-understand-backprop-e2f06eab496b"
download "05-substack-post.html"    "https://www.platformer.news/welcome-to-platformer/"
download "06-wordpress-blog.html"   "https://wordpress.org/news/2024/01/wordpress-6-4-shirley/"
download "07-bbc-news.html"         "https://www.bbc.com/news/science-environment-54367684"
download "08-guardian-article.html"  "https://www.theguardian.com/technology/2023/nov/30/chatgpt-one-year-on"
download "09-stackoverflow.html"    "https://stackoverflow.com/questions/11227809/why-is-processing-a-sorted-array-faster-than-processing-an-unsorted-array"
download "10-arxiv-paper.html"      "https://arxiv.org/abs/1706.03762"
download "11-rust-docs.html"        "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html"
download "12-css-tricks.html"       "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
download "13-atlantic-longform.html" "https://www.theatlantic.com/magazine/archive/2024/01/social-media-happiness-math-smartphone/676147/"
download "14-wired-feature.html"    "https://www.wired.com/story/fast-food-kiosks-artificial-intelligence/"
download "15-python-docs.html"      "https://docs.python.org/3/tutorial/introduction.html"
download "16-smashing-mag.html"     "https://www.smashingmagazine.com/2021/05/accessible-svg-patterns-comparison/"
download "17-ars-technica.html"     "https://arstechnica.com/science/2024/01/epic-journey-of-lonely-neutron-star-reaches-conclusion/"
download "18-devto-post.html"       "https://dev.to/lacolaco/building-browser-extensions-with-wxt-angular-kfj"
download "19-hn-comments.html"      "https://news.ycombinator.com/item?id=1"
download "20-github-search.html"    "https://github.com/search?q=markdown+parser&type=repositories"

echo ""
if [ "$FAILURES" -gt 0 ]; then
  echo "Done with $FAILURES failure(s)."
else
  echo "All downloads complete."
fi
exit 0

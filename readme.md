# P5.js: RSS

[Deutsch](README_DE.md)

Loads an RSS 2.0 or Atom feed, parses the XML and writes title, date and
summary of every entry onto the canvas. The feed is re-fetched every 10
seconds. A starting point for using news feeds or other live XML data as
input for a sketch.

## Installation

Requirements: a browser and an internet connection (the feed is loaded
through a public proxy).

Set the feed URL in `RSS_URL` at the top of `sketch.js` (default: NZZ
recent news).

Libraries (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (included, not
used).

## How to Run

1. Open the folder in Visual Studio Code and start Live Server (click
   **Go Live** in the status bar).
2. The entries appear on the canvas.

## Coding Help

- **`sketch.js` → `RSS_URL` / `ATOM_URL`**: the feed addresses. `ATOM_URL`
  holds an example Atom feed (arXiv); to use it, replace `RSS_URL` with
  `ATOM_URL` in `fetchRSS()`.
- **`setup()`**: creates a full-window canvas, turns off the draw loop
  with `noLoop()`, loads the feed once and then again every 10 seconds
  with `setInterval()`, calling `draw()` manually after each load.
- **`fetchRSS()`**: requests the feed through the
  [AllOrigins](https://allorigins.win) proxy
  (`https://api.allorigins.win/raw?url=...`), which adds CORS headers so the
  browser accepts the response. The text is parsed with `DOMParser`; on a
  parse error an exception is thrown.
- **`parseRssXml()`**: looks for RSS `<item>` elements first and falls back
  to Atom `<entry>` elements. Returns an array of objects with `title`,
  `link`, `date`, `summary` and `guid`.
- **`draw()`**: clears the canvas and writes title, date and summary of
  each item, 100 px apart. Change the layout here; long summaries are not
  wrapped and may contain HTML.

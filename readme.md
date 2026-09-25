# P5 -> RSS

A p5.js sketch that loads an RSS 2.0 or Atom feed, parses the XML and draws
title, date and summary of every entry on the canvas. The feed is re-fetched
every 10 seconds.

## How to Use

1. Set the feed URL in `RSS_URL` at the top of `sketch.js` (default: NZZ
   recent news). An example Atom feed is provided in `ATOM_URL`; to use it,
   replace `RSS_URL` with `ATOM_URL` in `fetchRSS()`.
2. Start Live Server (click **Go Live** in the VS Code status bar).
3. The entries appear on the canvas and are also logged to the console.

## How it Works

The feed is requested through the public [AllOrigins](https://allorigins.win)
proxy (`https://api.allorigins.win/raw?url=...`), which returns the feed with
CORS headers, so no browser workaround is needed. The response is parsed with
`DOMParser`; `parseRssXml()` first looks for RSS `<item>` elements and falls
back to Atom `<entry>` elements, returning objects with `title`, `link`,
`date`, `summary` and `guid`.

## Libraries

- p5.js 1.10.0
- p5.sound 1.0.1 (loaded, not used)

// ===============================
// RSS / Atom Feed Reader in p5.js
// ===============================

// -------------------------------
// Configurable feed URLs
// -------------------------------
const RSS_URL = "https://www.nzz.ch/recent.rss"; // Example RSS feed
const ATOM_URL = "https://rss.arxiv.org/atom/math.QA";    // Example Atom feed

// Array to store parsed feed items
let items = [];

// -------------------------------
// p5.js setup function
// -------------------------------
async function setup() {
  createCanvas(windowWidth, windowHeight); // full-window canvas
  noLoop();                                // disable continuous drawing; we redraw manually

  // Fetch and display the feed immediately
  items = await fetchRSS();
  draw();

  // Set interval to fetch updates every 10 seconds
  setInterval(async () => {
    items = await fetchRSS();  // re-fetch feed
    draw();                    // redraw canvas
  }, 10000);
}

// -------------------------------
// p5.js draw function
// -------------------------------
function draw() {
  background(255); // clear background

  let offset = 0; // vertical offset for text

  // Iterate through all feed items and display them
  items.forEach(item => {
    console.log(item); // log item for debugging

    // Display item details
    text(item.title, 20, offset + 20);
    text(item.date, 20, offset + 40);
    text(item.summary, 20, offset + 60);

    // Increment offset for next item
    offset += 100;
  });
}

// -------------------------------
// Fetch RSS / Atom feed using AllOrigins proxy
// -------------------------------
async function fetchRSS() {
  // AllOrigins proxy URL (bypasses CORS restrictions)
  const url = "https://api.allorigins.win/raw?url=" + encodeURIComponent(RSS_URL);

  // Fetch feed content
  const response = await fetch(url);
  const rawtext = await response.text();

  // Parse the XML string into a DOM object
  const parser = new DOMParser();
  const xml = parser.parseFromString(rawtext, "application/xml");

  // Check for parsing errors
  const parsererror = xml.querySelector("parsererror");
  if (parsererror) {
    throw new Error("Error parsing XML: " + parsererror.textContent);
  }

  // Convert XML into JavaScript objects
  return parseRssXml(xml);
}

// -------------------------------
// Parse XML (RSS or Atom) into array of items
// Each item has: title, link, date, summary, guid
// -------------------------------
function parseRssXml(xml) {
  const parsed = [];

  // First, try RSS 2.0: <channel><item>
  const itemsXml = Array.from(xml.querySelectorAll("item"));

  if (itemsXml.length === 0) {
    // If no <item> found, try Atom feed: <entry>
    const entries = Array.from(xml.querySelectorAll("entry"));

    entries.forEach(e => {
      const id = (e.querySelector("id") || {}).textContent || null;
      const title = (e.querySelector("title") || {}).textContent || "No title";

      // Atom link handling (usually in <link rel="alternate">)
      const linkEl = e.querySelector("link[rel='alternate']") || e.querySelector("link");
      let link = linkEl ? linkEl.getAttribute("href") || linkEl.textContent : "";

      const date = (e.querySelector("updated") || e.querySelector("published") || {}).textContent || "";
      const summary = (e.querySelector("summary") || e.querySelector("content") || {}).textContent || "";

      parsed.push({ title, link, date, summary, guid: id });
    });

  } else {
    // RSS parsing
    itemsXml.forEach(it => {
      const title = (it.querySelector("title") || {}).textContent || "No title";
      const guid = (it.querySelector("guid") || {}).textContent || null;

      // RSS link handling
      const link = (it.querySelector("link") || {}).textContent ||
                   (it.querySelector("link[href]") ? it.querySelector("link").getAttribute("href") : "");

      const pubDate = (it.querySelector("pubDate") || it.querySelector("dc\\:date") || {}).textContent || "";

      // Description / content
      let description = "";
      const descEl = it.querySelector("description");
      if (descEl) description = descEl.textContent;
      else {
        const contentEl = it.querySelector("content\\:encoded");
        if (contentEl) description = contentEl.textContent;
      }

      parsed.push({ title, link, date: pubDate, summary: description, guid: guid });
    });
  }

  return parsed;
}
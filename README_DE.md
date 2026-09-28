# P5.js: RSS

[English](readme.md)

Lädt einen RSS-2.0- oder Atom-Feed, parst das XML und schreibt Titel,
Datum und Zusammenfassung jedes Eintrags auf die Zeichenfläche. Der Feed
wird alle 10 Sekunden neu geladen. Ein Ausgangspunkt, um Newsfeeds oder
andere laufend aktualisierte XML-Daten als Input für einen Sketch zu
verwenden.

## Installation

Voraussetzungen: ein Browser und eine Internetverbindung (der Feed wird über
einen öffentlichen Proxy geladen).

In `sketch.js` oben die Feed-URL in `RSS_URL` eintragen (Standard: NZZ
Neueste Meldungen).

Bibliotheken (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (eingebunden,
nicht verwendet).

## Ausführen

1. Den Ordner in Visual Studio Code öffnen und Live Server starten (in der
   Statusleiste auf **Go Live** klicken).
2. Die Einträge erscheinen auf der Zeichenfläche.

## Coding-Hilfe

- **`sketch.js` → `RSS_URL` / `ATOM_URL`**: die Feed-Adressen. `ATOM_URL`
  enthält einen Beispiel-Atom-Feed (arXiv); um ihn zu verwenden, in
  `fetchRSS()` `RSS_URL` durch `ATOM_URL` ersetzen.
- **`setup()`**: erstellt eine fensterfüllende Zeichenfläche, schaltet die
  Draw-Schleife mit `noLoop()` aus, lädt den Feed einmal und danach alle
  10 Sekunden mit `setInterval()` und ruft nach jedem Laden `draw()` von
  Hand auf.
- **`fetchRSS()`**: holt den Feed über den Proxy
  [AllOrigins](https://allorigins.win)
  (`https://api.allorigins.win/raw?url=...`), der CORS-Header hinzufügt,
  damit der Browser die Antwort akzeptiert. Der Text wird mit `DOMParser`
  geparst; bei einem Parse-Fehler wird eine Exception geworfen.
- **`parseRssXml()`**: sucht zuerst nach RSS-`<item>`-Elementen und weicht
  sonst auf Atom-`<entry>`-Elemente aus. Gibt ein Array von Objekten mit
  `title`, `link`, `date`, `summary` und `guid` zurück.
- **`draw()`**: löscht die Zeichenfläche und schreibt Titel, Datum und
  Zusammenfassung jedes Eintrags im Abstand von 100 px. Hier das Layout
  anpassen; lange Zusammenfassungen werden nicht umbrochen und können HTML
  enthalten.

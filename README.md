Parliamentary Debate Timer
A clean, browser-based timer for parliamentary debate formats — no installation required, just open the HTML file.
Features

3 debate formats supported out of the box
- Color-coded timer states — red (protected time), green (normal), orange (warning), dark red (overtime)
- Automatic bells — single, double, and alarm bells fire at threshold crossings
- POI button — 15-second countdown with 20-second cooldown; locked outside the green zone and for reply speakers
- Speaker queue — click any dot to jump to a specific speaker
- Keyboard shortcuts for hands-free operation

Supported Formats
- British Parliamentary 8 speakers (4 teams)7:20
- Asian Parliamentary 6 speakers + reply speakers (2 teams) 7:20 for substantive speech and 4:20 for reply speechs
- WSDC 6 speakers + reply speakers (2 teams) 8:20 for substantive speech and 4:00 for reply speechs
  
Timer States
- 🔴 Red Protected First 60s — POI not allowed
- 🟢 Green Normal POI window open
- 🟠 Orange Warning Approaching max time
- 🔴 Dark Red Overtime Past max time
- ⬛ Near-black Exceeded Significantly over time
  
Keyboard Shortcuts
- Space Start / Pause
- R = Reset current speaker
- N = Next speaker
- P = Trigger POI
- Esc Back to format selection
  
Usage
1. Open debate-timer.html in any modern browser
2. Select a debate format
3. Press Start or Space to begin the first speaker's timer
4. Use Next Speaker → or N to advance through the lineup
5. Press POI (or P) during the green zone to start a 15-second POI countdown

File Structure

timer-verbalize/
  └── debate-timer.html   # Everything in one self-contained file
  
Browser Compatibility
Works in any modern browser that supports the Web Audio API (Chrome, Firefox, Edge, Safari). No internet connection required after the Google Fonts are cached.

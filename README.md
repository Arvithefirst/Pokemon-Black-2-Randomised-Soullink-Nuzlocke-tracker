# 🐉 Unova Randomized Nuzlocke Tracker

A shared, live-updating tracker for a Soul Link Nuzlocke run. Log your catches, see your partner's team update in real time, get pairing suggestions, track evolutions, and set your own level caps — all in one page that both of you can have open side-by-side with your emulator.

**Important:** this only works between two people on the **same WiFi network** (same house, same router). It won't work over the internet or between different homes.

---

## What you need before starting

- **Node.js** — this is what runs the "server" (the part that syncs both players together). One of you needs it installed.
  - Download it here: **https://nodejs.org** — pick the button that says **LTS**. Install it like any normal program (click Next through the installer).
- Both players need to be connected to the **same WiFi**.

Only **one person** (the "host") needs to do the setup below. The other person just needs a web browser.

---

## One-time setup (host only)

1. **Download this project.** On this GitHub page, click the green **`<> Code`** button → **Download ZIP**. Unzip it somewhere easy to find, like your Desktop.

2. **Open a terminal in that folder.**
   - **Windows:** Open the unzipped folder, click into the address bar at the top, type `cmd`, and hit Enter.
   - **Mac:** Open the unzipped folder in Finder, right-click inside it, and choose *"New Terminal at Folder"* (if you don't see that option, open the Terminal app and type `cd ` followed by dragging the folder into the window, then hit Enter).

3. **Install the dependencies.** In the terminal window that opened, type:
   ```
   npm install
   ```
   and hit Enter. Wait for it to finish (a folder called `node_modules` will appear — that's normal).

4. **Start the server.** Type:
   ```
   npm start
   ```
   and hit Enter. Leave this window open — closing it shuts down the tracker for both of you.

5. You'll see something like this printed in the terminal:
   ```
   Server running! Have your friends connect to: ws://192.168.1.42:3000
   ```
   **Write down that `ws://...` address** — you'll both need it in the next step. (It'll be different numbers on your network — that's expected.)

---

## Opening the tracker (both players)

1. **Host:** open your browser and go to `http://localhost:3000`
2. **Other player:** open your browser and go to `http://` followed by the same numbers the host wrote down (but not the `ws://` part or the `:3000` — just the address, e.g. `http://192.168.1.42:3000`)
3. The very first time the page loads, it will pop up asking for a **server address**. Type in the full `ws://192.168.1.42:3000` address exactly as the host's terminal showed it, and hit OK.
4. Set your name using the ⚙️ (gear) icon in the top right, under "Player Names."

That's it — you're synced. Anything either of you logs, evolves, or moves around updates on the other person's screen automatically.

---

## Playing again later

Every time you want to play:

1. **Host:** open the terminal in the project folder again and run `npm start` (you don't need to run `npm install` again unless you download a fresh copy of the project).
2. Both players open the tracker in their browser like before.

**If the address changed** (e.g. the host reconnected to WiFi and got a new number, or you're on a different network than last time): open the **⋮ (Data) menu** in the tracker and click **🔌 Change Server**, then paste in the new `ws://...` address from the terminal.

---

## Troubleshooting

| Problem | Try this |
|---|---|
| Page says "Disconnected" or won't connect | Make sure both people are on the same WiFi — not one on WiFi and one on cell data. |
| Windows shows a firewall popup when you run `npm start` | Click **Allow access** — this just lets your friend's device talk to yours over WiFi. |
| Address stopped working after a while | The host's WiFi may have assigned a new IP. Restart the server, grab the new `ws://` address from the terminal, and use **Change Server** in the tracker's ⋮ menu. |
| Pokémon autocomplete / types aren't loading | The tracker pulls species data from the internet on load — make sure the host machine has an internet connection, even though the sync itself is local-WiFi-only. |
| `npm install` or `npm start` says "command not found" | Node.js isn't installed yet, or the terminal isn't open in the right folder. Revisit steps 1–2 of setup. |

---

## What's in this project

- `Index.html` — the tracker itself (open this via the server, not by double-clicking the file, or you won't get the live sync).
- `server.js` — the small local server that keeps both players' screens in sync.
- `package.json` — tells Node what to install (just the `ws` library).

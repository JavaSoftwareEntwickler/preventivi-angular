Electron è **la scelta giusta** per trasformare **frontend + backend** in **un’unica applicazione desktop (.exe)** avviabile dal desktop, senza dipendenze esterne.

**Come farlo in modo senior / enterprise**, senza hack.

---

# 🎯 Obiettivo

Ottenere:

* **1 eseguibile Windows (`.exe`)**
* Frontend Angular
* Backend Node/Express
* Avvio automatico del backend
* UI desktop via Chromium (Electron)
* Nessun `ng serve`, nessun server esterno

---

# 🧱 Architettura finale (corretta)

```
Preventivo Desktop App
├─ Electron (main process)
│  ├─ avvia backend Node
│  └─ carica Angular build
├─ Angular (build statico)
└─ Backend Express (API REST)
```

Electron diventa **il contenitore**.

---

# 📁 Struttura consigliata del progetto

```
/preventivo
├─ frontend/        → Angular
├─ server-be/       → Backend Express
├─ electron/
│  ├─ main.js
│  └─ preload.js
├─ dist/
│  ├─ angular/      → build Angular
│  └─ server/       → backend compilato
├─ package.json
```

---

# ⚙️ Step 1 — Installare Electron

Nel **root del progetto**:

```bash
npm install --save-dev electron electron-builder concurrently wait-on
```

---

# ⚙️ Step 2 — Build Angular (produzione)

```bash
cd frontend
ng build --configuration production
```

Output tipico:

```
dist/frontend/browser/
```

---

# ⚙️ Step 3 — Preparare il backend per Electron

### 🔹 Backend deve:

* ascoltare su `localhost` (es. `8088`)
* **NON usare path assoluti**
* **NON dipendere da nodemon**

Aggiungi uno script:

```json
"scripts": {
  "serve:electron": "node app.js"
}
```

---

# ⚙️ Step 4 — Electron `main.js`

📄 `electron/main.js`

```js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(
    path.join(__dirname, '../dist/angular/browser/index.html')
  );

  mainWindow.on('closed', () => {
    if (backendProcess) backendProcess.kill();
  });
}

app.whenReady().then(() => {
  backendProcess = spawn(
    'node',
    [path.join(__dirname, '../dist/server/app.js')],
    { stdio: 'inherit' }
  );

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

---

# ⚙️ Step 5 — Electron preload (opzionale)

📄 `electron/preload.js`

```js
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron preload loaded');
});
```

---

# ⚙️ Step 6 — `package.json` root

```json
{
  "name": "preventivo-desktop",
  "main": "electron/main.js",
  "scripts": {
    "build:fe": "cd preventivo && ng build --configuration production",
    "build:be": "cd server-be && npm run build",
    "build": "npm run build:fe && npm run build:be",
    "electron:dev": "electron .",
    "electron:build": "npm run build && electron-builder"
  }
}
```

---

# ⚙️ Step 7 — Configurare `electron-builder`

```json
"build": {
  "appId": "it.maxmarchesini.preventivo",
  "productName": "Preventivo",
  "files": [
    "dist/**",
    "electron/**"
  ],
  "win": {
    "target": "nsis"
  }
}
```

---

# 🖥️ Output finale

Alla fine ottieni:

```
dist/
└─ win-unpacked/
└─ Preventivo Setup.exe
```

✔ Doppio click
✔ Backend avviato automaticamente
✔ App desktop offline
✔ Nessun server esterno

---

# 🔒 Sicurezza (importante)

* NON esporre il backend su rete pubblica
* Usa `localhost`
* Eventualmente:

  ```js
  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
  ```

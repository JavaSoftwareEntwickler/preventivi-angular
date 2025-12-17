# Preventivo

Applicazione web per la **gestione e la creazione di preventivi**, composta da:
- **Frontend** in Angular
- **Backend** REST separato (Node.js)

Il progetto consente la gestione completa dei preventivi e delle relative righe, con
paginazione, form reattivi e persistenza su database.

---

## 🧱 Architettura

Il progetto è strutturato come **frontend + backend separati**:

```

/preventivo        → Frontend Angular
/server-be         → Backend Node.js / Express

````

- Il frontend comunica con il backend tramite **API REST**
- Le righe di preventivo sono gestite come risorsa indipendente
- Stato e UI basati su **Signals** e servizi dedicati

---

## 🚀 Stack Tecnologico

### Frontend
- **Angular 20**
- Angular Material
- RxJS
- Reactive Forms
- Signals
- Prettier

### Backend
- Node.js
- Express
- TypeORM
- Database relazionale (configurabile)

---

## 📦 Requisiti

- Node.js ≥ 18
- npm ≥ 9
- Angular CLI ≥ 20
- Database configurato per il backend

---

## ▶️ Avvio del progetto

### Avvio frontend + backend (sviluppo)

```bash
npm run dev
````

Questo comando avvia:

* Angular su `http://localhost:4200`
* Backend su `http://localhost:8088`

---

### Avvio singolo

#### Frontend

```bash
npm start
```

#### Backend

```bash
cd server-be
npm run serve
```

---

## 📑 Script disponibili

| Script          | Descrizione                               |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Avvia frontend e backend in due terminali |
| `npm start`     | Avvia Angular                             |
| `npm run build` | Build di produzione                       |
| `npm run watch` | Build in modalità watch                   |
| `npm test`      | Esegue i test                             |
| `npm run doc`   | Genera documentazione con Compodoc        |

---

## 🔌 API REST principali

### Preventivi

* `GET /preventivi`
* `POST /preventivi`
* `PUT /preventivi/:id`
* `DELETE /preventivi/:id`

### Righe Preventivo

* `GET /righe-preventivo`
* `POST /righe-preventivo`
* `PUT /righe-preventivo/:id`
* `DELETE /righe-preventivo/:id`

---

## 🧠 Caratteristiche principali

* Creazione e modifica preventivi
* Gestione righe con CRUD dedicato
* Paginazione dinamica
* Form reattivi con validazione
* Separazione chiara tra:

  * UI
  * Stato applicativo
  * API
  * Persistenza

---

## 📚 Documentazione

Per generare la documentazione del frontend:

```bash
npm run doc
```

La documentazione sarà disponibile in una cartella dedicata ed esposta tramite server locale.

---

## 🧪 Testing

* Test unitari con Jasmine e Karma
* Setup pronto per estensione test di integrazione

---

## ✨ Stile del codice

Il progetto utilizza **Prettier** con le seguenti regole principali:

* `printWidth: 100`
* `singleQuote: true`
* parser Angular per template HTML

---

## 📌 Note

* Il backend deve essere avviato prima di utilizzare il frontend
* Le configurazioni di database e ambiente sono gestite lato backend
* Il progetto è pensato per estensioni future (auth, PDF, export, ecc.)

---

## 👤 Autore

Sviluppato da **Max Marchesini**  
Sito web: https://maxmarchesini.it

Progetto per la gestione di preventivi
Sviluppato a scopo applicativo e didattico

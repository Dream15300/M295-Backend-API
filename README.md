# **M295 – Zeiterfassung Backend API**

TypeScript · Express · SQLite · HTTPS · JWT · Multer · Rollenverwaltung · Dokument-Upload

Dies ist das vollständige Backendprojekt für die Modulprüfung **M295 (Backend-API)**.
Es implementiert ein vollständiges Zeiterfassungssystem mit:

* Benutzerverwaltung
* Authentifizierung (JWT)
* Rollen & Berechtigungen
* Zeitstempel (IN/OUT)
* Abwesenheiten inkl. Genehmigungsprozess
* Upload/Download/Löschen von Dokumenten pro Abwesenheit
* Änderungsprotokoll (Logs)
* HTTPS-Server
* Datenbank via Migrations + Seeders

---

# 📌 **Hauptfeatures**

### 🔐 **Authentication & Authorization**

* Login erstellt ein JWT
* Geschützte Routen via `verifyToken`
* Rollen: `admin`, `employee`
* `admin` kann:

  * Benutzer listen
  * Logs anzeigen
  * Dokumente löschen
  * Zeitstempel bearbeiten
  * Abwesenheiten genehmigen/ablehnen

---

### 🕒 **Zeiterfassung**

* Zeitstempel erstellen (IN/OUT)
* Zeitstempel aktualisieren (nur admin)
* Zeitstempel löschen (nur admin)

---

### 📅 **Abwesenheiten**

* Abwesenheit erstellen
* Aktuelle Benutzer-Abwesenheiten anzeigen
* Abwesenheit genehmigen/ablehnen (admin)

---

### 📄 **Dokumenten-Upload**

Pro Abwesenheit können mehrere Dokumente hochgeladen werden:

* Upload (`POST /absences/:id/documents`)
* Liste (`GET /absences/:id/documents`)
* Download (`GET /absences/:id/documents/:filename`)
* Delete (`DELETE /absences/:id/documents/:filename`)

Speicherort:

```
/files/<absenceId>/<serverFileName>
```

---

### 📝 **Änderungsprotokoll (Logs)**

* Jeder administrative Eingriff wird geloggt
* Logs können via `/logs` eingesehen werden (nur admin)

---

# 📦 **Technologien**

* Node.js 18+
* TypeScript
* Express
* Multer (Dateiupload)
* SQLite3
* JWT
* HTTPS Server
* Winston Logger

---

# 🛠️ **Installation**

```bash
npm install
```

---

# ▶️ **Server starten**

### Entwicklung:

```bash
npm run dev
```

### Produktion:

```bash
npm start
```

Server läuft unter:

```
https://localhost:5001
```

Zertifikate liegen in:

```
cert/server.key
cert/server.crt
```

---

# 🗄 **Datenbank**

Beim Serverstart werden automatisch:

* **Migrations** ausgeführt → erzeugen Tabellen
* **Seeders** ausgeführt → erzeugen Admin & Testdaten

### 📁 Verzeichnisstruktur:

```
data/
 ├─ migrations/
 ├─ seeders/
 └─ database.sqlite3
```

---

# 🔐 **Authentifizierung**

### Login:

```
POST /login
{
  "username": "admin",
  "password": "hallo123456"
}
```

Antwort:

```json
{
  "token": "<JWT>",
  "user": {
    "id": 1,
    "role": "admin"
  }
}
```

### Logout:

```
POST /logout
```

### Token senden:

```
Authorization: Bearer <JWT>
```

---

# 🧪 **API – Übersicht wichtiger Endpunkte**

## 🔐 Auth

| Methode | Endpoint  | Beschreibung    |
| ------- | --------- | --------------- |
| POST    | `/login`  | Token erzeugen  |
| POST    | `/logout` | Session beenden |

---

## 👤 Benutzer

| Methode | Endpoint           | Hinweise                            |
| ------- | ------------------ | ----------------------------------- |
| GET     | `/users`           | admin                               |
| GET     | `/users/:id`       | eigenes Profil oder admin           |
| GET     | `/users/:id/saldo` | berechneter Zeit-/Abwesenheitssaldo |

---

## 🕒 Zeitstempel (Time Entries)

| Methode | Endpoint            | Beschreibung    |
| ------- | ------------------- | --------------- |
| POST    | `/time-entries`     | IN/OUT stempeln |
| PUT     | `/time-entries/:id` | admin           |
| DELETE  | `/time-entries/:id` | admin           |

---

## 📅 Abwesenheiten

| Methode | Endpoint        | Beschreibung                |
| ------- | --------------- | --------------------------- |
| POST    | `/absences`     | Antrag erstellen            |
| GET     | `/absences`     | Eigene Anträge              |
| PUT     | `/absences/:id` | Genehmigen/ablehnen (admin) |

---

## 📄 Dokumente pro Abwesenheit

| Methode | Endpoint                            | Beschreibung      |
| ------- | ----------------------------------- | ----------------- |
| POST    | `/absences/:id/documents`           | Dateien hochladen |
| GET     | `/absences/:id/documents`           | Dokumentliste     |
| GET     | `/absences/:id/documents/:filename` | Download          |
| DELETE  | `/absences/:id/documents/:filename` | admin             |

Dokumente werden wie folgt gespeichert:

```
files/<absenceId>/<serverFilename>
```

---

## 📜 Logs

| Methode | Endpoint | Hinweise   |
| ------- | -------- | ---------- |
| GET     | `/logs`  | admin-only |

---

# 🔧 **Projektstruktur**

```
src/
 ├─ app.ts
 ├─ server.ts
 ├─ logger.ts
 ├─ config/
 ├─ controllers/
 ├─ middleware/
 ├─ repo/
 ├─ models/
 ├─ types/
 └─ routes/
files/
 └─ <absenceId>/
logs/
 ├─ combined.log
 └─ error.log
data/
 ├─ migrations/
 ├─ seeders/
 └─ database.sqlite3
cert/
 ├─ server.key
 └─ server.crt
```

---

# 🛠️ **Troubleshooting**

| Problem              | Ursache                  | Lösung                           |
| -------------------- | ------------------------ | -------------------------------- |
| 401 Unauthorized     | Kein Token gesendet      | Header setzen                    |
| 403 Forbidden        | Keine Admin-Rolle        | admin nutzen                     |
| Upload schlägt fehl  | falsches Multipart-Feld  | Feldname: `documents`            |
| Datei nicht gefunden | falscher filename        | filename aus GET-Liste verwenden |
| Seeders doppelt      | DB löschen → neu starten | `database.sqlite3` löschen       |



#  **Ablaufdiagramm**

![[assets/Diagram.svg]]
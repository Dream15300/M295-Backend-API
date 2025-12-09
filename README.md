
---

# **M295 – Backend API (Prüfungsprojekt)**

TypeScript · Express · HTTPS · JWT · File-Upload

Dieses Projekt ist das vollständige Backend für die Modulprüfung **M295 (Backend-API)**.
Es umfasst Authentifizierung, Rollen-Berechtigungen, Datei-Uploads, vollständiges File-CRUD sowie grundlegende API-Struktur nach Best Practice.

---

# 📌 **Inhalt**

* Überblick & Features
* Voraussetzungen
* Installation & Start
* Authentifizierung (JWT)
* Admin-Login
* File-CRUD (Upload, Download, Liste, Update, Delete)
* Testing mit Postman
* Projektstruktur
* Troubleshooting

---

# 🚀 **Überblick & Features**

* Node.js + **TypeScript** + **Express**
* **HTTPS-Server** (lokal, selbstsignierte Zertifikate)
* **JWT-Authentifizierung**
* Rollen-Berechtigung (**Admin** benötigt für POST/PUT/DELETE)
* **Datei-Upload** mit Multer (`uploads/images`)
* Vollständiges File-CRUD:

  * `POST /api/files` – Upload
  * `GET /api/files` – Liste aller Dateien
  * `GET /api/files/:filename` – Download
  * `PUT /api/files/:filename` – Datei ersetzen
  * `DELETE /api/files/:filename` – Datei löschen
* Saubere Layer-Architektur (Routing · Controller · Middleware)

---

# 📦 **Voraussetzungen**

* Node.js **18+**
* npm **9+**
* Lokales Zertifikat unter:

```
/cert/server.key
/cert/server.crt
```

---

# 🛠️ **Installation**

```bash
npm install
```

---

# ▶️ **Starten des Servers**

### **Entwicklung (TypeScript direkt)**

```bash
npm run dev
```

### **Produktion (dist/)**

```bash
npm start
```

Server läuft danach unter:

```
https://localhost:5001
```

---

# 🔐 **Authentifizierung (JWT)**

## **Admin-Credentials**

| E-Mail              | Passwort      | Rolle   |
| ------------------- | ------------- | ------- |
| `admin@example.com` | `hallo123456` | `admin` |

---

## 🔑 **Token erhalten**

**GET**

```
https://localhost:5001/api/auth/login
email = admin@example.com & password = hallo123456
```

### Beispiel-Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

# 🔐 **JWT in geschützten Routen verwenden**

Alle POST / PUT / DELETE für Dateien benötigen:

```
Authorization: Bearer <TOKEN>
```

---

# 🗂️ **File-CRUD (API-Dokumentation)**

Dateien werden gespeichert unter:

```
uploads/images/<filename>
```

### ✔ GET – **Alle Dateien**

```
GET /api/files
```

---

### ✔ GET – **Eine Datei herunterladen**

```
GET /api/files/:filename
```

Beispiel:

```
GET /api/files/background.jpg
```

Oder direkt aus dem Static-Host:

```
https://localhost:5001/uploads/images/background.jpg
```

---

### ✔ POST – **Datei hochladen (nur Admin)**

```
POST /api/files
```

### **Postman-Body: form-data**

| KEY  | TYPE | VALUE           |
| ---- | ---- | --------------- |
| file | File | Datei auswählen |

---

### ✔ PUT – **Datei ersetzen (nur Admin)**

```
PUT /api/files/:filename
```

Auch hier:

| KEY  | TYPE | VALUE      |
| ---- | ---- | ---------- |
| file | File | Neue Datei |

---

### ✔ DELETE – **Datei löschen (nur Admin)**

```
DELETE /api/files/:filename
```

---

# 🧪 **Testing via Postman**

## 1. Token holen

→ `GET /api/auth/login`

## 2. Token in Postman setzen:

**Authorization → Bearer Token**

## 3. File-CRUD testen

* `GET /api/files`
* `POST /api/files` (form-data → file)
* `GET /api/files/<name>`
* `PUT /api/files/<name>` (form-data → file)
* `DELETE /api/files/<name>`

## Typische Fehlerquellen:

* falscher Feldname (muss **file** heißen)
* kein Admin-Token

---

# 📁 **Projektstruktur**

```
└─ src/
   ├─ app.ts               
   ├─ server.ts            
   ├─ logger.ts
   ├─ routes/
   ├─ controllers/
   ├─ middleware/
   ├─ lib/
   ├─ repo/
   ├─ types/
   └─ config/
uploads/
└─ images/                 # Gespeicherte Dateien
cert/
└─ server.key / server.crt
data/
├─ migrations/
└─ seeders/
logs/
├─ combined.log
└─ error.log
```

---

# 🛠️ **Troubleshooting**

| Problem                      | Ursache               | Lösung                                               |
| ---------------------------- | --------------------- | ---------------------------------------------------- |
| Datei wird nicht hochgeladen | Form-Key nicht `file` | In Postman ändern                                    |
| 401 Unauthorized             | kein Token            | Bearer Token setzen                                  |
| 403 Forbidden                | Rolle ≠ admin         | [admin@example.com](mailto:admin@example.com) nutzen |
| Änderungen wirken nicht      | alter Build läuft     | `npm start`                         |

---

#  **Ablaufdiagramm**

![[assets/Diagram.svg]]
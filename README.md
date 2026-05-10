# Finantz

Ein modernes Self-Hosted Finanz-App-MVP mit Java Spring Boot Backend und React/Vite Frontend.

## Start

### Backend
1. In `backend`:
```bash
mvn spring-boot:run
```

### Frontend
1. In `frontend`:
```bash
npm install
npm run dev
```

### Login
- Standard-Benutzer: `admin`
- Standard-Passwort: `admin`
- Die App verwendet JWT-Token für alle API-Aufrufe.

### APIs
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/accounts`
- `GET /api/categories`
- `GET /api/transactions`
- `GET /api/dashboard`
- `POST /api/transactions`

## Docker
- `docker compose up --build`

## Ziele
- Einnahmen / Ausgaben
- Konten
- Kategorien
- Dashboard-Grundlage

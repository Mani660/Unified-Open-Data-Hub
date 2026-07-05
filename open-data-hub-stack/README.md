# Unified Open Data Hub for India

Full-stack scaffold for the problem statement:

- Frontend: HTML, CSS, JavaScript, Bootstrap 5
- Backend: Node.js, Express
- Database: MySQL
- Auth: JWT

## Run Locally

```bash
npm install
cp .env.example .env
npm run db:schema
npm run dev
```

Open `http://localhost:4000`.

## Main Features

- Search datasets by keyword
- Filter by domain, format, year, and state
- Dataset cards with metadata
- Dataset details preview table
- Download tracking endpoint
- JWT-protected admin add, edit, delete APIs


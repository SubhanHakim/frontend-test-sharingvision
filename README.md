# Tes Frontend Sharing Vision

Dashboard artikel: All Posts (tab Published / Drafts / Trashed), Add New, Edit, dan Preview dengan pagination.

- `frontend/` — React + Vite
- `backend/` — Express + SQLite (`node:sqlite`, tanpa setup database), butuh Node >= 22.13

## Menjalankan

```bash
# backend (http://localhost:8081)
cd backend
cp .env.example .env
npm install
npm start

# frontend (http://localhost:5173)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Port dan alamat API diatur lewat `PORT` (backend) dan `VITE_API_URL` (frontend).

## Endpoint

| Method | URL | Keterangan |
|---|---|---|
| GET | `/article/:limit/:offset` | list; opsional `?status=publish\|draft\|thrash`, total di header `X-Total-Count` |
| GET | `/article/:id` | detail |
| POST | `/article/` | buat artikel |
| PUT / PATCH | `/article/:id` | edit; field yang tidak dikirim tetap memakai nilai lama |
| DELETE | `/article/:id` | hapus permanen |

Body: `{ "title", "content", "category", "status": "publish" | "draft" | "thrash" }`.

## Test

```bash
cd backend && npm test
```

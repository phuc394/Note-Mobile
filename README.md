# Note-Mobile

Note-Mobile la ung dung ghi chu chay local voi:

- Frontend: React Native/Expo
- Backend: ExpressJS
- Database: MySQL local

## Chay local

### 1. Tao database

Mo MySQL va chay file:

```text
Scripts.sql
```

File nay tao database mac dinh `note_mobile_db` va cac bang can thiet.

### 2. Chay backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend mac dinh chay tai `http://localhost:3000`.

Neu MySQL cua ban khong dung `root` hoac co mat khau, sua `backend/.env`.

### 3. Chay frontend

```bash
cd frontend
npm install
npm start
```

Voi Expo tren thiet bi that, neu can goi backend tu dien thoai, hay dung IP LAN cua may tinh thay vi `localhost`.

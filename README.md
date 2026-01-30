# Interest Calculator (React + Node + AWS S3 + MongoDB)

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Storage: AWS S3 (transaction screenshot uploads)
- Auth: JWT
- Notifications: node-cron (daily generation) + on-demand generation

## 1) Prerequisites
- Node.js 18+
- MongoDB (local) **or** Docker (for compose)
- AWS S3 bucket + IAM user credentials

## 2) Start MongoDB
### Option A: Docker
```bash
docker compose up -d
```

### Option B: Local MongoDB
Ensure MongoDB is running on `mongodb://127.0.0.1:27017`.

## 3) Backend setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Set AWS variables in `server/.env`:
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- S3_BUCKET
- S3_PUBLIC_BASE_URL  (example: https://YOUR_BUCKET.s3.ap-south-1.amazonaws.com)

Backend health check:
- http://localhost:5000/health

## 4) Frontend setup
```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```

Open:
- http://localhost:5173

## 5) Features
- Register/Login (JWT)
- Accounts CRUD (create + list)
- Transactions CRUD (create + list)
- Interest calculation: Simple + Compound, monthly/yearly
- Partial payments: add payments against a transaction (auto-close when fully paid)
- Screenshot upload to AWS S3 (stored in MongoDB)
- Notifications: due soon (<=3 days) and overdue (<0), generated daily and on-demand

## 6) Notes for AWS S3
- Bucket should allow public read **OR** use CloudFront / presigned URLs.
- This project stores public URLs using `S3_PUBLIC_BASE_URL` + key.



## FrontEnd Deployed Link
https://interest-calculator-one-beryl.vercel.app/

## BackEnd Deployed Link
https://interest-calculator-backend.vercel.app/

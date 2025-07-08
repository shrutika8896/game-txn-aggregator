# 🕹️ Game Transaction Aggregator (NestJS + MongoDB)

This microservice collects game transaction data from a mocked API, aggregates per-user balances, and exposes useful endpoints.

## Features
- 🧠 MongoDB persistence
- ⏱️ Cron (every 12s) to fetch transaction data
- 🧾 Aggregates: earned, spent, payout, paidOut, balance
- 🔄 Resumable & scalable

## Requirements
- Node.js 18+
- Docker

## Getting Started
```bash
# Clone the repo
https://github.com/<your-username>/game-txn-aggregator.git
cd game-txn-aggregator

# Start MongoDB
docker-compose up -d

# Install deps
npm install

# Run the app
npm run start:dev
```

## API Endpoints
```http
GET /user/:userId/summary     → user aggregation
GET /payouts                  → list of requested payouts
```

---

## Deployment
1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/game-txn-aggregator.git
git push -u origin main
```
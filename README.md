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

📘 Implementation Overview
🧩 Architecture & Approach
This microservice fetches game transactions from a mocked API, aggregates them per user, and persists the results in MongoDB. It avoids storing individual transactions and instead focuses on maintaining summary statistics such as:
earned
spent
payout
paidOut
balance

A cron-based background job runs every 12 seconds and fetches up to 5 pages (1000 transactions each) using an afterId pointer. This ID is stored in MongoDB (sync_state collection) to ensure resumption in case of service restarts.

Data is exposed via:
/user/:userId/summary: Returns balance and aggregation
/payouts: Returns users who requested payouts, aggregated per user

✅ Assumptions
- Transactions are returned in chronological order and contain a unique, sortable id.
- The external transaction API supports pagination using afterId (or can be adapted to).
- No transaction retry or deduplication logic needed — all transactions are unique and processed exactly once.
- Transactions older than afterId are guaranteed to have already been processed.

🔮 Future Scope
⏳ Backfill/Replay Mechanism
To handle overload spikes, a replay queue can be added to process missed data.
🗂️ User Metadata Integration
User profiles or bank data can be merged with aggregates.
📦 Distributed Worker Support
Add job queues (e.g. BullMQ) and workers to parallelize aggregation at scale.
🧪 Testing & Monitoring
Add integration tests, observability (e.g. Prometheus), and logging pipelines.
🧰 Swagger/OpenAPI Docs
Add endpoint documentation for easier integration.








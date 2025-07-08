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
curl requests:
```
curl --location --request GET 'http://localhost:3000/user/074093/summary' \
--header 'Content-Type: application/json' \
--data '{
    "username": "shrutika"
}'

curl --location --request GET 'http://localhost:3000/payouts' \
--header 'Content-Type: application/json' \
--data '{
    "username": "shrutika"
}'
```

## Implementation Overview
#### Architecture & Approach
This microservice fetches game transactions from a mocked API, aggregates them per user, and persists the results in MongoDB. It avoids storing individual transactions and instead focuses on maintaining summary statistics such as:
earned
spent
payout
paidOut
balance

A cron-based background job runs every 12 seconds and fetches up to 5 pages (1000 transactions each) using an afterId pointer. This ID is stored in MongoDB (sync_state collection) to ensure resumption in case of service restarts.

#### Assumptions
- Transactions are returned in chronological order and contain a unique, sortable id.
- The external transaction API supports pagination using afterId (or can be adapted to).
- No transaction retry or deduplication logic needed — all transactions are unique and processed exactly once.
- Transactions older than afterId are guaranteed to have already been processed.

## Scaling
### Running Multiple Aggregators in Parallel
If you want to horizontally scale the aggregator service by running multiple instances in parallel, `afterId`-based pagination must be adjusted to avoid duplication or data loss.

The current implementation assumes a single global `afterId` pointer. If multiple instances use this shared cursor, it can cause:
- Duplicate transaction processing
- Skipped transactions
- Race conditions updating `afterId`

#### Replace `afterId` with a Distributed Job Queue
Use a job queue like **BullMQ**, **RabbitMQ**, or **Kafka** to split fetch jobs by ID or time. Each worker processes its own batch without relying on a shared pointer.

#### Use a Locking Cursor If Staying with afterId
If sticking to `afterId`, introduce a **lock mechanism**:
- A shared `sync_state` doc tracks the cursor
- Workers acquire the lock, process a page, update `afterId`, release

### Separate out read aggregator logic in a different microservice 
- Heavy reads can slow down aggregation
- Simplify scaling
- Use MongoDB read replicas

## Testing
- **Unit Tests**: Validate core logic (e.g., aggregation, payout calculation)
- **Integration Tests**: Test MongoDB operations and API response structure
- **E2E Tests**: Verify full flow from API → DB → Aggregated response
- **Load Tests**: Stress test endpoints to simulate high user traffic
- **Static Analysis**: Type checks (TypeScript), code style, linting

#### TDD Approach
1. Write failing test for each unit:
  Aggregator logic (e.g., "earned + spent = balance")
  Pagination from API using afterId
  Payout summarization
  Deduplication
2. Implement logic minimally to pass test
3. Refactor for clarity, performance
4. Repeat



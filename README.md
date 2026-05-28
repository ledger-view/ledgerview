# LedgerView

Personal finance dashboard. Track accounts, transactions, and spending across currencies.

**Live:** https://ledger-view.github.io/ledgerview  
**Backend:** https://github.com/ledger-view/ledgerview-backend

---

## Features

- **Dashboard** — balance overview, monthly income/expenses, net flow per currency, interactive charts (mirror bars, area, waterfall, heatmap)
- **Accounts** — checking, savings, cash, crypto; opening balance locked after creation
- **Transactions** — paginated table with filters (type, account, category, date range), sort by date/amount/description
- **Categories** — grouped by type (income/expense/transfer), color-coded, used in charts
- **Collapsible sidebar** — persists open/closed state
- **Authentication** — Keycloak OIDC (PKCE)

---

## Running locally

### Prerequisites

- Node 24 (`nvm use 24`)
- Java 21
- PostgreSQL running on `localhost:5432` with database `ledgerview`, user `admin`, password `password`
- Keycloak running on `localhost:8180` with realm `ledgerview` imported from `ledgerview-backend/environments/keycloak/realm.json`

### Backend

```bash
cd ledgerview-backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=localdev
```

### Frontend

```bash
cd ledgerview
npm install
npm run start:proxy-local
```

App runs at `https://localhost:4443`.

---

## Deployment

See [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md).


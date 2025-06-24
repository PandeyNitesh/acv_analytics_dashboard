# ACV Analytics Dashboard

This project is a full-stack ACV (Annual Contract Value) analytics dashboard built with the following technologies:

- **Frontend**: React + TypeScript + Redux + D3.js + Material UI
- **Backend**: Node.js + Express
- **Data**: Multiple structured JSON files (`customer_type.json`, `acv_range.json`, `account_industry.json`, `team.json`)

## 📊 Features

- D3.js-based **stacked bar chart** grouped by fiscal quarters and customer type.
- Interactive **donut chart** displaying ACV breakdown.
- Material UI-powered table listing all raw ACV entries.
- Responsive layout with rich tooltips and data annotations.
- Backend API that processes and serves aggregated data dynamically.

## 🗂 Project Structure

```
.
├── backend/
│   ├── controllers/
│   │   └── data.controller.ts
│   ├── routes/
│   │   └── data.routes.ts
│   ├── data/
│   │   ├── customer_type.json
│   │   ├── acv_range.json
│   │   ├── account_industry.json
│   │   └── team.json
│   └── server.ts
│
├── frontend/
│   ├── components/
│   │   ├── StackedBarChart.tsx
│   │   ├── DonutChart.tsx
│   │   └── TableComponent.tsx
│   ├── redux/
│   │   ├── chartSlice.ts
│   │   └── store.ts
│   ├── pages/
│   │   └── Dashboard.tsx
│   └── App.tsx
│
└── README.md
```

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`.

## 📡 API Endpoint

- `GET /api/data/acv-by-quarter`  
  Returns aggregated ACV data grouped by `fiscal_quarter` and `customer_type`.

## 🛠 Technologies Used

| Layer    | Stack                                                |
| -------- | ---------------------------------------------------- |
| Frontend | React, TypeScript, Redux Toolkit, D3.js, Material UI |
| Backend  | Express.js, TypeScript, Node.js                      |
| Charts   | D3.js (custom rendered SVG)                          |
| Data     | JSON (mocked structured input)                       |

## 📷 Sample UI Screens

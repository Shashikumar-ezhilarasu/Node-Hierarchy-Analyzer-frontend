# Node Hierarchy Analyzer — Frontend

A modern, responsive single-page application built with **Next.js 15 + TypeScript** that
provides an interactive interface for the Node Hierarchy Analyzer API. Paste directed
edges, hit Analyze, and instantly see parsed trees, cycle flags, invalid entries, and
summary statistics — all in a clean structured layout.

**Live App →** https://node-hierarchy-analyzer-frontend.vercel.app
**Backend API →** https://shashikumar-ezhilarasu-bfhl.onrender.com/bfhl

---

## Features

- **Input Panel** — textarea that accepts one edge per line (`A->B`) or comma-separated
- **Live API Call** — hits `POST /bfhl` on the hosted backend with full error handling
- **Hierarchy Cards** — each independent tree rendered as a structured nested view
- **Cycle Badges** — cyclic groups clearly flagged with a visual indicator
- **Invalid & Duplicate Pills** — invalid entries and duplicate edges shown as labelled tags
- **Summary Strip** — total trees, total cycles, and largest tree root at a glance
- **Error State** — clear message if the API is unreachable or returns unexpected data
- **Responsive Design** — works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Linting | ESLint |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
git clone https://github.com/Shashikumar-ezhilarasu/Node-Hierarchy-Analyzer-frontend.git
cd Node-Hierarchy-Analyzer-frontend
npm install
```

### Environment Setup

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=https://shashikumar-ezhilarasu-bfhl.onrender.com
```

To run against a local backend instead:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main SPA — input, submission, result rendering
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
└── public/               # Static assets
```

---

## API Reference

The frontend communicates with the backend via a single endpoint:

**POST** `{NEXT_PUBLIC_API_URL}/bfhl`

**Request**

```json
{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello", "1->2"]
}
```

**Response (success)**
```json
{
  "user_id": "shashikumar_ezhilarasu_ddmmyyyy",
  "email_id": "se@srmist.edu.in",
  "college_roll_number": "RA23XXXXXXX",
  "hierarchies": [
    { "root": "A", "tree": { "A": { "B": {}, "C": {} } }, "depth": 2 },
    { "root": "X", "tree": {}, "has_cycle": true }
  ],
  "invalid_entries": ["hello", "1->2"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

The UI renders each field above in a dedicated section with appropriate visual treatment.

---

## Sample Inputs to Try

Paste any of these into the input field:

```
A->B, A->C, B->D, C->E, E->F
```
*Expected: One tree rooted at A with depth 4*

```
X->Y, Y->Z, Z->X
```
*Expected: One cyclic group, no depth*

```
A->B, A->B, A->C, hello, 1->2, A->
```
*Expected: Duplicate edge, 3 invalid entries*

---

## Deployment

This app is deployed on **Vercel** with automatic deployments on every push to `main`.

To deploy your own fork:
1. Push to GitHub
2. Connect the repo on [vercel.com](https://vercel.com)
3. Add `NEXT_PUBLIC_API_URL` in Vercel → Settings → Environment Variables
4. Deploy — done

---

## Related

- **Backend Repository** →
  https://github.com/Shashikumar-ezhilarasu/Node-Hierarchy-Analyzer--backend
- **Backend API Docs** → see backend README for full algorithmic breakdown,
  O(V+E) complexity analysis, and curl test suite

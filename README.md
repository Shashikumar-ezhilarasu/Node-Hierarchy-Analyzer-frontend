# Node Hierarchy Analyzer - Frontend

This is the frontend application for the Node Hierarchy Analyzer, built with Next.js. It provides a clean, responsive interface to submit graph edge data, visualize hierarchical trees, and analyze graph properties such as cycles and connectivity.

## 🚀 Features

- **Interactive Edge Input**: Submit parent-child relationships (e.g., `A->B`) via an intuitive text interface.
- **Hierarchical Visualization**: Displays processed trees with depth information and root identification.
- **Cycle Detection Alerts**: Clearly flags graph components that contain cycles to prevent infinite loops.
- **Input Validation**: Automatically filters invalid entries and identifies duplicate edges.
- **Live Summary**: Shows total trees found, total cycles detected, and identifies the largest tree root.
- **Raw JSON Viewer**: Includes a built-in JSON inspector to view the complete API response for verification.

## 🛠 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Modern CSS with a clean, terminal-inspired monospace aesthetic.
- **API Communication**: Fetch API with asynchronous state management.

## ⚙️ Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shashikumar-ezhilarasu/Node-Hierarchy-Analyzer-frontend.git
   cd Node-Hierarchy-Analyzer-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   The app is pre-configured to point to the production backend. To use a custom backend, create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/bfhl
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

```text
src/
├── app/
│   ├── layout.tsx     # Root layout and font configuration
│   ├── page.tsx       # Main entry page
│   └── globals.css    # Global styling
└── components/
    └── GraphAnalyzer.tsx # Core logic: UI state, API calls, and result rendering
```

## 🔗 API Integration

The frontend integrates with the [Node Hierarchy Analyzer Backend](https://github.com/Shashikumar-ezhilarasu/Node-Hierarchy-Analyzer--backend) hosted on Render. It sends a list of edges and receives a structured breakdown of the resulting forest, including trees, cycles, and metadata.

---
Developed by **Shashikumar Ezhilarasu**

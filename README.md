# HR Workflow Designer

> A visual, drag-and-drop HR workflow builder built for Tredence Studio's Full Stack Engineering Internship case study.

**🔗 Live Demo:** `https://hr-workflow-designer.vercel.app`
**🗓 Built in:** ~5 hours  
**Stack:** React · TypeScript · React Flow · Zustand · Zod · react-hook-form · MSW · Tailwind CSS · Vite

---

## What it does

HR admins can visually design internal workflows (onboarding, leave approval, document verification) by dragging nodes onto a canvas, configuring each step via a dynamic form panel, and running a simulated step-by-step execution — all without a backend.

---

## Screenshots

> *(Add a GIF or screenshot of your canvas here — drag and drop a .gif or .png into the GitHub editor)*

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Shell (Vite + React)                 │
│                                                                 │
│  ┌──────────────┐   ┌──────────────────────┐   ┌────────────┐  │
│  │  Left Sidebar│   │   React Flow Canvas  │   │Right Panel │  │
│  │              │   │                      │   │            │  │
│  │ Node Palette │──▶│  Custom Nodes        │──▶│ Node Form  │  │
│  │ (drag source)│   │  (Start/Task/        │   │ (per type) │  │
│  │              │   │   Approval/Auto/End) │   │            │  │
│  └──────────────┘   └──────────┬───────────┘   └─────┬──────┘  │
│                                │                      │         │
│                         ┌──────▼──────────────────────▼──────┐  │
│                         │         Zustand Store               │  │
│                         │  nodes | edges | selectedNodeId     │  │
│                         │  simulationLog | validationErrors   │  │
│                         └──────────────────┬────────────────┘  │
│                                            │                   │
│  ┌─────────────────────────────────────────▼─────────────────┐ │
│  │                 Bottom: Simulation Panel                   │ │
│  │   [Run Simulation] → POST /api/simulate → Execution Log   │ │
│  └─────────────────────────────────────────────────────────── ┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               MSW Mock API Layer (browser)               │   │
│  │    GET /api/automations   POST /api/simulate             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── nodes/                  # One file per node type (component + types)
│   ├── StartNode.tsx
│   ├── TaskNode.tsx
│   ├── ApprovalNode.tsx
│   ├── AutomatedStepNode.tsx
│   └── EndNode.tsx
│
├── forms/                  # Config form per node type
│   ├── StartForm.tsx
│   ├── TaskForm.tsx
│   ├── ApprovalForm.tsx
│   ├── AutomatedStepForm.tsx
│   └── EndForm.tsx
│
├── registry/               # NODE_REGISTRY — central node type map
│   └── nodeRegistry.ts
│
├── store/                  # Zustand global state
│   └── workflowStore.ts
│
├── api/                    # MSW mock handlers
│   ├── handlers.ts
│   └── browser.ts
│
├── hooks/                  # Custom React hooks
│   ├── useWorkflow.ts      # canvas helpers (add/remove/update nodes)
│   └── useSimulate.ts      # calls /api/simulate, manages log state
│
├── types/                  # All TypeScript interfaces and Zod schemas
│   └── index.ts
│
├── components/             # Shared UI components
│   ├── Sidebar.tsx         # Node type palette
│   ├── NodeConfigPanel.tsx # Right panel wrapper (renders correct form)
│   └── SimulationPanel.tsx # Bottom panel with log
│
└── App.tsx                 # Layout shell, React Flow provider
```

---

## Implementation Plan

This section documents the step-by-step build plan followed during development.

### Phase 1 — Project Scaffold (30 min)

- [x] Init Vite + React + TypeScript: `npm create vite@latest hr-workflow-designer -- --template react-ts`
- [x] Install dependencies:
  ```bash
  npm install reactflow zustand react-hook-form zod @hookform/resolvers
  npm install -D tailwindcss msw @types/node
  npx tailwindcss init
  npx msw init public/
  ```
- [x] Configure Tailwind with dark theme (`darkMode: 'class'`)
- [x] Set up MSW service worker in `src/api/browser.ts` and start it in `main.tsx`

---

### Phase 2 — Type System & NODE_REGISTRY (30 min)

- [x] Define base TypeScript interfaces in `src/types/index.ts`:
  ```ts
  // Every node in the workflow extends this
  interface BaseNodeData {
    label: string;
    nodeType: NodeType;
  }

  type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';
  ```
- [x] Define Zod schema per node type (used for both form validation and TS inference)
- [x] Build `NODE_REGISTRY` in `src/registry/nodeRegistry.ts`:
  ```ts
  // Adding a new node type = one new entry here, zero changes elsewhere
  export const NODE_REGISTRY: Record<NodeType, NodeRegistryEntry> = {
    start:    { component: StartNode,         form: StartForm,         schema: startSchema,     icon: '▶', color: '#22c55e' },
    task:     { component: TaskNode,          form: TaskForm,          schema: taskSchema,      icon: '📋', color: '#3b82f6' },
    approval: { component: ApprovalNode,      form: ApprovalForm,      schema: approvalSchema,  icon: '✅', color: '#f59e0b' },
    automated:{ component: AutomatedStepNode, form: AutomatedStepForm, schema: automatedSchema, icon: '⚡', color: '#8b5cf6' },
    end:      { component: EndNode,           form: EndForm,           schema: endSchema,       icon: '⏹', color: '#ef4444' },
  };
  ```

---

### Phase 3 — Zustand Store (20 min)

- [x] Create `src/store/workflowStore.ts` with:
  ```ts
  interface WorkflowStore {
    nodes: Node[];
    edges: Edge[];
    selectedNodeId: string | null;
    simulationLog: SimStep[];
    validationErrors: string[];

    // Actions
    addNode: (type: NodeType, position: XYPosition) => void;
    updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
    setSelectedNode: (id: string | null) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    setSimulationLog: (log: SimStep[]) => void;
    setValidationErrors: (errors: string[]) => void;
  }
  ```
- [x] No React context needed — Zustand store is imported directly into components

---

### Phase 4 — Custom React Flow Nodes (45 min)

Each node is a React Flow custom node with:
- Colored left border strip (from registry color)
- Icon + label
- Source/target handles positioned correctly
- Visual ring highlight when selected
- Red ring when it has a validation error

- [x] `StartNode` — single source handle, no target handle
- [x] `TaskNode` — target + source handles, shows assignee badge
- [x] `ApprovalNode` — target + source handles, shows approver role badge
- [x] `AutomatedStepNode` — target + source handles, shows selected action label
- [x] `EndNode` — single target handle, no source handle

Register all in React Flow's `nodeTypes` map:
```ts
const nodeTypes = Object.fromEntries(
  Object.entries(NODE_REGISTRY).map(([type, entry]) => [type, entry.component])
);
```

---

### Phase 5 — Node Configuration Forms (60 min)

The highest-signal part of the submission. Each form uses `react-hook-form` + `zodResolver`.

- [x] `NodeConfigPanel` reads `selectedNodeId` from store, looks up node type, renders the correct form from `NODE_REGISTRY`
- [x] All forms auto-save to the Zustand store `onBlur` (no submit button needed)
- [x] `AutomatedStepForm` fetches `GET /api/automations` on mount, populates action dropdown, then renders dynamic parameter fields based on the selected action's `params` array
- [x] Key-value pair custom fields on Start and Task nodes use a `useFieldArray` pattern

Form state flow:
```
User types → react-hook-form (local) → onBlur → updateNodeData (Zustand) → node re-renders on canvas
```

---

### Phase 6 — MSW Mock API (30 min)

- [x] `GET /api/automations` — returns 4 mock actions:
  ```json
  [
    { "id": "send_email",    "label": "Send Email",        "params": ["to", "subject", "body"] },
    { "id": "generate_doc",  "label": "Generate Document", "params": ["template", "recipient"] },
    { "id": "send_slack",    "label": "Send Slack Message","params": ["channel", "message"] },
    { "id": "create_ticket", "label": "Create Ticket",     "params": ["title", "assignee"] }
  ]
  ```

- [x] `POST /api/simulate` — receives serialized workflow JSON, runs a topological BFS traversal, returns execution steps:
  ```json
  [
    { "step": 1, "nodeId": "node-1", "label": "Employee Onboarding Start", "status": "completed", "duration": 0 },
    { "step": 2, "nodeId": "node-2", "label": "Collect Documents",         "status": "completed", "duration": 1200 },
    { "step": 3, "nodeId": "node-3", "label": "Manager Approval",          "status": "pending",   "duration": null }
  ]
  ```

---

### Phase 7 — Simulation Panel (30 min)

- [x] Serializes entire graph from Zustand store
- [x] Validates before calling API:
  - Must have exactly one Start node
  - Must have at least one End node
  - No isolated nodes (every node must be connected)
  - No cycles (checked via DFS)
- [x] Calls `POST /api/simulate` via `useSimulate` hook
- [x] Renders step-by-step execution log as a timeline with status badges (completed / pending / failed)
- [x] Validation errors shown above the Run button, and as red rings on offending nodes

---

### Phase 8 — Sidebar & Drag-to-Canvas (30 min)

- [x] Left sidebar renders a draggable card for each node type (from `NODE_REGISTRY`)
- [x] Uses React Flow's `onDrop` + `onDragOver` handlers to detect drop position and call `addNode(type, position)`
- [x] Canvas snaps dropped nodes to a 20px grid

---

### Phase 9 — Bonus Features (if time permitted)

- [x] **Export/Import JSON** — toolbar button serializes `{ nodes, edges }` to a `.json` file download; import reads the file and replaces store state
- [ ] Undo/Redo — would implement with `useHistory` wrapping store mutations
- [ ] Auto-layout — would use `dagre` library for automatic left-to-right graph layout
- [ ] Minimap — React Flow built-in `<MiniMap />` component, trivial to add

---

### Phase 10 — Deploy (15 min)

- [x] `vite.config.ts` base path set to `/`
- [x] MSW service worker (`mockServiceWorker.js`) in `/public` — committed to repo so Vercel serves it
- [x] Deployed to Vercel via GitHub integration (auto-deploy on push to `main`)

---

## How to Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/hr-workflow-designer
cd hr-workflow-designer
npm install
npm run dev
```

Open `http://localhost:5173`

> MSW starts automatically in development. No separate server needed.

---

## Key Design Decisions

**Why `NODE_REGISTRY`?**  
A central registry means adding a new node type (e.g., a `ConditionNode` for branching logic) requires creating one component file, one form file, one Zod schema, and one registry entry — zero changes to the canvas, sidebar, config panel, or simulation engine. This is the kind of abstraction that scales to a real product.

**Why Zustand over React Context?**  
React Flow re-renders frequently as nodes are dragged. Context-based state would trigger expensive re-renders across the entire tree. Zustand's subscription model means only the components that actually consume a piece of state re-render. It also makes async side effects (API calls in hooks) much simpler than `useReducer` + Context.

**Why MSW over json-server?**  
MSW intercepts fetch requests at the Service Worker level — no separate process, no port conflicts, and it works identically in the browser and on Vercel preview deployments. json-server would require a separate backend and wouldn't work on Vercel's serverless platform without additional config.

**Why Zod schemas per node type?**  
Each Zod schema is the single source of truth for both TypeScript types (via `z.infer`) and runtime form validation. This eliminates the common pattern of maintaining separate interface definitions and validation logic that can diverge.

**Why `react-hook-form` over controlled inputs?**  
`react-hook-form` uses uncontrolled inputs internally, which means zero re-renders while the user is typing. Only `onBlur` triggers a store update. On a canvas with many nodes, this prevents janky re-renders across the entire graph while someone is filling in a form field.

**Simulation engine — topological BFS:**  
The mock `/simulate` endpoint runs a BFS traversal from the Start node, following edges in order. This naturally handles branching (multiple outgoing edges) and correctly rejects cyclic graphs before execution begins. The traversal logic lives in the MSW handler so the real backend can later replace it with the same interface.

---

## What I'd Add With More Time

| Feature | Approach |
|---|---|
| Undo / Redo | Wrap Zustand mutations with a `past[]` / `future[]` history stack |
| Auto-layout | `dagre` library — compute node positions from graph topology, one button click |
| Condition / Branch node | New registry entry, form with true/false branch labels, two source handles |
| Node validation errors on canvas | Already architected — store holds `validationErrors: string[]` keyed by node ID |
| Workflow templates | Predefined `{ nodes, edges }` JSON loaded via the import flow |
| Persistent storage | Replace Zustand in-memory store with `zustand/middleware/persist` + localStorage |
| Real backend | Swap MSW handlers for FastAPI endpoints — the fetch calls in hooks don't change |

---

## Author

**Diana** — ML Engineer & Full Stack Developer  
Built for Tredence Studio AI Engineering Internship — 2025 Cohort

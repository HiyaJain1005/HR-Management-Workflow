---

# 🧠 HR Workflow Designer — Visual Automation Engine

A modular, extensable **HR Workflow Designer** built using **React + React Flow**, enabling HR admins to visually design, configure, and simulate workflows like onboarding, approvals, and automated processes.

🔗 **Live Demo:** [https://hr-management-workflow.vercel.app/](https://hr-management-workflow.vercel.app/)
💡 Built with a focus on **scalability, architecture, and real-world workflow modeling**

---

## 🚀 Problem Statement

Modern HR systems rely heavily on workflow automation to reduce manual effort and improve operational efficiency.

This project introduces a **visual workflow builder** that transforms complex business processes into an intuitive, drag-and-drop interface.

---

## ✨ Features

* 🧩 Drag-and-drop workflow canvas (React Flow)
* 🔧 Multiple custom node types
* ⚙️ Dynamic node configuration panels
* 🔄 Real-time graph editing (connect, delete, update)
* 🔌 Mock API integration
* 🧪 Workflow simulation sandbox
* ✅ Basic workflow validation (structure & logic)

---

## 🏗️ Project Architecture

Designed with **clean separation of concerns** and **scalability-first principles**.

```
src/
│
├── components/   # Canvas, Sidebar, Panels
├── nodes/        # Custom node implementations
├── forms/        # Dynamic configuration forms
├── hooks/        # Custom hooks (state & logic)
├── store/        # Global state management
├── services/     # API abstraction layer
├── utils/        # Graph helpers & validators
├── types/        # TypeScript interfaces
└── App.tsx
```

### 🔑 Key Principles

* **Modularity** → Independent, reusable node systems
* **Type Safety** → Strong TypeScript contracts
* **Extensibility** → Easily add new nodes/actions
* **Maintainability** → Clear separation of UI, logic, and data

---

## 🧩 Node Types

| Node Type        | Description                             |
| ---------------- | --------------------------------------- |
| 🚀 Start Node    | Workflow entry point                    |
| 🧑‍💼 Task Node  | Human tasks (e.g., document collection) |
| ✅ Approval Node  | Decision/approval step                  |
| ⚡ Automated Node | System-triggered actions                |
| 🏁 End Node      | Workflow completion                     |

---

## 🧾 Node Configuration System

Each node opens a **dynamic configuration panel**.

### 🧑‍💼 Task Node

* Title *(required)*
* Description
* Assignee
* Due date
* Custom key-value fields

### ✅ Approval Node

* Approver role
* Auto-approval threshold

### ⚡ Automated Node

* Action selection (via API)
* Dynamic parameters (schema-driven)

---

## 🔌 Mock API Layer

### `GET /automations`

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]
```

### `POST /simulate`

* Accepts workflow JSON
* Returns step-by-step execution logs

---

## 🧪 Workflow Simulation Engine

* Serializes workflow graph
* Sends it to the mock API
* Displays execution timeline & logs

### ✅ Validations

* Missing connections
* Cyclic dependencies
* Invalid workflow structures

---

## 🧠 Key Design Decisions

* **React Flow** → Flexible & efficient graph rendering
* **Dynamic Forms** → Schema-driven configuration system
* **API Abstraction** → Decoupled frontend/backend
* **Component Isolation** → Easier debugging & scalability

---

## ⚙️ Getting Started

```bash
git clone https://github.com/HiyaJain1005/HR-Management-Workflow
cd HR-Management-Workflow
npm install
npm run dev
```

---

## ✅ Implemented

* Workflow canvas (drag-and-drop)
* Custom node system
* Dynamic configuration panels
* Mock API integration
* Simulation sandbox
* Basic validation logic

---

## 🚧 Future Enhancements

* 🔁 Undo / Redo
* 🧭 Auto-layout (graph algorithms)
* 🚨 Visual error indicators
* 📤 JSON import/export
* 🗄️ Backend integration (FastAPI + DB)
* 🤝 Real-time collaboration (WebSockets)

---

## 🧨 Key Engineering Challenge

### Dynamic Form Rendering for Automated Nodes

**Problem:**
Each automation has a different parameter schema.

**Solution:**

* Schema-driven rendering engine
* Config-based dynamic field generation
* Strong TypeScript typing

**Impact:**

* Plug-and-play automation system
* No UI changes needed for new actions

---

## 📌 Assumptions

* No backend persistence
* No authentication layer
* Focus on architecture over UI polish

---

## 🎯 What This Project Demonstrates

* Scalable React architecture
* Real-world workflow modeling
* Clean state management
* Strong component design
* Ability to ship production-ready systems quickly

---

## 👤 Author

**Hiya Jain**

---

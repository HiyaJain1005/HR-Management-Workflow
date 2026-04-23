# 🧠 HR Workflow Designer — Visual Automation Engine

A modular, extensible **HR Workflow Designer** built using **React + React Flow**, enabling HR admins to visually design, configure, and simulate internal workflows such as onboarding, approvals, and automated actions.

🔗 **Live Demo:** https://hr-management-workflow.vercel.app/

> Built with a focus on architecture, scalability, and real-world workflow modeling.

---

## 🚀 What This Solves

Modern HR systems depend on workflow automation to reduce manual effort and improve operational efficiency.  
This project provides a **visual workflow builder** that simplifies complex process design into an intuitive interface.

---

## ✨ Core Features

- Drag-and-drop workflow canvas (React Flow)
- Multiple custom node types
- Dynamic node configuration forms
- Real-time graph editing (connect, delete, update)
- Mock API integration
- Workflow simulation sandbox
- Basic validation (structure + flow rules)

---

## 🏗️ Architecture

Designed with clean separation of concerns and scalability-first thinking.
src/
│
├── components/ # Canvas, Sidebar, Panels
├── nodes/ # Custom node implementations
├── forms/ # Dynamic configuration forms
├── hooks/ # Custom hooks (state, logic)
├── store/ # Global state management
├── services/ # API abstraction layer
├── utils/ # Graph helpers & validators
├── types/ # TypeScript interfaces
└── App.tsx


### Key Principles

- Modularity → Independent node systems  
- Type Safety → Strong TypeScript contracts  
- Extensibility → Easy to add new nodes/actions  
- Maintainability → Clean separation of UI, logic, and data  

---

## 🧩 Node Types

| Node Type            | Description |
|---------------------|------------|
| Start Node          | Workflow entry point |
| Task Node           | Human task (e.g., document collection) |
| Approval Node       | Decision/approval step |
| Automated Step Node | System-triggered action |
| End Node            | Workflow completion |

---

## 🧾 Node Configuration System

Each node opens a dynamic configuration panel.

### Task Node
- Title (required)
- Description
- Assignee
- Due Date
- Custom key-value fields

### Approval Node
- Approver role
- Auto-approval threshold

### Automated Node
- Action selection (from API)
- Dynamic parameters (based on schema)

---

## 🔌 Mock API Layer

### GET `/automations`

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]

##POST `/simulate`

- Accepts workflow JSON  
- Returns step-by-step execution logs  

---

## 🧪 Workflow Simulation Engine

- Serializes workflow graph  
- Sends to mock API  
- Displays execution timeline/logs  
- Validates:
  - Missing connections  
  - Cycles  
  - Invalid structures  

---

## 🧠 Design Decisions

- **React Flow** → Efficient and flexible graph rendering  
- **Dynamic Forms** → Schema-driven, scalable configuration  
- **API Abstraction** → Decouples UI from backend  
- **Component Isolation** → Improves maintainability and debugging  

---

## ⚙️ How to Run Locally

```bash
git clone https://github.com/HiyaJain1005/HR-Management-Workflow
cd HR-Management-Workflow
npm install
npm run dev

## ✅ What’s Implemented

- Workflow canvas (drag-and-drop)  
- Custom node system  
- Dynamic configuration forms  
- Mock API integration  
- Simulation sandbox  
- Basic validation  

---

## 🚧 Future Enhancements

- Undo / Redo  
- Auto-layout (graph algorithms)  
- Visual error indicators on nodes  
- JSON import/export  
- Backend integration (FastAPI + DB)  
- Real-time collaboration (WebSockets)  

---

## 🧨 Key Engineering Challenge

### Dynamic Form Rendering for Automated Nodes

**Problem:**  
Each automation has a different parameter schema.  

**Solution:**  
- Schema-driven rendering system  
- Config-based dynamic field generation  
- Strong TypeScript typing  

**Impact:**  
- Plug-and-play automation system  
- No UI changes required for new actions  

---

## 📌 Assumptions

- No backend persistence required  
- No authentication included  
- Focus on functionality and architecture over UI polish  

---

## 🎯 What This Demonstrates

- Strong React architecture  
- Real-world workflow modeling  
- Scalable component design  
- Clean state management  
- Ability to ship quickly with clarity  

---

## 👤 Author

Hiya Jain  


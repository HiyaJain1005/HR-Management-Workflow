import { create } from 'zustand';
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { type WorkflowState, type WorkflowNode } from '../types';

const MAX_HISTORY = 50;

export const useStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationLog: [],
  isSimulating: false,
  showLog: false,
  past: [],
  future: [],

  setNodes: (nodes) => set({ nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes }),
  setEdges: (edges) => set({ edges: typeof edges === 'function' ? edges(get().edges) : edges }),
  
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
  },
  
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection: Connection) => {
    takeSnapshot(get, set);
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  
  updateNodeData: (id, data) => {
    takeSnapshot(get, set);
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },
  
  addNode: (node) => {
    takeSnapshot(get, set);
    set({ nodes: [...get().nodes, node] });
  },

  setSimulationLog: (log) => set({ simulationLog: log }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  setShowLog: (showLog) => set({ showLog }),
  
  importGraph: (nodes, edges) => set({ nodes, edges, simulationLog: [], selectedNodeId: null, past: [], future: [] }),

  deleteNode: (id) => {
    const { nodes, edges, past } = get();
    set({
      past: [{ nodes, edges }, ...past].slice(0, MAX_HISTORY),
      future: [],
      nodes: nodes.filter((n) => n.id !== id),
      edges: edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  deleteEdge: (id) => {
    const { nodes, edges, past } = get();
    set({
      past: [{ nodes, edges }, ...past].slice(0, MAX_HISTORY),
      future: [],
      edges: edges.filter((e) => e.id !== id),
    });
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[0];
    const newPast = past.slice(1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: newPast,
      future: [{ nodes, edges }, ...future],
    });
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [{ nodes, edges }, ...past],
      future: newFuture,
    });
  },
}));

// Helper to take snapshot before state changes
const takeSnapshot = (get: any, set: any) => {
  const { nodes, edges, past } = get();
  set({
    past: [{ nodes, edges }, ...past].slice(0, MAX_HISTORY),
    future: [],
  });
};

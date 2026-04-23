import { type Edge, type Node, type NodeChange, type EdgeChange, type Connection } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface WorkflowNodeData {
  label: string;
  status?: 'pending' | 'running' | 'success' | 'failed' | 'rejected';
  [key: string]: unknown;
}

export type WorkflowNode = Node<WorkflowNodeData, NodeType>;
export type WorkflowEdge = Edge;

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  simulationLog: SimulationStep[];
  isSimulating: boolean;
  showLog: boolean;
  past: { nodes: WorkflowNode[], edges: WorkflowEdge[] }[];
  future: { nodes: WorkflowNode[], edges: WorkflowEdge[] }[];
  
  // Actions
  setNodes: (nodes: WorkflowNode[] | ((nodes: WorkflowNode[]) => WorkflowNode[])) => void;
  setEdges: (edges: WorkflowEdge[] | ((edges: WorkflowEdge[]) => WorkflowEdge[])) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  addNode: (node: WorkflowNode) => void;
  setSimulationLog: (log: SimulationStep[]) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setShowLog: (showLog: boolean) => void;
  importGraph: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

export interface SimulationStep {
  nodeId: string;
  nodeLabel: string;
  type: NodeType;
  status: 'pending' | 'running' | 'success' | 'failed' | 'rejected';
  message: string;
  timestamp: string;
}


export interface AutomationAction {
  id: string;
  name: string;
  description: string;
  parameters: AutomationParameter[];
}

export interface AutomationParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'email';
  required: boolean;
}

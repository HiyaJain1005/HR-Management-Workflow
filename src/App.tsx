import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Panel,
  updateEdge,
  MarkerType,
  type ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from './store/useStore';
import { nodeTypes, NODE_REGISTRY } from './nodes';
import { type NodeType } from './types';
import { Sidebar } from './components/Sidebar';
import { NodePanel } from './components/NodePanel';
import { SimulatePanel } from './components/SimulatePanel';
import { useSimulate } from './hooks/useSimulate';
import { Play, Undo2, Redo2, LogOut, Download, Upload } from 'lucide-react';

let id = 1;
const getId = () => `node_${id++}`;

function AppContent() {
  const { 
    nodes, edges, onNodesChange, onEdgesChange, onConnect, 
    setSelectedNodeId, addNode, importGraph, setEdges, undo, redo, past, future
  } = useStore();
  const { runSimulation, error: simError } = useSimulate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = rfInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const def = NODE_REGISTRY[type];
      
      const newNode = {
        id: getId(),
        type: type as NodeType,
        position: position || { x: 0, y: 0 },
        data: { ...def.defaultData },
      };

      addNode(newNode);
    },
    [rfInstance, addNode]
  );

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target?.result as string);
        if (state.nodes && state.edges) {
          importGraph(state.nodes, state.edges);
        }
      } catch {
        alert('Invalid workflow JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <Sidebar />
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={(oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els))}
          onEdgeUpdateStart={() => (useStore.getState().isSimulating ? null : null)}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{ 
            type: 'smoothstep', 
            style: { strokeWidth: 2, stroke: '#555' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#555' }
          }}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-neutral-950"
        >
          <Background color="#333" gap={16} />
          <Controls className="!bg-neutral-800 !border-neutral-700 !fill-white" />
          <Panel position="top-right" className="flex items-center gap-2">
            {simError && <div className="text-red-500 text-[10px] bg-red-500/10 px-2 py-1 rounded border border-red-500/20 mr-2">{simError}</div>}
            
            <div className="flex bg-neutral-900 border border-neutral-800 rounded p-1 mr-2">
              <button 
                onClick={undo} 
                disabled={past.length === 0}
                className="p-1 hover:bg-neutral-800 disabled:opacity-30 rounded transition"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <button 
                onClick={redo} 
                disabled={future.length === 0}
                className="p-1 hover:bg-neutral-800 disabled:opacity-30 rounded transition"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>

            <button 
              onClick={runSimulation}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5 rounded text-white font-medium transition shadow-lg shadow-blue-900/20"
            >
              <Play className="w-3 h-3 fill-current" />
              Run Simulation Log
            </button>
            <div className="w-px h-4 bg-neutral-800 mx-1" />
            <button 
              onClick={() => useStore.getState().setShowLog(!useStore.getState().showLog)} 
              className="bg-neutral-800 hover:bg-neutral-700 text-xs px-3 py-1.5 rounded border border-neutral-700 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3 h-3" />
              Logs
            </button>
            <button onClick={handleExport} className="bg-neutral-800 hover:bg-neutral-700 text-xs px-3 py-1.5 rounded border border-neutral-700 transition flex items-center gap-1.5">
              <Download className="w-3 h-3" />
              Export
            </button>
            <label className="bg-neutral-800 hover:bg-neutral-700 text-xs px-3 py-1.5 rounded border border-neutral-700 cursor-pointer transition flex items-center gap-1.5">
              <Upload className="w-3 h-3" />
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </Panel>
        </ReactFlow>
        <SimulatePanel />
      </div>
      <NodePanel />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

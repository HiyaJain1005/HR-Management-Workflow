import { useState } from 'react';
import { useStore } from '../store/useStore';

export const useSimulate = () => {
  const { 
    nodes, 
    edges, 
    setSimulationLog, 
    setIsSimulating, 
    setShowLog 
  } = useStore();
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    // Validation
    if (nodes.length === 0) {
      setError('Add nodes to simulate.');
      return;
    }
    const hasStart = nodes.some(n => n.type === 'start');
    const hasEnd = nodes.some(n => n.type === 'end');
    if (!hasStart || !hasEnd) {
      setError('Workflow must contain at least one Start and one End node.');
      return;
    }

    setError(null);
    setIsSimulating(true);
    setSimulationLog([]);
    setShowLog(true);

    try {
      const payload = { nodes, edges };
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      const logs = data.steps;

      // Reset all node statuses and edges first
      nodes.forEach(node => useStore.getState().updateNodeData(node.id, { status: 'pending' }));
      useStore.getState().setEdges(eds => eds.map(e => ({ ...e, animated: false, style: { stroke: '#555' } })));

      // Simulate real-time progress for visual effect
      for (let i = 0; i < logs.length; i++) {
        const step = logs[i];
        
        // Mark node as running
        useStore.getState().updateNodeData(step.nodeId, { status: 'running' });
        await new Promise(r => setTimeout(r, 600));

        // Mark node as success/failed
        useStore.getState().updateNodeData(step.nodeId, { status: step.status });
        
        // Animate corresponding edges based on handle logic
        useStore.getState().setEdges(eds => eds.map(e => {
          if (e.source === step.nodeId) {
            const isApprovalNode = step.type === 'approval';
            
            if (isApprovalNode) {
              // Approval nodes have 'approved' and 'rejected' handles
              if (e.sourceHandle === 'approved' && step.status === 'success') {
                return { ...e, animated: true, style: { stroke: '#22c55e', strokeWidth: 3 } };
              }
              if (e.sourceHandle === 'rejected' && step.status === 'rejected') {
                return { ...e, animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } };
              }
              // Other handles or mismatched status should stay neutral/dimmed
              return { ...e, animated: false, style: { stroke: '#333', opacity: 0.5 } };
            }

            // Normal nodes just pass through on success
            return { 
              ...e, 
              animated: step.status === 'success',
              style: { stroke: step.status === 'success' ? '#22c55e' : '#ef4444' }
            };
          }
          return e;
        }));

        setSimulationLog(logs.slice(0, i + 1));
      }
    } catch {
      setError('Simulation failed to run.');
    } finally {
      setIsSimulating(false);
    }
  };

  return { runSimulation, error, setError };
};

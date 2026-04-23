import { useStore } from '../store/useStore';
import { NODE_REGISTRY } from '../nodes';
import { X, Trash2 } from 'lucide-react';

export const NodePanel = () => {
  const { nodes, selectedNodeId, setSelectedNodeId, deleteNode } = useStore();
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNode) return null;

  const def = NODE_REGISTRY[selectedNode.type as string];
  if (!def) return null;
  const FormComponent = def.form;

  return (
    <aside className="w-80 bg-neutral-900 border-l border-neutral-800 h-full shadow-2xl z-10 shrink-0 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${def.color}`}>
            <def.icon className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-sm">{def.label} Config</h3>
        </div>
        <button onClick={() => setSelectedNodeId(null)} className="p-1 hover:bg-neutral-800 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <FormComponent key={selectedNode.id} id={selectedNode.id} data={selectedNode.data} />
      </div>
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to delete this node?')) {
              deleteNode(selectedNode.id);
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-md text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </aside>
  );
};

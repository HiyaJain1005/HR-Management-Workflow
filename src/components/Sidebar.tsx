import { NODE_REGISTRY } from '../nodes';

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 p-4 flex flex-col gap-4 z-10 shrink-0 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight text-white">HR Workflow</h2>
        <p className="text-xs text-neutral-400 mt-1">Drag nodes to canvas</p>
      </div>
      
      <div className="flex flex-col gap-3">
        {Object.entries(NODE_REGISTRY).map(([type, def]) => {
          const Icon = def.icon;
          return (
            <div
              key={type}
              className="flex items-center gap-3 p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md cursor-grab active:cursor-grabbing transition-colors"
              onDragStart={(e) => onDragStart(e, type)}
              draggable
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-md ${def.color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">{def.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

import { useStore } from '../store/useStore';
import { Loader2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useSimulate } from '../hooks/useSimulate';

export const SimulatePanel = () => {
  const { simulationLog, isSimulating, showLog, setShowLog } = useStore();
  const { runSimulation, error } = useSimulate();

  if (!showLog) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-800 p-4 z-20 w-[600px] max-h-80 overflow-hidden rounded-xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-blue-500 rounded-full" />
          <h3 className="font-semibold text-sm">Execution Log</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="text-[10px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
          >
            {isSimulating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Re-run'}
          </button>
          <button 
            onClick={() => setShowLog(false)}
            className="p-1 hover:bg-neutral-800 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-xs mb-3 bg-red-500/5 p-2 rounded border border-red-500/20">{error}</div>}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {simulationLog.map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-[13px] p-2.5 rounded-lg bg-neutral-800/30 border border-neutral-800/50 hover:bg-neutral-800/50 transition-colors animate-in fade-in slide-in-from-bottom-2">
            <div className="mt-0.5">
              {step.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
              {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
              {step.status === 'running' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-neutral-200">{step.nodeLabel}</span>
                <span className="text-[10px] text-neutral-500 font-mono italic">{new Date(step.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-neutral-400 leading-tight">{step.message}</p>
            </div>
          </div>
        ))}
        {simulationLog.length === 0 && !isSimulating && !error && (
          <div className="text-neutral-500 text-sm italic text-center py-8">
            Starting simulation...
          </div>
        )}
        <div id="simulation-bottom" />
      </div>
    </div>
  );
};


/* eslint-disable react-refresh/only-export-components */
import { Zap } from 'lucide-react';
import { z } from 'zod';
import { Handle, Position } from 'reactflow';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '../store/useStore';
import { type NodeDefinition } from './types';
import { useEffect, useState } from 'react';
import { type AutomationAction } from '../types';

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  actionId: z.string().min(1, 'Action is required'),
  parameters: z.record(z.string(), z.any()).optional(),
});

const defaultData = {
  label: 'Automated Step',
  actionId: '',
  parameters: {},
};

type NodeData = z.infer<typeof schema> & { status?: 'pending' | 'running' | 'success' | 'failed' | 'rejected' };

const NodeComponent = ({ data }: { data: NodeData }) => {
  const statusStyles = {
    running: 'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    success: 'ring-2 ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    failed: 'ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
    rejected: 'ring-2 ring-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
    pending: '',
  };

  return (
    <div className={`flex flex-col min-w-[150px] bg-neutral-800 border border-neutral-700 rounded-md shadow-lg overflow-hidden transition-all duration-300 ${statusStyles[data.status as keyof typeof statusStyles] || ''}`}>
      <div className="w-2 h-full absolute left-0 bottom-0 top-0 bg-purple-500" />
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-purple-500" />
      <div className="pl-4 pr-3 py-2 flex items-center gap-2 border-b border-neutral-700">
        <Zap className="w-4 h-4 text-purple-500" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="pl-4 pr-3 py-2 text-xs text-neutral-400">
        Action: {data.actionId || 'None selected'}
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-purple-500" />
    </div>
  );
};

const FormComponent = ({ id, data }: { id: string; data: NodeData }) => {
  const updateNodeData = useStore((s) => s.updateNodeData);
  const [actions, setActions] = useState<AutomationAction[]>([]);
  
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const selectedActionId = useWatch({
    control,
    name: 'actionId'
  });

  useEffect(() => {
    fetch('/api/automations').then(r => r.json()).then(setActions).catch(console.error);
  }, []);

  const onSubmit = (values: NodeData) => {
    updateNodeData(id, values);
  };

  const selectedAction = actions.find(a => a.id === selectedActionId);

  return (
    <form onChange={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <input 
          {...register('label')} 
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
        />
        {errors.label && <span className="text-red-500 text-xs mt-1 block">{errors.label.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Automation Action</label>
        <select 
          {...register('actionId')} 
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          onChange={(e) => {
            setValue('actionId', e.target.value);
            setValue('parameters', {}); // clear params on change
            handleSubmit(onSubmit)();
          }}
        >
          <option value="">Select an action...</option>
          {actions.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {errors.actionId && <span className="text-red-500 text-xs mt-1 block">{errors.actionId.message as string}</span>}
      </div>

      {selectedAction && selectedAction.parameters.length > 0 && (
        <div className="pt-2 border-t border-neutral-700 mt-2">
          <h4 className="text-sm font-semibold mb-2">Parameters</h4>
          {selectedAction.parameters.map(param => (
            <div key={param.id} className="mb-3">
              <label className="block text-xs font-medium mb-1">{param.name} {param.required && '*'}</label>
              <input 
                {...register(`parameters.${param.id}` as const)} 
                type={param.type === 'number' ? 'number' : 'text'}
                required={param.required}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export const AutomatedStepNodeDefinition: NodeDefinition<NodeData> = {
  type: 'automated',
  component: NodeComponent,
  form: FormComponent,
  schema,
  defaultData,
  icon: Zap,
  color: 'bg-purple-500',
  label: 'Automated Step',
};

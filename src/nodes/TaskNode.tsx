/* eslint-disable react-refresh/only-export-components */
import { ClipboardList } from 'lucide-react';
import { z } from 'zod';
import { Handle, Position } from 'reactflow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '../store/useStore';
import { type NodeDefinition } from './types';

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  assignee: z.string().min(1, 'Assignee is required'),
  description: z.string().optional(),
});

const defaultData = {
  label: 'Manual Task',
  assignee: '',
  description: '',
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
      <div className="w-2 h-full absolute left-0 bottom-0 top-0 bg-blue-500" />
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-500" />
      <div className="pl-4 pr-3 py-2 flex items-center gap-2 border-b border-neutral-700">
        <ClipboardList className="w-4 h-4 text-blue-500" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="pl-4 pr-3 py-2 text-xs text-neutral-400">
        Assignee: {data.assignee || 'Unassigned'}
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-500" />
    </div>
  );
};

const FormComponent = ({ id, data }: { id: string; data: NodeData }) => {
  const updateNodeData = useStore((s) => s.updateNodeData);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const onSubmit = (values: NodeData) => {
    updateNodeData(id, values);
  };

  return (
    <form onChange={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <input 
          {...register('label')} 
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        {errors.label && <span className="text-red-500 text-xs mt-1 block">{errors.label.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Assignee</label>
        <input 
          {...register('assignee')} 
          placeholder="e.g. HR Team"
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        {errors.assignee && <span className="text-red-500 text-xs mt-1 block">{errors.assignee.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          {...register('description')} 
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px]"
        />
      </div>
    </form>
  );
};

export const TaskNodeDefinition: NodeDefinition<NodeData> = {
  type: 'task',
  component: NodeComponent,
  form: FormComponent,
  schema,
  defaultData,
  icon: ClipboardList,
  color: 'bg-blue-500',
  label: 'Task',
};

/* eslint-disable react-refresh/only-export-components */
import { Play, PlayCircle } from 'lucide-react';
import { z } from 'zod';
import { Handle, Position } from 'reactflow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '../store/useStore';
import { type NodeDefinition } from './types';

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
});

const defaultData = {
  label: 'Start',
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
    <div className={`flex items-center min-w-[150px] bg-neutral-800 border border-neutral-700 rounded-md shadow-lg overflow-hidden transition-all duration-300 ${statusStyles[data.status as keyof typeof statusStyles] || ''}`}>
      <div className="w-2 h-full absolute left-0 bottom-0 top-0 bg-green-500" />
      <div className="pl-4 pr-3 py-3 flex items-center gap-2">
        <PlayCircle className="w-4 h-4 text-green-500" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-green-500" />
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
    </form>
  );
};

export const StartNodeDefinition: NodeDefinition<NodeData> = {
  type: 'start',
  component: NodeComponent,
  form: FormComponent,
  schema,
  defaultData,
  icon: Play,
  color: 'bg-green-500',
  label: 'Start',
};

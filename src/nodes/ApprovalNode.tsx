/* eslint-disable react-refresh/only-export-components */
import { UserCheck } from 'lucide-react';
import { z } from 'zod';
import { Handle, Position } from 'reactflow';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStore } from '../store/useStore';
import { type NodeDefinition } from './types';

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  approverRole: z.string().min(1, 'Approver role is required'),
});

const defaultData = {
  label: 'Manager Approval',
  approverRole: 'Direct Manager',
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
      <div className="w-2 h-full absolute left-0 bottom-0 top-0 bg-orange-500" />
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-orange-500" />
      <div className="pl-4 pr-3 py-2 flex items-center gap-2 border-b border-neutral-700">
        <UserCheck className="w-4 h-4 text-orange-500" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="pl-4 pr-3 py-2 text-xs text-neutral-400">
        Role: {data.approverRole || 'Unassigned'}
      </div>
      <Handle type="source" position={Position.Right} id="approved" className="!w-3 !h-3 !bg-green-500 !top-1/3" />
      <div className="absolute right-4 top-1/3 -translate-y-1/2 text-[10px] text-green-500 font-bold">Y</div>
      <Handle type="source" position={Position.Right} id="rejected" className="!w-3 !h-3 !bg-red-500 !top-2/3" />
      <div className="absolute right-4 top-2/3 -translate-y-1/2 text-[10px] text-red-500 font-bold">N</div>
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
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        />
        {errors.label && <span className="text-red-500 text-xs mt-1 block">{errors.label.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Approver Role</label>
        <select 
          {...register('approverRole')} 
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
        >
          <option value="Direct Manager">Direct Manager</option>
          <option value="Department Head">Department Head</option>
          <option value="HR Partner">HR Partner</option>
          <option value="IT Admin">IT Admin</option>
        </select>
        {errors.approverRole && <span className="text-red-500 text-xs mt-1 block">{errors.approverRole.message as string}</span>}
      </div>
    </form>
  );
};

export const ApprovalNodeDefinition: NodeDefinition<NodeData> = {
  type: 'approval',
  component: NodeComponent,
  form: FormComponent,
  schema,
  defaultData,
  icon: UserCheck,
  color: 'bg-orange-500',
  label: 'Approval',
};

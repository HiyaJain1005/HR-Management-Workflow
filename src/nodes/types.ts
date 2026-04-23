import { z } from 'zod';
import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { type LucideIcon } from 'lucide-react';

export interface NodeDefinition<T = unknown> {
  type: string;
  component: ComponentType<NodeProps>;
  form: ComponentType<{ id: string, data: T }>;
  schema: z.ZodSchema<T>;
  defaultData: T;
  icon: LucideIcon;
  color: string;
  label: string;
}

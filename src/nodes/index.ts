import { type ComponentType } from 'react';
import { type NodeProps } from 'reactflow';
import { StartNodeDefinition } from './StartNode';
import { EndNodeDefinition } from './EndNode';
import { TaskNodeDefinition } from './TaskNode';
import { ApprovalNodeDefinition } from './ApprovalNode';
import { AutomatedStepNodeDefinition } from './AutomatedStepNode';
import { type NodeDefinition } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NODE_REGISTRY: Record<string, NodeDefinition<any>> = {
  start: StartNodeDefinition,
  task: TaskNodeDefinition,
  approval: ApprovalNodeDefinition,
  automated: AutomatedStepNodeDefinition,
  end: EndNodeDefinition,
};

// Component map for React Flow
export const nodeTypes = Object.entries(NODE_REGISTRY).reduce((acc, [key, def]) => {
  acc[key] = def.component;
  return acc;
}, {} as Record<string, ComponentType<NodeProps>>);

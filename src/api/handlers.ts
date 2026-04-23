import { http, HttpResponse } from 'msw';
import { type AutomationAction, type SimulationStep, type WorkflowNode, type WorkflowEdge, type NodeType } from '../types';

const automations: AutomationAction[] = [
  {
    id: 'email-employee',
    name: 'Send Welcome Email',
    description: 'Automatically sends a welcome email to the new hire.',
    parameters: [
      { id: 'templateId', name: 'Email Template ID', type: 'string', required: true },
      { id: 'delayDays', name: 'Delay (Days)', type: 'number', required: false },
    ],
  },
  {
    id: 'create-jira',
    name: 'Create Jira Ticket for IT',
    description: 'Creates a Jira ticket for IT equipment provisioning.',
    parameters: [
      { id: 'projectKey', name: 'Jira Project Key', type: 'string', required: true },
      { id: 'issueType', name: 'Issue Type', type: 'string', required: true },
    ],
  },
  {
    id: 'slack-notify',
    name: 'Notify Slack Channel',
    description: 'Posts a message to a specific Slack channel.',
    parameters: [
      { id: 'channel', name: 'Channel Name', type: 'string', required: true },
      { id: 'message', name: 'Custom Message', type: 'string', required: false },
    ],
  },
  {
    id: 'sync-workday',
    name: 'Sync with Workday',
    description: 'Syncs employee record to Workday system.',
    parameters: [],
  },
];

export const handlers = [
  http.get('/api/automations', () => {
    return HttpResponse.json(automations);
  }),

  http.post('/api/simulate', async ({ request }) => {
    const data = await request.json() as { nodes: WorkflowNode[], edges: WorkflowEdge[] };
    const { nodes, edges } = data;

    // Topological Sort / BFS basic simulation
    const steps: SimulationStep[] = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const adjList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(n => {
      adjList.set(n.id, []);
      inDegree.set(n.id, 0);
    });

    edges.forEach(e => {
      if (adjList.has(e.source)) {
        adjList.get(e.source)!.push(e.target);
      }
      if (inDegree.has(e.target)) {
        inDegree.set(e.target, inDegree.get(e.target)! + 1);
      }
    });

    const queue: string[] = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    // We add some simulated delay and generate steps
    // For actual real-time streaming to the UI, we'd normally use SSE, but since this is a mock returning a full array
    // we'll simulate the array of logs.
    
    // Instead of actual delay during request, let's just return the sorted list of steps,
    // and the client can animate them.
    
    let time = Date.now();
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = nodeMap.get(currentId)!;
      
      // Basic logic: if an ancestor failed/rejected, this node might be skipped
      // For this simulator, we just assume success for simplicity unless it's a specific dynamic branch
      let nodeStatus: 'success' | 'rejected' = 'success';
      let message = `${node.data.label} completed.`;

      // Simple branching simulation: if it's an approval node, 30% chance to reject
      if (node.type === 'approval') {
        const isRejected = Math.random() < 0.3;
        if (isRejected) {
          nodeStatus = 'rejected';
          message = `${node.data.label} was DECLINED.`;
        } else {
          message = `${node.data.label} was APPROVED.`;
        }
      }

      steps.push({
        nodeId: node.id,
        nodeLabel: node.data.label,
        type: node.type as NodeType,
        status: nodeStatus,
        message,
        timestamp: new Date(time).toISOString(),
      });
      time += 1000;

      // If node rejected, we could simulate stopping or branching
      // For now, we continue but mark paths
      const neighbors = adjList.get(currentId) || [];
      neighbors.forEach(neighbor => {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    if (steps.length < nodes.length) {
      steps.push({
        nodeId: 'system',
        nodeLabel: 'System',
        type: 'end' as NodeType,
        status: 'failed',
        message: 'Cycle detected or disconnected components present.',
        timestamp: new Date(time).toISOString(),
      });
    }

    return HttpResponse.json({ steps });
  }),
];

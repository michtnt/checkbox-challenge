import { ApiNodeData } from './components/nodes/ApiNode';
import { ConditionalNodeData } from './components/nodes/ConditionalNode';
import { EndNodeData } from './components/nodes/EndNode';
import { FormNodeData } from './components/nodes/FormNode';
import { StartNodeData } from './components/nodes/StartNode';

/**
 * Union type representing all possible node data types
 */
export type WorkflowNodeData =
  | FormNodeData
  | ApiNodeData
  | ConditionalNodeData
  | StartNodeData
  | EndNodeData;

/**
 * Types of Node
 */
export type NodeType = 'start' | 'form' | 'conditional' | 'api' | 'end';

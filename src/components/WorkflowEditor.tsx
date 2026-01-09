import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Box, Button, Card, Flex, Heading, AlertDialog } from '@radix-ui/themes';
import { Save } from 'lucide-react';

import { StartNode } from './nodes/StartNode';
import { FormNode } from './nodes/FormNode';
import { ConditionalNode, ConditionalRoute, ConditionalOperator } from './nodes/ConditionalNode';
import { ApiNode } from './nodes/ApiNode';
import { EndNode } from './nodes/EndNode';
import { BlockPanel } from './BlockPanel';

import type { ConditionalNodeData } from './nodes/ConditionalNode';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useValidation } from '@/hooks/useValidation';
import { SaveStatus } from './SaveStatus';
import { WorkflowNodeData } from '@/types';
import { NodeEditor } from './nodeEditor/NodeEditor';
import { ValidationPanel } from './ValidationPanel';

const nodeTypes = {
  start: StartNode,
  form: FormNode,
  conditional: ConditionalNode,
  api: ApiNode,
  end: EndNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

const getBlockConfig = (blockType: string): WorkflowNodeData => {
  const configs: Record<string, WorkflowNodeData> = {
    start: {
      label: 'Start',
    },
    form: {
      label: 'Form',
      customName: 'Form',
      fields: [],
    },
    conditional: {
      label: 'Conditional',
      customName: 'Conditional',
      fieldToEvaluate: '',
      operator: 'equals' as ConditionalOperator,
      value: '',
      routes: [
        { id: 'true' as const, label: 'True', condition: '' },
        { id: 'false' as const, label: 'False', condition: '' },
      ] as ConditionalRoute[],
    },
    api: {
      label: 'API Call',
      url: '',
      method: 'GET',
    },
    end: {
      label: 'End',
    },
  };
  return configs[blockType] || { label: blockType };
};

/**
 * WorkflowEditor - Main component for building and editing workflows
 * Provides a visual canvas for creating workflows with nodes and connections
 */
export const WorkflowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);

  const { validationErrors, nodeValidationErrors, isWorkflowValid } = useValidation(nodes, edges);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const { saveState, lastSaved, hasSavedData, getSavedData, clearSavedData } = useAutoSave(
    nodes,
    edges
  );

  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // trigger dialog to restore saved workflow if available
  useEffect(() => {
    console.log('Checking for saved workflow data...');
    if (hasSavedData && nodes.length === 0) {
      setShowRestoreDialog(true);
    }
  }, [hasSavedData, nodes.length]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Get the source node to check if it's a conditional node
      const sourceNode = nodes.find((n) => n.id === params.source);

      let label = '';
      if (sourceNode?.type === 'conditional' && params.sourceHandle) {
        const conditionalData = sourceNode.data as unknown as ConditionalNodeData;
        // Find the route label for this handle
        const route = conditionalData.routes?.find((r) => r.id === params.sourceHandle);
        label = route?.label || params.sourceHandle || '';
      }

      setEdges((eds) => addEdge({ ...params, label }, eds));
    },
    [setEdges, nodes]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // Don't open editor for start and end nodes
    if (node.type === 'start' || node.type === 'end') {
      return;
    }
    setSelectedNode(node);
    setIsEditingNode(true);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, newData: Partial<WorkflowNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    },
    [setNodes]
  );

  const closeEditor = useCallback(() => {
    setSelectedNode(null);
    setIsEditingNode(false);
  }, []);

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  // Keyboard shortcuts for deleting selected node
  useEffect(() => {
    if (isEditingNode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNode) {
        // Prevent default behavior (like navigating back) when deleting
        event.preventDefault();
        deleteNode(selectedNode.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, deleteNode, isEditingNode]);

  const handleAddBlock = useCallback(
    (blockType: string) => {
      const config = getBlockConfig(blockType);

      // Get viewport center position
      let position = { x: 100, y: 100 }; // Default fallback

      if (reactFlowInstance.current) {
        const viewport = reactFlowInstance.current.getViewport();
        const zoom = viewport.zoom;
        const canvasCenter = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };

        // Convert screen coordinates to flow coordinates
        position = reactFlowInstance.current.screenToFlowPosition({
          x: canvasCenter.x,
          y: canvasCenter.y,
        });
      }

      const nodeId = getId();
      const newNode: Node = {
        id: nodeId,
        type: blockType,
        position,
        data: {
          ...config,
          onDelete: () => deleteNode(nodeId),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, deleteNode]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const handleSave = () => {
    const workflowConfig = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      })),
      metadata: {
        name: 'Sample Workflow',
        version: '1.0.0',
        created: new Date().toISOString(),
      },
    };

    console.log('Workflow Configuration:', JSON.stringify(workflowConfig, null, 2));

    setShowSaveDialog(true);
  };

  const handleRestoreWorkflow = useCallback(() => {
    const savedData = getSavedData();

    if (savedData) {
      // Add delete handlers to restored nodes
      const nodesWithHandlers = savedData.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onDelete: () => deleteNode(node.id),
        },
      }));

      setNodes(nodesWithHandlers);
      setEdges(savedData.edges);

      // update node ID counter to avoid conflicts
      const maxId = Math.max(
        ...savedData.nodes.map((n) => {
          const match = n.id.match(/node_(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        }),
        0
      );

      nodeId = maxId + 1;
    }

    setShowRestoreDialog(false);
  }, [getSavedData, setNodes, setEdges, deleteNode]);

  const handleDiscardSavedData = useCallback(() => {
    clearSavedData();
    setShowRestoreDialog(false);
  }, [clearSavedData]);

  return (
    <Flex minHeight="100vh" direction="column" style={{ width: '100%' }}>
      <Card m="4" mb="0">
        <Flex flexGrow="1" justify="between" align="center">
          <Heading as="h2">Workflow Editor</Heading>

          <SaveStatus saveState={saveState} lastSaved={lastSaved} />

          <Button
            onClick={handleSave}
            disabled={!isWorkflowValid}
            color={!isWorkflowValid ? 'gray' : undefined}
          >
            <Save size={16} />
            Save Workflow
          </Button>
        </Flex>
      </Card>

      {/* Main Content with Panel and Canvas */}
      <Flex flexGrow="1" m="4" mt="2" gap="4">
        {/* Left Panels */}
        <Flex direction="column" gap="4">
          <BlockPanel onAddBlock={handleAddBlock} />
          <ValidationPanel errors={validationErrors} />
        </Flex>

        {/* Workflow Canvas */}
        <Box flexGrow="1" style={{ minHeight: '600px' }}>
          <Card style={{ overflow: 'hidden', height: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onInit={onInit}
              nodeTypes={nodeTypes}
              fitView
              defaultEdgeOptions={{
                style: { strokeWidth: 2, stroke: '#94a3b8' },
                type: 'smoothstep',
                animated: false,
              }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius)',
              }}
            >
              <Controls
                style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <MiniMap
                style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'start':
                      return '#10b981';
                    case 'form':
                      return '#3b82f6';
                    case 'conditional':
                      return '#f59e0b';
                    case 'api':
                      return '#a855f7';
                    case 'end':
                      return '#ef4444';
                    default:
                      return '#6b7280';
                  }
                }}
              />
              <Background color="#e2e8f0" gap={20} />
            </ReactFlow>
          </Card>
        </Box>

        {/* Right Panel - Node Editor */}
        {selectedNode && (
          <NodeEditor
            node={selectedNode}
            onUpdate={updateNodeData}
            onClose={closeEditor}
            onDelete={deleteNode}
            validationErrors={nodeValidationErrors[selectedNode.id] || []}
          />
        )}
      </Flex>

      <AlertDialog.Root open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Workflow Saved</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Your workflow configuration has been saved to the browser console. Check the developer
            console for the complete configuration details.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </AlertDialog.Cancel>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Restore Saved Workflow</AlertDialog.Title>
          <AlertDialog.Description size="2">
            We found a previously saved workflow, Would you like to restore it or start with a blank
            canvas?
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" onClick={handleDiscardSavedData}>
                Start Fresh
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={handleRestoreWorkflow}>Restore Workflow</Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
};

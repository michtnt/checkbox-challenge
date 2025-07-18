import React, { useCallback, useState } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Box, Button, Card, Flex, Heading, AlertDialog } from '@radix-ui/themes';
import { Save } from 'lucide-react';

import StartNode from './nodes/StartNode';
import FormNode from './nodes/FormNode';
import ConditionalNode from './nodes/ConditionalNode';
import ApiNode from './nodes/ApiNode';
import EndNode from './nodes/EndNode';
import BlockPanel from './BlockPanel';

const nodeTypes = {
  start: StartNode,
  form: FormNode,
  conditional: ConditionalNode,
  api: ApiNode,
  end: EndNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workflowErrors, setWorkflowErrors] = useState<string[]>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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

  return (
    <Flex minHeight="100vh" direction="column" style={{ width: '100%' }}>
      <Card m="4" mb="0">
        <Flex flexGrow="1" justify="between" align="center">
          <Heading as="h2">Workflow Editor</Heading>

          <Button onClick={handleSave}>
            <Save size={16} />
            Save Workflow
          </Button>
        </Flex>
      </Card>

      {/* Main Content with Panel and Canvas */}
      <Flex flexGrow="1" m="4" mt="2" gap="4">
        {/* Left Panel */}
        <BlockPanel />

        {/* Workflow Canvas */}
        <Box flexGrow="1" style={{ minHeight: '600px' }}>
          <Card style={{ overflow: 'hidden', height: '100%' }}>
            {workflowErrors.length > 0 && (
              <Box p="2" style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
                <Text size="2" color="red">
                  Workflow Errors: {workflowErrors.join(', ')}
                </Text>
              </Box>
            )}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
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
    </Flex>
  );
};

export default WorkflowEditor;

import { WorkflowNodeData } from '@/types';
import { FieldValidationResult } from '@/utils/validation';
import { Node } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { FormField } from '../nodes/FormNode';
import { ConditionalRoute } from '../nodes/ConditionalNode';
import { Card, Flex, Heading, IconButton } from '@radix-ui/themes';
import { Trash2, X } from 'lucide-react';
import { FormNodeEditor } from './components/FormNodeEditor';
import { ApiNodeEditor } from './components/ApiNodeEditor';
import { ConditionalNodeEditor } from './components/ConditionalNodeEditor';

/**
 * Props for the NodeEditor component
 */
export interface NodeEditorProps {
  node: Node;
  onUpdate: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  validationErrors?: FieldValidationResult[];
}

/**
 * NodeEditor - Configuration panel for editing node properties
 * Displays different fields based on the node type
 */
export const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  onUpdate,
  onClose,
  onDelete,
  validationErrors = [],
}) => {
  const [formData, setFormData] = useState<WorkflowNodeData>(
    node.data as unknown as WorkflowNodeData
  );

  // set form data to the latest selected node
  useEffect(() => {
    setFormData(node.data as unknown as WorkflowNodeData);
  }, [node.data, node.id]);

  const handleChange = (field: string, value: string | FormField[] | ConditionalRoute[]) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(node.id, newData);
  };

  return (
    <Card style={{ width: '350px', height: '100%', position: 'relative', overflowY: 'auto' }}>
      <Flex direction="column" gap="4" p="4">
        <Flex justify="between" align="center">
          <Heading size="4">Edit {node.type}</Heading>
          <Flex gap="2">
            <IconButton
              variant="ghost"
              size="1"
              color="red"
              onClick={() => onDelete(node.id)}
              title="Delete node (Delete/Backspace)"
            >
              <Trash2 size={16} />
            </IconButton>
            <IconButton variant="ghost" size="1" onClick={onClose} title="Close editor">
              <X size={16} />
            </IconButton>
          </Flex>
        </Flex>
        {/* 
        {validationErrors.length > 0 && (
          <Callout.Root color="red" size="1">
            <Callout.Icon>
              <AlertCircle />
            </Callout.Icon>
            <Callout.Text style={{ whiteSpace: 'pre-line' }}>
              {`Validation Errors:\n${validationErrors.map((error) => `• ${error}`).join('\n')}`}
            </Callout.Text>
          </Callout.Root>
        )} */}

        {node.type === 'form' && (
          <FormNodeEditor
            formData={formData}
            handleChange={handleChange}
            validationErrors={validationErrors}
          />
        )}

        {node.type === 'api' && (
          <ApiNodeEditor
            formData={formData}
            handleChange={handleChange}
            validationErrors={validationErrors}
          />
        )}

        {node.type === 'conditional' && (
          <ConditionalNodeEditor
            formData={formData}
            handleChange={handleChange}
            validationErrors={validationErrors}
          />
        )}
      </Flex>
    </Card>
  );
};

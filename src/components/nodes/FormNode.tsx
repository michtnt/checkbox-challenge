import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText } from 'lucide-react';
import { Box, Text, Flex } from '@radix-ui/themes';

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'number';
  required: boolean;
}

interface FormNodeData {
  label: string;
  customName?: string;
  fields?: FormField[];
}

const FormNode = ({ data }: { data: FormNodeData }) => {

  return (
    <Box
      px="4"
      py="3"
      style={{
        boxShadow: 'var(--shadow-2)',
        borderRadius: 'var(--radius-3)',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: '2px solid #2563eb',
        minWidth: '150px',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#2563eb',
          border: '2px solid white',
        }}
      />

      <Flex align="center" gap="2" justify="center" mb="2">
        <FileText size={16} />
        <Text size="2" weight="bold">
          {data.customName || data.label}
        </Text>
      </Flex>

      <Text size="1" style={{ opacity: 0.9, textAlign: 'center' }}>
        {data.fields && data.fields.length > 0 
          ? `${data.fields.length} field${data.fields.length > 1 ? 's' : ''} configured`
          : 'Click to configure form fields'}
      </Text>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#2563eb',
          border: '2px solid white',
        }}
      />
    </Box>
  );
};

export default FormNode;

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { Box, Text, Flex } from '@radix-ui/themes';

interface ConditionalNodeData {
  label: string;
  customName?: string;
  fieldToEvaluate?: string;
  operator?: 'equals' | 'not_equals' | 'is_empty';
  value?: string;
}

const ConditionalNode = ({ data }: { data: ConditionalNodeData }) => {

  return (
    <Box
      px="4"
      py="3"
      style={{
        boxShadow: 'var(--shadow-2)',
        borderRadius: 'var(--radius-3)',
        backgroundColor: '#f59e0b',
        color: 'white',
        border: '2px solid #d97706',
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
          backgroundColor: '#d97706',
          border: '2px solid white',
        }}
      />

      <Flex align="center" gap="2" justify="center" mb="2">
        <GitBranch size={16} />
        <Text size="2" weight="bold">
          {data.customName || data.label}
        </Text>
      </Flex>

      <Text size="1" style={{ opacity: 0.9, textAlign: 'center' }}>
        {data.fieldToEvaluate 
          ? `${data.fieldToEvaluate} ${data.operator || ''} ${data.value || ''}`
          : 'Click to configure conditions'}
      </Text>

      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{
          top: '30%',
          width: '12px',
          height: '12px',
          backgroundColor: '#d97706',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{
          top: '70%',
          width: '12px',
          height: '12px',
          backgroundColor: '#d97706',
          border: '2px solid white',
        }}
      />
    </Box>
  );
};

export default ConditionalNode;

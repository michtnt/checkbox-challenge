import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Globe } from 'lucide-react';
import { Box, Text, Flex } from '@radix-ui/themes';

interface ApiNodeData {
  label: string;
  customName?: string;
  httpMethod?: 'GET' | 'POST';
  url?: string;
  requestBody?: Record<string, string>;
}

const ApiNode = ({ data }: { data: ApiNodeData }) => {

  return (
    <Box
      px="4"
      py="3"
      style={{
        boxShadow: 'var(--shadow-2)',
        borderRadius: 'var(--radius-3)',
        backgroundColor: '#a855f7',
        color: 'white',
        border: '2px solid #9333ea',
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
          backgroundColor: '#9333ea',
          border: '2px solid white',
        }}
      />

      <Flex align="center" gap="2" justify="center" mb="2">
        <Globe size={16} />
        <Text size="2" weight="bold">
          {data.label}
        </Text>
      </Flex>

      <Text size="1" style={{ opacity: 0.9, textAlign: 'center' }}>
        Click to configure API call
      </Text>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#9333ea',
          border: '2px solid white',
        }}
      />
    </Box>
  );
};

export default ApiNode;

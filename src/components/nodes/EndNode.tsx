import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Square } from 'lucide-react';
import { Box, Text, Flex } from '@radix-ui/themes';

const EndNode = ({ data }: { data: { label?: string } }) => {
  return (
    <Box
      px="4"
      py="3"
      style={{
        boxShadow: 'var(--shadow-2)',
        borderRadius: 'var(--radius-3)',
        backgroundColor: '#ef4444',
        color: 'white',
        border: '2px solid #dc2626',
        minWidth: '120px',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#dc2626',
          border: '2px solid white',
        }}
      />

      <Flex align="center" gap="2" justify="center">
        <Square size={16} fill="white" />
        <Text size="2" weight="bold">
          End
        </Text>
      </Flex>
    </Box>
  );
};

export default EndNode;

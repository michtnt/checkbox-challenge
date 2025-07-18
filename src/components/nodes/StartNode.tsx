import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';
import { Box, Text, Flex } from '@radix-ui/themes';

const StartNode = ({ data }: { data: { label: string } }) => {
  return (
    <Box
      px="4"
      py="3"
      style={{
        boxShadow: 'var(--shadow-2)',
        borderRadius: 'var(--radius-3)',
        backgroundColor: '#10b981',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minWidth: '120px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Flex align="center" gap="2" justify="center">
        <Play size={16} fill="white" />
        <Text size="2" weight="bold">
          {data.label}
        </Text>
      </Flex>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#059669',
          border: '2px solid white',
        }}
      />
    </Box>
  );
};

export default StartNode;

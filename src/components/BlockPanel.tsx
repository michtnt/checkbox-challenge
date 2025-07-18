import React from 'react';
import { Card, Heading, Text, Box, Flex } from '@radix-ui/themes';
import { Play, FileText, GitBranch, Square, Globe } from 'lucide-react';

const BlockPanel = () => {
  const blocks = [
    {
      id: 'start',
      name: 'Start Block',
      icon: Play,
      description: 'Starting point of the workflow',
      color: '#10b981',
      darkColor: '#059669',
    },
    {
      id: 'form',
      name: 'Form Block',
      icon: FileText,
      description: 'User input form',
      color: '#3b82f6',
      darkColor: '#2563eb',
    },
    {
      id: 'conditional',
      name: 'Conditional Block',
      icon: GitBranch,
      description: 'Decision point with conditions',
      color: '#f59e0b',
      darkColor: '#d97706',
    },
    {
      id: 'api',
      name: 'API Block',
      icon: Globe,
      description: 'Make HTTP API calls',
      color: '#a855f7',
      darkColor: '#9333ea',
    },
    {
      id: 'end',
      name: 'End Block',
      icon: Square,
      description: 'End point of the workflow',
      color: '#ef4444',
      darkColor: '#dc2626',
    },
  ];

  return (
    <Card style={{ width: '256px', height: '100%' }}>
      <Box p="4" pb="3">
        <Heading size="3">Blocks</Heading>
      </Box>
      <Flex p="4" pt="0" direction="column" gap="3">
        {blocks.map((block) => {
          const IconComponent = block.icon;
          return (
            <Flex key={block.id} direction="column" gap="1">
              <Text size="1" color="gray">
                {block.description}
              </Text>
              <Flex
                align="center"
                gap="3"
                p="3"
                style={{
                  borderRadius: 'var(--radius-4)',
                  cursor: 'pointer',
                  backgroundColor: block.color,
                  color: 'white',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: 'var(--shadow-2);',
                }}
              >
                <IconComponent size={16} />
                <Text size="2" weight="medium">
                  {block.name}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Card>
  );
};

export default BlockPanel;

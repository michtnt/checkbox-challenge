import { ValidationError } from '@/utils/validation';
import { Badge, Callout, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { AlertCircle, Info } from 'lucide-react';

/**
 * Props for the ValidationPanel component
 */
export interface ValidationPanelProps {
  errors: ValidationError[];
}

/**
 * ValidationPanel - Displays workflow validation errors
 * Shows a list of errors that need to be fixed in the workflow
 */
export const ValidationPanel: React.FC<ValidationPanelProps> = ({ errors }) => {
  const errorCount = errors.length;

  return (
    <Card style={{ width: '256px', height: '100%' }}>
      <Flex direction="column" gap="3" p="4">
        <Flex justify="between" align="center">
          <Heading size="3">Errors</Heading>
          {errorCount > 0 && (
            <Badge color="red" size="1">
              {errorCount}
            </Badge>
          )}
        </Flex>

        <Flex direction="column" gap="2">
          {errors.length === 0 ? (
            <Callout.Root color="green" size="1">
              <Callout.Icon>
                <Info />
              </Callout.Icon>
              <Callout.Text>No errors found</Callout.Text>
            </Callout.Root>
          ) : (
            errors.map((error, index) => (
              <Callout.Root key={index} color="red" size="1">
                <Callout.Icon>
                  <AlertCircle />
                </Callout.Icon>
                <Callout.Text>
                  {error.message}
                  <br />
                  <Text size="1" color="gray">
                    {error.nodeId && `Node: ${error.nodeId}`}
                  </Text>
                </Callout.Text>
              </Callout.Root>
            ))
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

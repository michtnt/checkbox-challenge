import { Box, Card, Flex, Select, Separator, Text, TextField } from '@radix-ui/themes';
import { FieldError } from './FieldError';
import { FieldValidationResult } from '@/utils/validation';
import { ConditionalNodeData, ConditionalRoute } from '@/components/nodes/ConditionalNode';

type ConditionalNodeEditorProps = {
  formData: ConditionalNodeData;
  handleChange: (field: string, value: string | ConditionalRoute[]) => void;
  validationErrors: FieldValidationResult[];
};

export const ConditionalNodeEditor = ({
  formData,
  handleChange,
  validationErrors,
}: ConditionalNodeEditorProps) => {
  return (
    <Flex direction="column" gap="4">
      <Box>
        <Text size="2" weight="medium" mb="2">
          Condition Name
        </Text>
        <TextField.Root
          value={formData.customName || ''}
          onChange={(e) => handleChange('customName', e.target.value)}
          placeholder="Enter condition name"
        />
        <FieldError field="customName" validationErrors={validationErrors} />
      </Box>
      <Box>
        <Text size="2" weight="medium" mb="2">
          Field to Evaluate
        </Text>
        <TextField.Root
          value={formData.fieldToEvaluate || ''}
          onChange={(e) => handleChange('fieldToEvaluate', e.target.value)}
          placeholder="field_name"
        />
        <FieldError field="fieldToEvaluate" validationErrors={validationErrors} />
      </Box>
      <Box>
        <Text size="2" weight="medium" mb="2">
          Operator
        </Text>
        <Select.Root
          value={formData.operator || 'equals'}
          onValueChange={(val) => handleChange('operator', val)}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="equals">Equals</Select.Item>
            <Select.Item value="not_equals">Not Equals</Select.Item>
            <Select.Item value="is_empty">Is Empty</Select.Item>
            <Select.Item value="greater_than">Greater Than</Select.Item>
            <Select.Item value="less_than">Less Than</Select.Item>
            <Select.Item value="contains">Contains</Select.Item>
          </Select.Content>
        </Select.Root>
        <FieldError field="operator" validationErrors={validationErrors} />
      </Box>
      <Box>
        <Text size="2" weight="medium" mb="2">
          Value
        </Text>
        <TextField.Root
          value={formData.value || ''}
          onChange={(e) => handleChange('value', e.target.value)}
          placeholder="comparison value"
        />
        <FieldError field="value" validationErrors={validationErrors} />
      </Box>

      <Separator size="4" />

      <Text size="2" weight="bold">
        Routes
      </Text>

      {(formData.routes || []).map((route) => (
        <Card
          key={route.id}
          variant="surface"
          style={{
            padding: '12px',
            backgroundColor: route.id === 'true' ? 'var(--green-3)' : 'var(--red-3)',
          }}
        >
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Text size="2" weight="bold" color={route.id === 'true' ? 'green' : 'red'}>
                {route.id.toUpperCase()} Path
              </Text>
            </Flex>

            <Box>
              <Text size="1" mb="2">
                Route Label
              </Text>
              <TextField.Root
                size="1"
                value={route.label || ''}
                onChange={(e) => {
                  const newRoutes = (formData.routes || []).map((r) =>
                    r.id === route.id ? { ...r, label: e.target.value } : r
                  );
                  handleChange('routes', newRoutes);
                }}
                placeholder={route.id === 'true' ? 'e.g., Yes, Success' : 'e.g., No, Failed'}
              />
            </Box>

            <Box>
              <Text size="1" mb="2">
                Description (optional)
              </Text>
              <TextField.Root
                size="1"
                value={route.condition || ''}
                onChange={(e) => {
                  const newRoutes = (formData.routes || []).map((r) =>
                    r.id === route.id ? { ...r, condition: e.target.value } : r
                  );
                  handleChange('routes', newRoutes);
                }}
                placeholder="Describe this path"
              />
            </Box>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

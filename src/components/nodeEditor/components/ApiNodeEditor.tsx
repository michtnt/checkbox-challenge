import { Box, Flex, Select, Text, TextField } from '@radix-ui/themes';
import { FieldError } from './FieldError';
import { ApiNodeData } from '@/components/nodes/ApiNode';
import { FieldValidationResult } from '@/utils/validation';

type ApiNodeEditorProps = {
  formData: ApiNodeData;
  handleChange: (field: string, value: string) => void;
  validationErrors: FieldValidationResult[];
};

export const ApiNodeEditor = ({ formData, handleChange, validationErrors }: ApiNodeEditorProps) => {
  return (
    <Flex direction="column" gap="4">
      <Box>
        <Text size="2" weight="medium" mb="2">
          API URL
        </Text>
        <TextField.Root
          value={formData.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://api.example.com"
        />
        <FieldError field="url" validationErrors={validationErrors} />
      </Box>
      <Box>
        <Text size="2" weight="medium" mb="2">
          Method
        </Text>
        <Select.Root
          value={formData.method || 'GET'}
          onValueChange={(val) => handleChange('method', val)}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="GET">GET</Select.Item>
            <Select.Item value="POST">POST</Select.Item>
            <Select.Item value="PUT">PUT</Select.Item>
            <Select.Item value="DELETE">DELETE</Select.Item>
          </Select.Content>
        </Select.Root>
        <FieldError field="method" validationErrors={validationErrors} />
      </Box>
    </Flex>
  );
};

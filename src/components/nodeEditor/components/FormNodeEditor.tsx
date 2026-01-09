import { FormField, FormNodeData } from '@/components/nodes/FormNode';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  IconButton,
  Select,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';
import { FieldError } from './FieldError';
import { Plus, Trash2, X } from 'lucide-react';
import { FieldValidationResult } from '@/utils/validation';

type FormNodeEditorProps = {
  formData: FormNodeData;
  handleChange: (field: string, value: string | FormField[]) => void;
  validationErrors: FieldValidationResult[];
};

export const FormNodeEditor = ({
  formData,
  handleChange,
  validationErrors,
}: FormNodeEditorProps) => {
  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      name: '',
      label: '',
      type: 'string' as const,
      required: false,
    };
    const newFields = [...('fields' in formData ? formData.fields || [] : []), newField];
    handleChange('fields', newFields);
  };

  const removeField = (fieldId: string) => {
    const formNodeData = formData;
    const newFields = (formNodeData.fields || []).filter((f) => f.id !== fieldId);
    handleChange('fields', newFields);
  };

  const updateField = (
    fieldId: string,
    fieldProp: keyof FormField,
    value: string | boolean | string[]
  ) => {
    const formNodeData = formData;
    const newFields = (formNodeData.fields || []).map((f) =>
      f.id === fieldId ? { ...f, [fieldProp]: value } : f
    );
    handleChange('fields', newFields);
  };

  const addDropdownOption = (fieldId: string) => {
    const formNodeData = formData;
    const newFields = (formNodeData.fields || []).map((f) =>
      f.id === fieldId ? { ...f, options: [...(f.options || []), ''] } : f
    );
    handleChange('fields', newFields);
  };

  const updateDropdownOption = (fieldId: string, optionIndex: number, value: string) => {
    const formNodeData = formData;
    const newFields = (formNodeData.fields || []).map((f) => {
      if (f.id === fieldId) {
        const newOptions = [...(f.options || [])];
        newOptions[optionIndex] = value;
        return { ...f, options: newOptions };
      }
      return f;
    });
    handleChange('fields', newFields);
  };

  const removeDropdownOption = (fieldId: string, optionIndex: number) => {
    const formNodeData = formData;
    const newFields = (formNodeData.fields || []).map((f) => {
      if (f.id === fieldId) {
        const newOptions = [...(f.options || [])];
        newOptions.splice(optionIndex, 1);
        return { ...f, options: newOptions };
      }
      return f;
    });
    handleChange('fields', newFields);
  };

  return (
    <Flex direction="column" gap="4">
      <Box>
        <Text size="2" weight="medium" mb="2">
          Form Name
        </Text>
        <TextField.Root
          value={formData.customName || ''}
          onChange={(e) => handleChange('customName', e.target.value)}
          placeholder="Enter form name"
        />
        <FieldError field="customName" validationErrors={validationErrors} />
      </Box>

      <Separator size="4" />

      <Flex justify="between" align="center">
        <Text size="2" weight="bold">
          Fields
        </Text>
        <Button size="1" onClick={addField} style={{ gap: '4px' }}>
          <Plus size={14} />
          Add Field
        </Button>
      </Flex>

      {(formData.fields || []).map((field, index) => (
        <Card
          key={field.id}
          variant="surface"
          style={{ padding: '12px', backgroundColor: 'var(--gray-3)' }}
        >
          <Flex direction="column" gap="3">
            <Flex justify="between" align="center">
              <Text size="1" weight="bold" color="gray">
                Field {index + 1}
              </Text>
              <IconButton
                size="1"
                variant="ghost"
                color="red"
                onClick={() => removeField(field.id)}
              >
                <Trash2 size={14} />
              </IconButton>
            </Flex>

            <Box>
              <Text size="1" mb="2">
                Field Name
              </Text>
              <TextField.Root
                size="1"
                value={field.name || ''}
                onChange={(e) => updateField(field.id, 'name', e.target.value)}
                placeholder="field_name"
              />
              <FieldError field={`fields.${index}.name`} validationErrors={validationErrors} />
            </Box>

            <Box>
              <Text size="1" mb="2">
                Label
              </Text>
              <TextField.Root
                size="1"
                value={field.label || ''}
                onChange={(e) => updateField(field.id, 'label', e.target.value)}
                placeholder="Display Label"
              />
              <FieldError field={`fields.${index}.label`} validationErrors={validationErrors} />
            </Box>

            <Box>
              <Text size="1" mb="2">
                Type
              </Text>
              <Select.Root
                value={field.type || 'string'}
                onValueChange={(val) => updateField(field.id, 'type', val)}
                size="1"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="string">String</Select.Item>
                  <Select.Item value="number">Number</Select.Item>
                  <Select.Item value="dropdown">Dropdown</Select.Item>
                  <Select.Item value="checkbox">Checkbox</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {field.type === 'dropdown' && (
              <Box>
                <Flex justify="between" align="center" mb="2">
                  <Text size="1">Options</Text>
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => addDropdownOption(field.id)}
                    style={{ gap: '2px' }}
                  >
                    <Plus size={12} />
                  </Button>
                </Flex>
                <Flex direction="column" gap="2">
                  {(field.options || []).map((option, optIndex) => (
                    <Flex key={optIndex} gap="2" align="center">
                      <TextField.Root
                        size="1"
                        value={option}
                        onChange={(e) => updateDropdownOption(field.id, optIndex, e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                        style={{ flex: 1 }}
                      />
                      <IconButton
                        size="1"
                        variant="ghost"
                        color="red"
                        onClick={() => removeDropdownOption(field.id, optIndex)}
                      >
                        <X size={12} />
                      </IconButton>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            )}

            <Flex gap="2" align="center" style={{ marginTop: '4px' }}>
              <Checkbox
                checked={field.required || false}
                onCheckedChange={(checked) => updateField(field.id, 'required', checked)}
                size="1"
              />
              <Text size="1">Required</Text>
            </Flex>
          </Flex>
        </Card>
      ))}

      {(!formData.fields || formData.fields?.length === 0) && (
        <Box p="3">
          <Text size="2" align="center" color="gray">
            No fields added yet
          </Text>
        </Box>
      )}
    </Flex>
  );
};

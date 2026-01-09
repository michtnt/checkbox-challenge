import { FieldValidationResult } from '@/utils/validation';
import { Text } from '@radix-ui/themes';
import { AlertCircle } from 'lucide-react';

type FieldErrorProps = {
  field: string;
  validationErrors: FieldValidationResult[];
};

export const FieldError: React.FC<FieldErrorProps> = ({ field, validationErrors }) => {
  const fieldErrors = validationErrors.filter((err) => err.field === field);

  if (fieldErrors.length === 0) return null;

  return fieldErrors.map((field, index) => (
    <Text
      key={`${field.field}-${index}`}
      size="1"
      color="red"
      mt="1"
      as="div"
      style={{ whiteSpace: 'pre-line' }}
    >
      <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
      {field.error}
    </Text>
  ));
};

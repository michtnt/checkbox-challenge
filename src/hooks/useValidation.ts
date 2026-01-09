import { useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { validateWorkflow, ValidationError, FieldValidationResult } from '@/utils/validation';

export interface UseValidationResult {
  validationErrors: ValidationError[];
  nodeValidationErrors: Record<string, FieldValidationResult[]>;
  isWorkflowValid: boolean;
}

export interface UseValidationOptions {
  debounceMs?: number;
}

export const useValidation = (
  nodes: Node[],
  edges: Edge[],
  options: UseValidationOptions = {}
): UseValidationResult => {
  const { debounceMs = 1000 } = options;

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [nodeValidationErrors, setNodeValidationErrors] = useState<
    Record<string, FieldValidationResult[]>
  >({});

  // Validate workflow on nodes or edges change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Validating workflow...');
      const validationResult = validateWorkflow(nodes, edges);
      setValidationErrors(validationResult.errors);

      const nodeErrors: Record<string, FieldValidationResult[]> = {};
      validationResult.nodeResults.forEach((result) => {
        if (!result.isValid) {
          nodeErrors[result.nodeId] = result.errors;
        }
      });

      setNodeValidationErrors(nodeErrors);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [nodes, edges, debounceMs]);

  const isWorkflowValid = validationErrors.length === 0;

  return {
    validationErrors,
    nodeValidationErrors,
    isWorkflowValid,
  };
};

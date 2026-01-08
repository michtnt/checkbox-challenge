import { ApiNodeData } from '@/components/nodes/ApiNode';
import { ConditionalNodeData } from '@/components/nodes/ConditionalNode';
import { FormNodeData } from '@/components/nodes/FormNode';
import { WorkflowNodeData } from '@/components/WorkflowEditor';
import { Edge, Node } from '@xyflow/react';

import { z } from 'zod';

/** TYPES */
/**
 * Validation error structure
 */
export interface ValidationError {
  id: string;
  type: 'error';
  message: string;
  nodeId?: string;
}

export interface FieldValidationResult {
  field: string;
  isValid: boolean;
  error?: string;
}

export interface NodeValidationResult {
  nodeId: string;
  isValid: boolean;
  errors: FieldValidationResult[];
}

export interface WorkflowValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  nodeResults: NodeValidationResult[];
}

type NodeType = 'start' | 'form' | 'conditional' | 'api' | 'end';

/** BASE SCHEMA */
export const BaseNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['start', 'form', 'conditional', 'api', 'end']),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const BaseEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

/**
 * WORKFLOW SCHEMA
 */
export const WorkflowSchema = z
  .object({
    nodes: z.array(BaseNodeSchema),
    edges: z.array(BaseEdgeSchema),
  })
  .refine(
    (workflow) => {
      const startNodes = workflow.nodes.filter((node) => node.type === 'start');
      return startNodes.length === 1;
    },
    {
      message: 'Workflow must contain exactly 1 start block',
      path: ['nodes'],
    }
  )
  .refine(
    (workflow) => {
      const endNodes = workflow.nodes.filter((node) => node.type === 'end');
      return endNodes.length === 1;
    },
    {
      message: 'Workflow must contain exactly 1 end block',
      path: ['nodes'],
    }
  )
  .refine(
    (workflow) => {
      // start nodes don't need incoming connections
      const targetNodes = new Set(workflow.edges.map((e) => e.target));
      const disconnectedNodes = workflow.nodes.filter(
        (node) => node.type !== 'start' && !targetNodes.has(node.id)
      );

      return disconnectedNodes.length === 0;
    },
    {
      message: 'All nodes must be connected',
      path: ['edges'],
    }
  );

/** NODE SCHEMA */
/** FORM NODE */
export const FormFieldSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, 'Field name must be at least 2 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Field name must be alphanumeric only (no spaces)'),
  label: z.string().min(2, 'Field label must be at least 2 characters'),
  type: z.enum(['string', 'number', 'dropdown', 'checkbox']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

export const FormNodeSchema = z.object({
  label: z.string(),
  customName: z.string().min(3, 'Form name must be at least 3 characters'),
  fields: z.array(FormFieldSchema),
});

/** CONDITIONAL NODE */
export const ConditionalNodeSchema = z
  .object({
    label: z.string(),
    customName: z.string().min(3, 'Condition name must be at least 3 characters'),
    fieldToEvaluate: z.string().min(1, 'Field to evaluate is required'),
    operator: z
      .enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'is_empty'])
      .refine((val) => val !== undefined && val !== null, {
        message: 'Operator is required',
      }),
    value: z.string().optional(),
    routes: z
      .array(
        z.object({
          id: z.enum(['true', 'false']),
          label: z.string(),
          condition: z.string().optional(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.operator === 'is_empty') {
        return true;
      }

      // for all other operators, value is required
      return data.value !== undefined && data.value !== null && data.value.trim().length > 0;
    },
    {
      message: 'Value is required for this operator',
      path: ['value'],
    }
  );

/** API NODE */
export const APINodeSchema = z.object({
  label: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  url: z
    .string()
    .min(1, 'URL is required')
    .regex(/^https?:\/\/.+/, 'URL must start with http:// or https://'),
});

/** UTILS */
// Converts Zod validation errors to FieldValidationResult format
const convertZodErrors = (error: z.ZodError): FieldValidationResult[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'unknown',
    isValid: false,
    error: issue.message,
  }));
};

// Validates node data based on its type and returns validation results
type ValidateNodeParams = {
  data: WorkflowNodeData;
  type: NodeType;
};

export const validateNodeType = ({ data, type }: ValidateNodeParams): FieldValidationResult[] => {
  const schemaMap = {
    form: FormNodeSchema,
    api: APINodeSchema,
    conditional: ConditionalNodeSchema,
  };

  const schema = schemaMap[type];
  const result = schema.safeParse(data);

  if (result.success) {
    return [];
  }

  return convertZodErrors(result.error);
};

/** VALIDATION */
export const validateNode = (node: Node): NodeValidationResult => {
  let errors: FieldValidationResult[] = [];

  switch (node.type) {
    case 'form':
      errors = validateNodeType({ data: node.data as unknown as FormNodeData, type: 'form' });
      break;
    case 'conditional':
      errors = validateNodeType({
        data: node.data as unknown as ConditionalNodeData,
        type: 'conditional',
      });
      break;
    case 'api':
      errors = validateNodeType({ data: node.data as unknown as ApiNodeData, type: 'api' });
      break;
    default:
      break;
  }

  console.log('[NODE ERRORS]', errors);

  return {
    nodeId: node.id,
    isValid: errors.length === 0,
    errors,
  };
};

export const validateWorkflowStructure = (nodes: Node[], edges: Edge[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  const workflowData = { nodes, edges };
  const result = WorkflowSchema.safeParse(workflowData);

  console.log('[WORKFLOW ERRORS]', result.error?.issues);
  if (!result.success) {
    result.error.issues.forEach((issue, index) => {
      errors.push({
        id: `validation-${index}`,
        type: 'error',
        message: issue.message,
      });
    });
  }

  return errors;
};

// Validates the entire workflow
export const validateWorkflow = (nodes: Node[], edges: Edge[]): WorkflowValidationResult => {
  const workflowErrors = validateWorkflowStructure(nodes, edges);

  const nodeResults = nodes.map(validateNode);
  const nodeErrors: ValidationError[] = [];

  nodeResults.forEach((result) => {
    if (!result.isValid) {
      result.errors.forEach((error) => {
        const node = nodes.find((n) => n.id === result.nodeId);
        const nodeLabel = node?.data.customName || node?.data.label || 'Untitled Node';

        let message = error.error || 'Unknown error';

        // handle nested fields error
        if (error.field.includes('.')) {
          const fieldParts = error.field.split('.');
          if (fieldParts[0] === 'fields') {
            const fieldIndex = parseInt(fieldParts[1]) + 1;
            message = `Field ${fieldIndex}: ${message}`;
          }
        }

        nodeErrors.push({
          id: `${result.nodeId}_${error.field}`,
          type: 'error',
          message,
          nodeId: `${nodeLabel} ${result.nodeId}`,
        });
      });
    }
  });

  const allErrors = [...workflowErrors, ...nodeErrors];

  console.log('[ALL ERRORS]', allErrors);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    nodeResults,
  };
};

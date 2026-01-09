import { useState, useCallback, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useAutoSave, SavedWorkflowData } from './useAutoSave';

interface UseSaveRestoreWorkflowReturn {
  saveState: ReturnType<typeof useAutoSave>['saveState'];
  lastSaved: ReturnType<typeof useAutoSave>['lastSaved'];

  showSaveDialog: boolean;
  showRestoreDialog: boolean;

  setShowSaveDialog: (show: boolean) => void;
  setShowRestoreDialog: (show: boolean) => void;
  handleSave: () => void;
  handleRestoreWorkflow: () => SavedWorkflowData | null;
  handleDiscardSavedData: () => void;
}

export const useSaveRestoreWorkflow = (
  nodes: Node[],
  edges: Edge[]
): UseSaveRestoreWorkflowReturn => {
  const { saveState, lastSaved, hasSavedData, getSavedData, clearSavedData } = useAutoSave(
    nodes,
    edges
  );

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  // trigger dialog to restore saved workflow if available
  useEffect(() => {
    console.log('Checking for saved workflow data...');
    if (hasSavedData && nodes.length === 0) {
      setShowRestoreDialog(true);
    }
  }, [hasSavedData, nodes.length]);

  const handleSave = useCallback(() => {
    const workflowConfig = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      })),
      metadata: {
        name: 'Sample Workflow',
        version: '1.0.0',
        created: new Date().toISOString(),
      },
    };

    console.log('Workflow Configuration:', JSON.stringify(workflowConfig, null, 2));

    setShowSaveDialog(true);
  }, [nodes, edges]);

  const handleRestoreWorkflow = useCallback((): SavedWorkflowData | null => {
    const savedData = getSavedData();
    setShowRestoreDialog(false);

    return savedData;
  }, [getSavedData]);

  const handleDiscardSavedData = useCallback(() => {
    clearSavedData();
    setShowRestoreDialog(false);
  }, [clearSavedData]);

  return {
    saveState,
    lastSaved,
    showSaveDialog,
    showRestoreDialog,
    setShowSaveDialog,
    setShowRestoreDialog,
    handleSave,
    handleRestoreWorkflow,
    handleDiscardSavedData,
  };
};

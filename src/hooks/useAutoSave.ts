import { useEffect, useRef, useCallback, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { validateWorkflow } from '../utils/validation';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface SavedWorkflowData {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
  version: string;
}

export interface UseAutoSaveReturn {
  saveState: SaveState;
  lastSaved: Date | null;
  hasSavedData: boolean;
  getSavedData: () => SavedWorkflowData | null;
  clearSavedData: () => void;
}

const AUTOSAVE_KEY = 'workflow-autosave';
const DEBOUNCE_DELAY = 2000;

export const useAutoSave = (nodes: Node[], edges: Edge[]): UseAutoSaveReturn => {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for existing saved data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(AUTOSAVE_KEY);
      setHasSavedData(!!savedData);
    } catch (error) {
      console.log('[error] Failed to access localStorage:', error);
      setHasSavedData(false);
    }
  }, []);

  const saveToStorage = useCallback(async () => {
    try {
      // throw new Error('Simulated save error'); // simulate an error for testing
      const currentDate = new Date();
      setSaveState('saving');

      const workflowData: SavedWorkflowData = {
        nodes,
        edges,
        timestamp: currentDate.getTime(),
        version: '1.0.0',
      };

      const serializedData = JSON.stringify(workflowData);

      // https://stackoverflow.com/questions/2989284/what-is-the-max-size-of-localstorage-values
      if (serializedData.length > 5 * 1024 * 1024) {
        // 5 MB limit
        throw new Error('Workflow data too large for localStorage');
      }

      localStorage.setItem(AUTOSAVE_KEY, serializedData);

      setLastSaved(currentDate);
      setHasSavedData(true);
      setSaveState('saved');

      setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    } catch (error) {
      console.log('[error] Failed to save workflow:', error);
      setSaveState('error');

      setTimeout(() => {
        setSaveState('idle');
      }, 3000);
    }
  }, [nodes, edges]);

  // debounced auto-save effect
  useEffect(() => {
    if (nodes.length === 0) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // only save if workflow is valid
      const validationResult = validateWorkflow(nodes, edges);
      if (validationResult.isValid) {
        saveToStorage();
      }
    }, DEBOUNCE_DELAY);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [nodes, edges, saveToStorage]);

  // cleanup timeout on unmount (just in case)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
      setHasSavedData(false);
      setLastSaved(null);
    } catch (error) {
      console.log('[error] Failed to clear saved data:', error);
    }
  }, []);

  const getSavedData = useCallback((): SavedWorkflowData | null => {
    try {
      const savedData = localStorage.getItem(AUTOSAVE_KEY);
      if (!savedData) return null;

      const parsed = JSON.parse(savedData) as SavedWorkflowData;

      if (
        !Array.isArray(parsed.nodes) ||
        !Array.isArray(parsed.edges) ||
        !parsed.nodes ||
        !parsed.edges ||
        !parsed.timestamp
      ) {
        return null;
      }

      return parsed;
    } catch (error) {
      console.log('[error] Failed to retrieve saved data:', error);
      clearSavedData();
      return null;
    }
  }, [clearSavedData]);

  return {
    saveState,
    lastSaved,
    hasSavedData,
    getSavedData,
    clearSavedData,
  };
};

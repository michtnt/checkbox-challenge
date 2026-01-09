import React from 'react';
import { AlertDialog, Button, Flex } from '@radix-ui/themes';

interface WorkflowDialogsProps {
  showSaveDialog: boolean;
  showRestoreDialog: boolean;
  onSaveDialogChange: (open: boolean) => void;
  onRestoreDialogChange: (open: boolean) => void;
  onRestoreWorkflow: () => void;
  onDiscardSavedData: () => void;
}

/**
 * All dialogs related to workflow saving and restoring
 */
export const WorkflowDialogs: React.FC<WorkflowDialogsProps> = ({
  showSaveDialog,
  showRestoreDialog,
  onSaveDialogChange,
  onRestoreDialogChange,
  onRestoreWorkflow,
  onDiscardSavedData,
}) => {
  return (
    <>
      <AlertDialog.Root open={showSaveDialog} onOpenChange={onSaveDialogChange}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Workflow Saved</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Your workflow configuration has been saved to the browser console. Check the developer
            console for the complete configuration details.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </AlertDialog.Cancel>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={showRestoreDialog} onOpenChange={onRestoreDialogChange}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Restore Saved Workflow</AlertDialog.Title>
          <AlertDialog.Description size="2">
            We found a previously saved workflow. Would you like to restore it or start with a blank
            canvas?
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" onClick={onDiscardSavedData}>
                Start Fresh
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={onRestoreWorkflow}>Restore Workflow</Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

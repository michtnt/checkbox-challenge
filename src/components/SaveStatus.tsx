import { SaveState } from '@/hooks/useAutoSave';
import { formatRelativeTime } from '@/utils/helper';
import { Flex, Text } from '@radix-ui/themes';
import { CheckCircle, Clock, Loader, XCircle } from 'lucide-react';

type SaveStatusProps = {
  saveState: SaveState;
  lastSaved: Date | null;
};

export const SaveStatus: React.FC<SaveStatusProps> = ({ saveState, lastSaved }) => {
  return (
    <Flex align="center" gap="4">
      <Flex align="center" gap="2">
        {saveState === 'saving' && (
          <>
            <Loader size={16} className="animate-spin" />
            <Text size="2" color="gray">
              Saving...
            </Text>
          </>
        )}
        {saveState === 'saved' && (
          <>
            <CheckCircle size={16} color="#10b981" />
            <Text size="2" color="green">
              Saved {formatRelativeTime(lastSaved)}
            </Text>
          </>
        )}
        {saveState === 'error' && (
          <>
            <XCircle size={16} color="#ef4444" />
            <Text size="2" color="red">
              Save failed
            </Text>
          </>
        )}
        {saveState === 'idle' && lastSaved && (
          <>
            <Clock size={16} color="#6b7280" />
            <Text size="2" color="gray">
              Last saved {formatRelativeTime(lastSaved)}
            </Text>
          </>
        )}
      </Flex>
    </Flex>
  );
};

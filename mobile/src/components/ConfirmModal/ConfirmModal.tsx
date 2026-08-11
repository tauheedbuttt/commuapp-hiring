import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '../Button/Button';
import { styles } from './ConfirmModal.styles';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** A centered confirm/cancel dialog, for actions that need a "are you sure?" step before running. */
export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Button
              label={confirmLabel}
              variant={danger ? 'danger-outline' : 'primary'}
              onPress={onConfirm}
              style={styles.fullWidthButton}
            />
            <Button label={cancelLabel} variant="outline" onPress={onCancel} style={styles.fullWidthButton} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

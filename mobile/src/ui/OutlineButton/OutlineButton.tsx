import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { styles } from './OutlineButton.styles';

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
};

export function OutlineButton({ label, onPress, icon, loading, disabled }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryGreen} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={colors.primaryGreen} /> : null}
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

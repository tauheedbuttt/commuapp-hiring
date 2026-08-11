import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { colors } from '../../theme/colors';
import type { ButtonProps } from '../../types';
import { styles } from './Button.styles';

export function Button({ label, onPress, variant = 'primary', icon, disabled, loading }: ButtonProps) {
  const isDisabled = disabled || loading;
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        isOutline ? styles.outline : styles.primary,
        pressed && !isDisabled && (isOutline ? styles.outlinePressed : styles.primaryPressed),
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primaryGreen : colors.white} />
      ) : (
        <>
          {icon ? (
            <Ionicons name={icon} size={18} color={isOutline ? colors.primaryGreen : colors.white} />
          ) : null}
          <Text style={isOutline ? styles.outlineLabel : styles.primaryLabel}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { styles, VARIANT_STYLES } from './Button.styles';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger-outline';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  /** Escape hatch for layout overrides (e.g. stretching an outline button that defaults to hugging its content). */
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', icon, disabled, loading, style }: Props) {
  const isDisabled = disabled || loading;
  const { container, pressed: pressedStyle, label: labelStyle, tint } = VARIANT_STYLES[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles[container],
        pressed && !isDisabled && styles[pressedStyle],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tint} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={tint} /> : null}
          <Text style={styles[labelStyle]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

import type { Ionicons } from '@expo/vector-icons';
import type { TextInputProps } from 'react-native';

export type ButtonVariant = 'primary' | 'outline';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
};

export type TextFieldProps = {
  label: string;
} & TextInputProps;

export type PickerProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

export type InlineMessageProps = {
  children: string;
};

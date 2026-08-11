import { Text } from 'react-native';
import { styles } from './InlineMessage.styles';

type Props = {
  children: string;
  variant?: 'error' | 'neutral';
};

export function InlineMessage({ children, variant = 'error' }: Props) {
  return <Text style={[styles.text, variant === 'error' ? styles.error : styles.neutral]}>{children}</Text>;
}

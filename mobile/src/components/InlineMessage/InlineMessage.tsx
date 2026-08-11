import { Text } from 'react-native';
import type { InlineMessageProps } from '../../types';
import { styles } from './InlineMessage.styles';

export function InlineMessage({ children }: InlineMessageProps) {
  return <Text style={styles.text}>{children}</Text>;
}

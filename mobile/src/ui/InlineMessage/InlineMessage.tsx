import { Text } from 'react-native';
import { styles } from './InlineMessage.styles';

type Props = {
  tone: 'error' | 'info';
  children: string;
};

export function InlineMessage({ tone, children }: Props) {
  return <Text style={[styles.text, tone === 'error' ? styles.error : styles.info]}>{children}</Text>;
}

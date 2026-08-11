import { Text } from 'react-native';
import { styles } from './InlineMessage.styles';

type Props = {
  children: string;
};

export function InlineMessage({ children }: Props) {
  return <Text style={styles.text}>{children}</Text>;
}

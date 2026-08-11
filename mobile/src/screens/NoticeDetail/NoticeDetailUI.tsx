import { Text } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { styles } from './NoticeDetailUI.styles';

type Props = {
  id: string;
};

/** Placeholder — the real detail layout (consuming the `notice(id)` query) is separate future work. */
export function NoticeDetailUI({ id }: Props) {
  return (
    <ScreenContainer>
      <Text style={styles.text}>Notice</Text>
      <Text style={styles.id}>id: {id}</Text>
    </ScreenContainer>
  );
}

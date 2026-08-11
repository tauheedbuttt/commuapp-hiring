import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { NoticeDetailUI } from './NoticeDetailUI';

type Props = NativeStackScreenProps<RootStackParamList, 'NoticeDetail'>;

export function NoticeDetailScreen({ route }: Props) {
  return <NoticeDetailUI id={route.params.id} />;
}

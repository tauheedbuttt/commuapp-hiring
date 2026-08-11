import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@apollo/client/react';
import { NoticeDocument } from '../../api/generated/graphql';
import { useLocationStore } from '../../store/locationStore';
import type { RootStackParamList } from '../../types';
import { NoticeDetailUI } from './NoticeDetailUI';

type Props = NativeStackScreenProps<RootStackParamList, 'NoticeDetail'>;

export function NoticeDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const location = useLocationStore((state) => state.location);

  const { data, loading, refetch } = useQuery(NoticeDocument, {
    variables: {
      id,
      lat: location?.latitude ?? null,
      long: location?.longitude ?? null,
    },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <NoticeDetailUI
      notice={data?.notice ?? null}
      loading={loading}
      onRetry={refetch}
      onBack={() => navigation.goBack()}
    />
  );
}

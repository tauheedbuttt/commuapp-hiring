import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';
import { AreaSummaryDocument, NoticesWhereDistanceDocument } from '../../api/generated/graphql';
import { useDistanceStore } from '../../store/distanceStore';
import { useLocationStore } from '../../store/locationStore';
import type { RootStackParamList } from '../../types';
import type { NoticeListItem } from './components/NoticeCard';
import { HomeUI } from './HomeUI';

const PAGE_SIZE = 20;

export function HomeScreen() {
  const location = useLocationStore((state) => state.location);
  const distanceMeters = useDistanceStore((state) => state.distanceMeters);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const client = useApolloClient();

  const [notices, setNotices] = useState<NoticeListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoadedOnce = useRef(false);

  const {
    data: listData,
    loading: listLoading,
    error: listError,
    refetch: refetchList,
  } = useQuery(NoticesWhereDistanceDocument, {
    variables: {
      lat: location?.latitude ?? 0,
      long: location?.longitude ?? 0,
      distance: distanceMeters,
      first: PAGE_SIZE,
      page: 1,
    },
    skip: !location,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!listData) return;

    setNotices(listData.noticesWhereDistance.data);
    setPage(1);
    setHasMorePages(listData.noticesWhereDistance.paginatorInfo.hasMorePages);
    hasLoadedOnce.current = true;
  }, [listData]);

  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery(AreaSummaryDocument, {
    variables: {
      town: location?.city ?? '',
      lat: location?.latitude ?? 0,
      long: location?.longitude ?? 0,
      distance: distanceMeters,
    },
    skip: !location,
    notifyOnNetworkStatusChange: true,
  });

  async function handleEndReached() {
    if (!location || !hasMorePages || isLoadingMore || listLoading) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const { data } = await client.query({
        query: NoticesWhereDistanceDocument,
        variables: {
          lat: location.latitude,
          long: location.longitude,
          distance: distanceMeters,
          first: PAGE_SIZE,
          page: nextPage,
        },
        fetchPolicy: 'network-only',
      });

      if (!data) return;

      setNotices((prev) => [...prev, ...data.noticesWhereDistance.data]);
      setPage(nextPage);
      setHasMorePages(data.noticesWhereDistance.paginatorInfo.hasMorePages);
    } catch {
      // Load-more failures fail quietly — pull-to-refresh remains the recovery path.
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([refetchList(), refetchSummary()]);
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleNoticePress(id: string) {
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.navigate('NoticeDetail', { id });
  }

  const isInitialLoading = !hasLoadedOnce.current && listLoading;

  return (
    <HomeUI
      notices={notices}
      isInitialLoading={isInitialLoading}
      listError={!!listError && notices.length === 0}
      isLoadingMore={isLoadingMore}
      isRefreshing={isRefreshing}
      summaryLoading={summaryLoading}
      summaryError={!!summaryError}
      summary={summaryData?.areaSummary.summary ?? null}
      onRefresh={handleRefresh}
      onEndReached={handleEndReached}
      onRetry={() => refetchList()}
      onNoticePress={handleNoticePress}
    />
  );
}

import { useRef } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { Button } from '../../components/Button/Button';
import { InlineMessage } from '../../components/InlineMessage/InlineMessage';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { colors } from '../../theme/colors';
import { AreaSummaryCard } from './AreaSummaryCard';
import { AreaSummaryCardSkeleton } from './AreaSummaryCard/skeleton';
import { NoticeCard, type NoticeListItem } from './NoticeCard';
import { NoticeCardSkeleton } from './NoticeCard/skeleton';
import { styles } from './HomeUI.styles';

const INITIAL_SKELETON_COUNT = 2;

type Props = {
  notices: NoticeListItem[];
  isInitialLoading: boolean;
  listError: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  summaryLoading: boolean;
  summaryError: boolean;
  summary: string | null;
  onRefresh: () => void;
  onEndReached: () => void;
  onRetry: () => void;
  onNoticePress: (id: string) => void;
};

export function HomeUI({
  notices,
  isInitialLoading,
  listError,
  isLoadingMore,
  isRefreshing,
  summaryLoading,
  summaryError,
  summary,
  onRefresh,
  onEndReached,
  onRetry,
  onNoticePress,
}: Props) {
  const listRef = useRef<FlatList<NoticeListItem>>(null);
  useScrollToTop(listRef);

  if (isInitialLoading) {
    return (
      <ScreenContainer edges={["top"]}>
        <AreaSummaryCardSkeleton />
        {Array.from({ length: INITIAL_SKELETON_COUNT }).map((_, index) => (
          <NoticeCardSkeleton key={index} />
        ))}
      </ScreenContainer>
    );
  }

  if (listError && notices.length === 0) {
    return (
      <ScreenContainer edges={["top"]}>
        <AreaSummaryCard loading={summaryLoading} error={summaryError} summary={summary} />
        <View style={styles.errorState}>
          <InlineMessage>Couldn't load nearby help posts.</InlineMessage>
          <View style={styles.retryButton}>
            <Button label="Retry" variant="outline" onPress={onRetry} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} edges={["top"]}>
      <FlatList
        ref={listRef}
        data={notices}
        keyExtractor={(notice) => notice.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <NoticeCard notice={item} onPress={onNoticePress} />}
        ListHeaderComponent={
          <AreaSummaryCard loading={summaryLoading} error={summaryError} summary={summary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <InlineMessage variant="neutral">No nearby help posts yet. Pull down to check again.</InlineMessage>
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.primaryGreen} />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primaryGreen} />
        }
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
      />
    </ScreenContainer>
  );
}

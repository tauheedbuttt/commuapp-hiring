import { Image, Pressable, Text, View } from 'react-native';
import type { NoticesWhereDistanceQuery } from '../../../api/generated/graphql';
import { formatDistanceAway, noticeTypeTag, titleCase } from '../noticeTypeLabel';
import { styles } from './NoticeCard.styles';

export type NoticeListItem = NoticesWhereDistanceQuery['noticesWhereDistance']['data'][number];

type Props = {
  notice: NoticeListItem;
  onPress: (id: string) => void;
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

export function NoticeCard({ notice, onPress }: Props) {
  const typeTag = noticeTypeTag(notice.type);
  const categoryKey = notice.categories.main?.key;

  return (
    <Pressable style={styles.card} onPress={() => onPress(notice.id)}>
      <View style={styles.photo}>
        {notice.image?.url ? (
          <Image source={{ uri: notice.image.url }} style={styles.photoImage} />
        ) : null}
        <View style={styles.photoOverlay}>
          <Text style={styles.title} numberOfLines={2}>
            {notice.title}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.tagRow}>
          <View style={[styles.tag, { backgroundColor: typeTag.background }]}>
            <Text style={[styles.tagText, { color: typeTag.text }]}>{typeTag.label}</Text>
          </View>
          {categoryKey ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{titleCase(categoryKey)}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.date}>{formatDate(notice.created_at)}</Text>

        <View style={styles.ownerRow}>
          {notice.owner?.avatar_url ? (
            <Image source={{ uri: notice.owner.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar} />
          )}
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{notice.owner?.name ?? 'Someone'}</Text>
            {notice.distance_to_user != null ? (
              <Text style={styles.distance}>{formatDistanceAway(notice.distance_to_user)}</Text>
            ) : null}
          </View>
        </View>

        {notice.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {notice.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

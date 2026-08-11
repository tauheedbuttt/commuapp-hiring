import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from '../../components/Button/Button';
import { InlineMessage } from '../../components/InlineMessage/InlineMessage';
import { OwnerRow } from '../../components/OwnerRow/OwnerRow';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import type { NoticeQuery } from '../../api/generated/graphql';
import { colors } from '../../theme/colors';
import { formatDate, formatDistance, noticeTypeTag, titleCase } from '../../utils/notice';
import { NoticeDetailSkeleton } from './skeleton';
import { styles } from './NoticeDetailUI.styles';

const NOTICE_PLACEHOLDER_IMAGE = require('../../../assets/notice-placeholder.png');

const MAP_DELTA = 0.01;

type Notice = NonNullable<NoticeQuery['notice']>;

type Props = {
  notice: Notice | null;
  loading: boolean;
  onRetry: () => void;
  onBack: () => void;
};

function BackRow({ onBack }: { onBack: () => void }) {
  return (
    <Pressable style={styles.backRow} onPress={onBack} hitSlop={8}>
      <Ionicons name="chevron-back" size={22} color={colors.text} />
      <Text style={styles.backLabel}>Back</Text>
    </Pressable>
  );
}

export function NoticeDetailUI({ notice, loading, onRetry, onBack }: Props) {
  const [photoLoadFailed, setPhotoLoadFailed] = useState(false);

  useEffect(() => {
    setPhotoLoadFailed(false);
  }, [notice?.image?.url]);

  if (loading && !notice) {
    return (
      <ScreenContainer edges={['top']}>
        <BackRow onBack={onBack} />
        <NoticeDetailSkeleton />
      </ScreenContainer>
    );
  }

  // The notice(...) query is non-nullable on success, so a null notice past the
  // loading check only happens when the fetch failed.
  if (!notice) {
    return (
      <ScreenContainer edges={['top']}>
        <BackRow onBack={onBack} />
        <View style={styles.errorState}>
          <InlineMessage>Couldn't load this help post.</InlineMessage>
          <View style={styles.retryButton}>
            <Button label="Retry" variant="outline" onPress={onRetry} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const typeTag = noticeTypeTag(notice.type);
  const categoryKey = notice.categories.main?.key;

  return (
    <ScreenContainer edges={['top']}>
      <BackRow onBack={onBack} />

      <Text style={styles.title}>{notice.title}</Text>

      <View style={styles.imageWrapper}>
        <Image
          source={
            notice.image?.url && !photoLoadFailed
              ? { uri: notice.image.url }
              : NOTICE_PLACEHOLDER_IMAGE
          }
          onError={() => setPhotoLoadFailed(true)}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

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

      <OwnerRow
        owner={notice.owner}
        company={notice.company}
        avatarSize={74}
        ring
        style={styles.ownerRow}
        nameStyle={styles.ownerName}
      />

      <View style={styles.metaRow}>
        {notice.distance_to_user != null ? (
          <Text style={styles.metaLabel}>
            Distance: <Text style={styles.metaValue}>{formatDistance(notice.distance_to_user)}</Text>
          </Text>
        ) : null}
        <Text style={styles.metaLabel}>
          Created: <Text style={styles.metaValue}>{formatDate(notice.created_at)}</Text>
        </Text>
      </View>

      {notice.expires_at ? (
        <Text style={styles.metaLabel}>
          Valid <Text style={styles.metaValue}>until: {formatDate(notice.expires_at)}</Text>
        </Text>
      ) : null}

      <View style={styles.likeRow}>
        <Ionicons name="heart" size={28} color={colors.errorRed} />
        <Text style={styles.likeCount}>{notice.likes ?? 0}</Text>
      </View>

      {notice.description ? (
        <>
          <Text style={styles.sectionLabel}>Description:</Text>
          <Text style={styles.description}>{notice.description}</Text>
        </>
      ) : null}

      {notice.in_return ? (
        <View style={styles.inReturnCard}>
          <View style={styles.inReturnHeader}>
            <Text style={styles.inReturnLabel}>Given in return: </Text>
            <Ionicons name="checkmark-circle" size={18} color={colors.primaryGreen} />
            <Text style={styles.inReturnYes}>Yes</Text>
          </View>
          <Text style={styles.description}>{notice.in_return}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionLabel}>Location:</Text>
      <View style={styles.mapWrapper} pointerEvents="none">
        <MapView
          style={styles.map}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          region={{
            latitude: notice.position.latitude,
            longitude: notice.position.longitude,
            latitudeDelta: MAP_DELTA,
            longitudeDelta: MAP_DELTA,
          }}
        >
          <Marker
            coordinate={{
              latitude: notice.position.latitude,
              longitude: notice.position.longitude,
            }}
          />
        </MapView>
      </View>
    </ScreenContainer>
  );
}

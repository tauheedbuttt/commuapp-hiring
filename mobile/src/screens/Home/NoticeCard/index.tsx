import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { OwnerRow } from "../../../components/OwnerRow/OwnerRow";
import type { NoticesWhereDistanceQuery } from "../../../api/generated/graphql";
import { colors } from "../../../theme/colors";
import {
  formatDate,
  formatDistance,
  noticeTypeTag,
  titleCase,
} from "../../../utils/notice";
import { styles } from "./styles";

const NOTICE_PLACEHOLDER_IMAGE = require("../../../../assets/notice-placeholder.png");

export type NoticeListItem =
  NoticesWhereDistanceQuery["noticesWhereDistance"]["data"][number];

type Props = {
  notice: NoticeListItem;
  onPress: (id: string) => void;
};

export function NoticeCard({ notice, onPress }: Props) {
  const typeTag = noticeTypeTag(notice.type);
  const categoryKey = notice.categories.main?.key;

  const [photoLoadFailed, setPhotoLoadFailed] = useState(false);

  useEffect(() => {
    setPhotoLoadFailed(false);
  }, [notice.image?.url]);

  return (
    <Pressable style={styles.card} onPress={() => onPress(notice.id)}>
      <View style={styles.photo}>
        <Image
          source={
            notice.image?.url && !photoLoadFailed
              ? { uri: notice.image.url }
              : NOTICE_PLACEHOLDER_IMAGE
          }
          onError={() => setPhotoLoadFailed(true)}
          style={styles.photoImage}
          resizeMode="cover"
        />
        <View style={styles.photoShade} />

        {notice.distance_to_user != null ? (
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={14} color={colors.text} />
            <Text style={styles.distanceBadgeText}>
              {formatDistance(notice.distance_to_user)}
            </Text>
          </View>
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
            <Text style={[styles.tagText, { color: typeTag.text }]}>
              {typeTag.label}
            </Text>
          </View>
          {categoryKey ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{titleCase(categoryKey)}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.date}>{formatDate(notice.created_at)}</Text>

        <OwnerRow
          owner={notice.owner}
          company={notice.company}
          avatarSize={32}
          style={styles.ownerRow}
        />

        {notice.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {notice.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

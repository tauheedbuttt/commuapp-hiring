import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Pulse } from "../../../components/Pulse/Pulse";
import { colors } from "../../../theme/colors";
import { styles as skeletonStyles } from "../Skeleton.styles";
import { styles } from "./styles";

type Props = {
  loading: boolean;
  error: boolean;
  summary: string | null;
};

export function AreaSummaryCard({ loading, error, summary }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.header}
        onPress={() => setCollapsed((prev) => !prev)}
      >
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={14} color={colors.primaryGreen} />
          <Text style={styles.title}>Summary</Text>
        </View>
        <Ionicons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={18}
          color={colors.text}
        />
      </Pressable>

      {collapsed ? null : (
        <View style={styles.body}>
          {loading ? (
            <Pulse style={styles.loadingLines}>
              <View style={[skeletonStyles.lineBlock, { width: "100%" }]} />
              <View style={[skeletonStyles.lineBlock, { width: "90%" }]} />
              <View style={[skeletonStyles.lineBlock, { width: "60%" }]} />
            </Pulse>
          ) : error ? (
            <Text style={styles.errorText}>
              Couldn't load the area summary.
            </Text>
          ) : (
            <Text style={styles.summaryText}>{summary}</Text>
          )}
        </View>
      )}
    </View>
  );
}

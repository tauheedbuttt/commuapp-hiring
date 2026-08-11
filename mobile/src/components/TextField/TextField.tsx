import { Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../../theme/colors";
import { styles } from "./TextField.styles";

type Props = {
  label?: string;
} & TextInputProps;

export function TextField({ label, style, ...inputProps }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
    </View>
  );
}

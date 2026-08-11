import { Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../../theme/colors";
import { styles } from "./TextField.styles";

type Props = {
  label?: string;
  error?: string;
} & TextInputProps;

export function TextField({ label, error, style, ...inputProps }: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

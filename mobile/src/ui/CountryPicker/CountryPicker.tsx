import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COUNTRY_NAMES } from '../../data/countries';
import { colors } from '../../theme/colors';
import { styles } from './CountryPicker.styles';

type Props = {
  label: string;
  value: string;
  onChange: (country: string) => void;
};

export function CountryPicker({ label, value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COUNTRY_NAMES;
    return COUNTRY_NAMES.filter((country) => country.toLowerCase().includes(query));
  }, [search]);

  function handleSelect(country: string) {
    onChange(country);
    setSearch('');
    setIsOpen(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setIsOpen(true)}>
        <Text style={styles.value}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.text} />
      </Pressable>

      <Modal visible={isOpen} animationType="slide" onRequestClose={() => setIsOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select country</Text>
            <Pressable onPress={() => setIsOpen(false)} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <TextInput
            style={styles.search}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          <FlatList
            data={filteredCountries}
            keyExtractor={(country) => country}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.option} onPress={() => handleSelect(item)}>
                <Text style={styles.optionText}>{item}</Text>
                {item === value ? (
                  <Ionicons name="checkmark" size={20} color={colors.primaryGreen} />
                ) : null}
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

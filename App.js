import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CalendarPicker } from 'react-native-nepali-picker';
import { calculateAge } from '@sbmdkl/nepali-date-converter';
import './i18n';
import { useTranslation } from 'react-i18next';

// Hardcoded data inside the file for a guaranteed fix for the 'id' error
const districtData = [
  { id: 1, nameEn: "Kathmandu", nameNe: "काठमाडौं", campaignDate: "2080-12-01" },
  { id: 2, nameEn: "Jhapa", nameNe: "झापा", campaignDate: "2080-12-05" },
  { id: 3, nameEn: "Morang", nameNe: "मोरङ", campaignDate: "2081-01-10" },
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [selectedId, setSelectedId] = useState(1);
  const [dob, setDob] = useState('');
  const [ageResult, setAgeResult] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // Safely find the district
  const selectedDistrict = districtData.find(d => d.id === selectedId) || districtData[0];

  const handleCalculate = () => {
    if (!dob) {
      Alert.alert("Error", "Please select Date of Birth first");
      return;
    }
    // calculateAge takes "YYYY-MM-DD"
    const result = calculateAge(dob);
    setAgeResult(result);
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('title')}</Text>
          <TouchableOpacity style={styles.langBadge} onPress={toggleLanguage}>
            <Text style={styles.langText}>{i18n.language === 'en' ? 'नेपाली' : 'English'}</Text>
          </TouchableOpacity>
        </View>

        {/* District Card */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('district')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedId}
              onValueChange={(itemValue) => setSelectedId(itemValue)}
              style={styles.picker}
            >
              {districtData.map(d => (
                <Picker.Item 
                  key={d.id} 
                  label={i18n.language === 'en' ? d.nameEn : d.nameNe} 
                  value={d.id} 
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.subLabel}>
            {t('campaign')}: <Text style={{fontWeight: 'bold'}}>{selectedDistrict.campaignDate}</Text>
          </Text>
        </View>

        {/* DOB Card */}
        <View style={styles.card}>
          <Text style={styles.label}>{t('dob')}</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateButtonText}>{dob || "YYYY-MM-DD"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
          <Text style={styles.calcButtonText}>{t('calculate')}</Text>
        </TouchableOpacity>

        {/* Result Card */}
        {ageResult && (
          <View style={[styles.card, styles.resultCard]}>
            <Text style={styles.resultTitle}>{t('result_text') || 'Calculation Result'}</Text>
            <View style={styles.resultRow}>
              <ResultUnit value={ageResult.years} unit={t('years')} />
              <ResultUnit value={ageResult.months} unit={t('months')} />
              <ResultUnit value={ageResult.days} unit={t('days')} />
            </View>
          </View>
        )}

        <CalendarPicker
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onDateSelect={(date) => {
            setDob(date);
            setShowPicker(false);
          }}
          language={i18n.language === 'ne' ? 'ne' : 'en'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const ResultUnit = ({ value, unit }) => (
  <View style={styles.unitBox}>
    <Text style={styles.unitValue}>{value}</Text>
    <Text style={styles.unitLabel}>{unit}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  langBadge: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  langText: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  pickerContainer: { backgroundColor: '#f1f3f5', borderRadius: 8, marginBottom: 10 },
  picker: { height: 50 },
  subLabel: { fontSize: 15, color: '#444' },
  dateButton: { backgroundColor: '#f1f3f5', padding: 15, borderRadius: 8, alignItems: 'center' },
  dateButtonText: { fontSize: 18, fontWeight: '500', color: '#007AFF' },
  calcButton: { backgroundColor: '#28a745', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  calcButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultCard: { backgroundColor: '#e7f3ff', borderColor: '#007AFF', borderWidth: 1 },
  resultTitle: { textAlign: 'center', fontSize: 16, color: '#007AFF', marginBottom: 15, fontWeight: '600' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-around' },
  unitBox: { alignItems: 'center' },
  unitValue: { fontSize: 24, fontWeight: '800', color: '#1a1a1a' },
  unitLabel: { fontSize: 12, color: '#666' }
});
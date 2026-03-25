import i18n from "i18next";
import React, { useMemo, useState } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// @ts-ignore
import { CalendarPicker } from "react-native-nepali-picker";
// @ts-ignore
import NepaliDate from "nepali-date-converter";
import Particle from "../components/Particles";
import { geoData } from "../constants/geoData";
import { NightTheme, SpringTheme } from "../constants/theme";

// --- i18n Setup ---
const resources = {
  en: { translation: { title: "Anweshan", province: "Province", district: "District", dob: "Birth Date", calc: "Calculate Result", years: "Yrs", months: "Mths", days: "Days", start_res: "At Start", end_res: "At End" }},
  ne: { translation: { title: "अन्वेषण", province: "प्रदेश", district: "जिल्ला", dob: "जन्म मिति", calc: "हिसाव गर्नुहोस्", years: "वर्ष", months: "महिना", days: "दिन", start_res: "सुरुको मिति", end_res: "अन्तिम मिति" }}
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({ resources, lng: "ne", fallbackLng: "en", interpolation: { escapeValue: false }});
}

// --- Custom Components ---

const SelectionModal = ({ visible, data, title, onSelect, onClose, theme }: any) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={s.modalOverlay}>
      <View style={[s.modalContent, { backgroundColor: theme.bg }]}>
        <View style={s.modalHeader}>
          <Text style={[s.modalTitle, { color: theme.text }]}>{title}</Text>
          <TouchableOpacity onPress={onClose}><Text style={{color: theme.accent, fontWeight: 'bold'}}>Close</Text></TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[s.modalItem, { borderBottomColor: theme.card }]} 
              onPress={() => { onSelect(index, item.id); onClose(); }}
            >
              <Text style={{ color: theme.text, fontSize: 16 }}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

const AgeCard = ({ title, date, age, theme, t }: any) => (
  <View style={[s.resCard, { backgroundColor: theme.card }]}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.bg, pb: 10}}>
      <Text style={[s.resTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[s.resDate, { color: theme.accent }]}>{date}</Text>
    </View>
    <View style={s.resRow}>
      <View style={s.resBox}><Text style={[s.resNum, { color: theme.text }]}>{age.years}</Text><Text style={[s.resLab, { color: theme.accent }]}>{t("years")}</Text></View>
      <View style={s.resBox}><Text style={[s.resNum, { color: theme.text }]}>{age.months}</Text><Text style={[s.resLab, { color: theme.accent }]}>{t("months")}</Text></View>
      <View style={s.resBox}><Text style={[s.resNum, { color: theme.text }]}>{age.days}</Text><Text style={[s.resLab, { color: theme.accent }]}>{t("days")}</Text></View>
    </View>
  </View>
);

export default function App() {
  const { t, i18n: i18nInstance } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [provinceIdx, setProvinceIdx] = useState(0);
  const [districtId, setDistrictId] = useState(geoData[0].districts[0].id);
  const [dob, setDob] = useState("");
  const [results, setResults] = useState<any>(null);
  const [modals, setModals] = useState({ province: false, district: false, calendar: false });
  const [petals, setPetals] = useState<{id: string}[]>([]);

  const theme = isDarkMode ? NightTheme : SpringTheme;
  const lang = i18nInstance.language;

  const currentDistricts = useMemo(() => geoData[provinceIdx].districts, [provinceIdx]);
  const selectedDistrict = useMemo(() => currentDistricts.find(d => d.id === districtId) || currentDistricts[0], [districtId, currentDistricts]);

  const handleCalculate = () => {
    if (!dob) return Alert.alert("!", t("dob"));
    try {
      const bAd = new NepaliDate(dob).toJsDate();
      const sAd = new NepaliDate(selectedDistrict.start).toJsDate();
      const eAd = new NepaliDate(selectedDistrict.end).toJsDate();
      const diff = (b: Date, t: Date) => {
        let y = t.getFullYear() - b.getFullYear();
        let m = t.getMonth() - b.getMonth();
        let d = t.getDate() - b.getDate();
        if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        return { years: y, months: m, days: d };
      };
      setResults({ startAge: diff(bAd, sAd), endAge: diff(bAd, eAd) });
    } catch (e) { Alert.alert("Error", "Check date format"); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {petals.map(p => <Particle key={p.id} symbol={theme.particle} onComplete={() => {}} />)}
      </View>

      <ScrollView contentContainerStyle={s.container}>
        {/* Top Header Navigation */}
        <View style={s.navBar}>
          <Text style={[s.logo, { color: theme.text }]}>{t("title")}</Text>
          <View style={s.navActions}>
            <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={[s.iconBtn, {backgroundColor: theme.card}]}>
              <Text>{isDarkMode ? "☀️" : "🌙"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => i18nInstance.changeLanguage(lang === "en" ? "ne" : "en")} style={[s.iconBtn, {backgroundColor: theme.card}]}>
              <Text style={{color: theme.text, fontWeight: '700'}}>{lang === "en" ? "ने" : "EN"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Section */}
        <View style={[s.formCard, { backgroundColor: theme.card }]}>
          <Text style={[s.sectionLabel, { color: theme.accent }]}>GEOGRAPHIC INFO</Text>
          
          <TouchableOpacity style={s.selector} onPress={() => setModals({...modals, province: true})}>
            <Text style={s.inputLabel}>{t("province")}</Text>
            <Text style={[s.inputValue, {color: theme.text}]}>{lang === 'en' ? geoData[provinceIdx].provinceEn : geoData[provinceIdx].provinceNe}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.selector} onPress={() => setModals({...modals, district: true})}>
            <Text style={s.inputLabel}>{t("district")}</Text>
            <Text style={[s.inputValue, {color: theme.text}]}>{lang === 'en' ? selectedDistrict.nameEn : selectedDistrict.nameNe}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.selector, {borderBottomWidth: 0}]} onPress={() => setModals({...modals, calendar: true})}>
            <Text style={s.inputLabel}>{t("dob")}</Text>
            <Text style={[s.inputValue, {color: theme.text}]}>{dob || "YYYY-MM-DD"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.primaryBtn, { backgroundColor: theme.accent }]} onPress={handleCalculate}>
            <Text style={s.primaryBtnText}>{t("calc")}</Text>
          </TouchableOpacity>
        </View>

        {results && (
          <View style={{ marginTop: 20 }}>
            <AgeCard title={t("start_res")} date={selectedDistrict.start} age={results.startAge} theme={theme} t={t} />
            <AgeCard title={t("end_res")} date={selectedDistrict.end} age={results.endAge} theme={theme} t={t} />
          </View>
        )}
      </ScrollView>

      {/* Modals for Selection */}
      <SelectionModal 
        visible={modals.province} 
        title={t("province")}
        theme={theme}
        data={geoData.map(p => ({ label: lang === 'en' ? p.provinceEn : p.provinceNe }))}
        onSelect={(idx: number) => { setProvinceIdx(idx); setDistrictId(geoData[idx].districts[0].id); setResults(null); }}
        onClose={() => setModals({...modals, province: false})}
      />
      <SelectionModal 
        visible={modals.district} 
        title={t("district")}
        theme={theme}
        data={currentDistricts.map(d => ({ label: lang === 'en' ? d.nameEn : d.nameNe, id: d.id }))}
        onSelect={(idx: number, id: string) => { setDistrictId(id); setResults(null); }}
        onClose={() => setModals({...modals, district: false})}
      />

      <CalendarPicker
        visible={modals.calendar}
        onClose={() => setModals({...modals, calendar: false})}
        onDateSelect={(d: string) => { setDob(d); setResults(null); setModals({...modals, calendar: false}); }}
        language={(lang === "ne" ? "np" : "en") as "en" | "np"}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, marginTop: 10 },
  logo: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  navActions: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  formCard: { borderRadius: 24, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 12 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 15 },
  selector: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  inputLabel: { fontSize: 12, opacity: 0.5, marginBottom: 4, fontWeight: '600' },
  inputValue: { fontSize: 18, fontWeight: '700' },
  primaryBtn: { marginTop: 20, padding: 18, borderRadius: 18, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  primaryBtnText: { color: 'white', fontWeight: '900', fontSize: 16, textTransform: 'uppercase' },
  resCard: { borderRadius: 24, padding: 20, marginBottom: 16, elevation: 2 },
  resTitle: { fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  resDate: { fontSize: 13, fontWeight: '600' },
  resRow: { flexDirection: 'row', justifyContent: 'space-between' },
  resBox: { alignItems: 'center', flex: 1 },
  resNum: { fontSize: 32, fontWeight: '900' },
  resLab: { fontSize: 11, fontWeight: '800', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalItem: { paddingVertical: 18, borderBottomWidth: 1 }
});
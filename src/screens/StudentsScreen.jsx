import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const TEAM_COLORS = {
  QUTNIYYA: '#e53935',     // red
  JIRAHIYYA: '#43a047',    // green
  SWALAHIYYA: '#1e88e5',   // blue
};

export default function StudentsScreen() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTeam, setActiveTeam] = useState('QUTNIYYA');
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('*');
    setStudents(data || []);
    setLoading(false);
  };

  const filteredStudents = students.filter((s) => {
    const teamMatch = s.team?.toUpperCase() === activeTeam;
    const searchMatch = s.name?.toLowerCase().includes(search.toLowerCase());
    return teamMatch && searchMatch;
  });

  const countByTeam = (team) =>
    students.filter((s) => s.team === team).length;

  const navigateToStudentDetails = (student) => {
    navigation.navigate('StudentDetails', { studentId: student.id });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.safeTop}>
          <View style={styles.topBar}>
            <Text style={[styles.topTitle, { color: TEAM_COLORS[activeTeam] }]}>
              {activeTeam} STUDENTS
            </Text>
          </View>
        </View>

        {/* 🔍 SEARCH */}
        <TextInput
          style={styles.search}
          placeholder="Search student..."
          value={search}
          onChangeText={setSearch}
        />

        {/* 👥 TEAM FILTER (NO ALL) */}
        <View style={styles.row}>
          {['QUTNIYYA', 'JIRAHIYYA', 'SWALAHIYYA'].map((team) => (
            <TouchableOpacity
              key={team}
              onPress={() => setActiveTeam(team)}
              style={[
                styles.teamBtn,
                activeTeam === team && {
                  backgroundColor: TEAM_COLORS[team],
                },
              ]}
            >
              <Text
                style={[
                  styles.teamText,
                  activeTeam === team && { color: '#fff' },
                ]}
              >
                {team}
              </Text>
              <Text
                style={[
                  styles.count,
                  activeTeam === team && { color: '#fff' },
                ]}
              >
                {countByTeam(team)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 📋 STUDENT LIST */}
        {filteredStudents.length === 0 ? (
          <Text style={styles.empty}>
            No students in {activeTeam}
          </Text>
        ) : (
          filteredStudents.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.card, { borderLeftColor: TEAM_COLORS[s.team] }]}
              onPress={() => navigateToStudentDetails(s)}
            >
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.meta}>Class: {s.class}</Text>
              <Text style={[styles.meta, { color: TEAM_COLORS[s.team] }]}>
                Team: {s.team}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== STUDENT DETAILS SCREEN ====================
export function StudentDetailsScreen({ route }) {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [totalMark, setTotalMark] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    
    try {
      // Fetch student details
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      setStudent(studentData);

      // Fetch student's results with program names
      const { data: resultsData } = await supabase
        .from('results')
        .select('*, programs(name, category)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: true });

      setStudentResults(resultsData || []);

      // Fetch total marks
      const { data: totalData } = await supabase
        .from('totalmarkstudent')
        .select('*')
        .eq('student_id', studentId)
        .single();

      setTotalMark(totalData);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalMarks = () => {
    if (!studentResults || studentResults.length === 0) return 0;
    return studentResults.reduce((sum, r) => sum + (parseInt(r.mark) || 0), 0);
  };

  const formatPrizePlace = (prizePlace) => {
    if (!prizePlace && prizePlace !== 0) return '-';
    const num = parseInt(prizePlace);
    if (num === 1) return '1st Prize';
    if (num === 2) return '2nd Prize';
    if (num === 3) return '3rd Prize';
    return `${num}th Prize`;
  };

  if (loading) {
    return (
      <View style={stylesDetails.loader}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={stylesDetails.loadingText}>Loading student details...</Text>
      </View>
    );
  }

  const totalMarks = calculateTotalMarks();

  return (
    <SafeAreaView style={stylesDetails.container}>
      <ScrollView contentContainerStyle={stylesDetails.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity
          style={stylesDetails.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={stylesDetails.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Student Photo */}
        <View style={stylesDetails.photoContainer}>
          <View style={stylesDetails.photoPlaceholder}>
            <Text style={stylesDetails.photoText}>
              {student?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Student Info Box */}
        <View style={stylesDetails.infoBox}>
          <Text style={stylesDetails.studentName}>{student?.name}</Text>
          
          <View style={stylesDetails.infoRow}>
            <View style={stylesDetails.infoItem}>
              <Text style={stylesDetails.infoLabel}>Team</Text>
              <Text style={[stylesDetails.infoValue, { color: TEAM_COLORS[student?.team] }]}>
                {student?.team}
              </Text>
            </View>
            
            <View style={stylesDetails.infoDivider} />
            
            <View style={stylesDetails.infoItem}>
              <Text style={stylesDetails.infoLabel}>Class</Text>
              <Text style={stylesDetails.infoValue}>{student?.class}</Text>
            </View>
          </View>

          {totalMark?.category && (
            <View style={stylesDetails.categoryBox}>
              <Text style={stylesDetails.categoryText}>
                Category: {totalMark.category}
              </Text>
            </View>
          )}
        </View>

        {/* Program Results */}
        <View style={stylesDetails.resultsSection}>
          <Text style={stylesDetails.sectionTitle}>Program Results</Text>
          
          {studentResults.length === 0 ? (
            <Text style={stylesDetails.noResults}>No program results available</Text>
          ) : (
            <>
              {/* Table Header */}
              <View style={stylesDetails.tableHeader}>
                <Text style={stylesDetails.tableHeaderText}>PROGRAM</Text>
                <Text style={stylesDetails.tableHeaderText}>PRIZE</Text>
                <Text style={stylesDetails.tableHeaderText}>MARK</Text>
              </View>

              {/* Table Rows */}
              {studentResults.map((result, index) => (
                <View 
                  key={result.id} 
                  style={[
                    stylesDetails.tableRow,
                    index % 2 === 0 ? stylesDetails.evenRow : stylesDetails.oddRow
                  ]}
                >
                  <Text style={stylesDetails.programCell}>
                    {result.programs?.name || 'Unknown'}
                  </Text>
                  <Text style={stylesDetails.prizeCell}>
                    {formatPrizePlace(result.prize_place)}
                  </Text>
                  <Text style={stylesDetails.markCell}>{result.mark || 0}</Text>
                </View>
              ))}

              {/* 🆕 TOTAL ROW */}
              <View style={[stylesDetails.tableRow, stylesDetails.totalRow]}>
                <Text style={[stylesDetails.programCell, stylesDetails.totalText]}>
                  TOTAL
                </Text>
                <Text style={[stylesDetails.prizeCell, stylesDetails.totalText]}>
                  -
                </Text>
                <Text style={[stylesDetails.markCell, stylesDetails.totalText]}>
                  {totalMarks}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Total Marks Summary */}
        <View style={stylesDetails.totalSection}>
          <View style={stylesDetails.totalBox}>
            <Text style={stylesDetails.totalLabel}>Total Programs</Text>
            <Text style={stylesDetails.totalCount}>{studentResults.length}</Text>
          </View>
          
          <View style={stylesDetails.totalBox}>
            <Text style={stylesDetails.totalLabel}>Total Marks</Text>
            <Text style={stylesDetails.totalValue}>{totalMarks}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 14,
    textAlign: 'center',
    letterSpacing: 1,
  },
  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  safeTop: {
    marginBottom: 16,
  },
  topBar: {
    paddingTop: 15,
    paddingBottom: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  topTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  teamBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamText: {
    fontWeight: '700',
    fontSize: 13,
  },
  count: {
    fontSize: 11,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    marginHorizontal: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
    fontSize: 16,
  },
});

// Styles for Student Details Screen
const stylesDetails = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  backButton: {
    padding: 16,
    paddingTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '600',
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  photoText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  categoryBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 15,
    color: '#1a237e',
    fontWeight: '600',
  },
  resultsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 20,
    textAlign: 'center',
  },
  noResults: {
    textAlign: 'center',
    padding: 30,
    fontSize: 16,
    color: '#666',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a237e',
    paddingVertical: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 2,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f9fafb',
  },
  // 🆕 TOTAL ROW STYLES
  totalRow: {
    backgroundColor: '#f0f7ff',
    borderTopWidth: 2,
    borderTopColor: '#1a237e',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 0,
  },
  programCell: {
    flex: 2,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    paddingRight: 8,
  },
  prizeCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  markCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 15,
  },
  totalSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  totalBox: {
    alignItems: 'center',
    flex: 1,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  totalCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
  },
});
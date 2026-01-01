import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


const TEAM_COLORS = {
  QUTNIYYA: '#FF5252',     // red
  JIRAHIYYA: '#4CAF50',    // green
  SWALAHIYYA: '#2196F3',   // blue
};

const CATEGORY_COLORS = {
  'SUB JUNIOR': '#FF9800',
  'JUNIOR': '#2196F3',
  'SENIOR': '#4CAF50',
  'SUPER SENIOR': '#9C27B0',
};

const LeaderboardScreen = () => {
  const [teamTotals, setTeamTotals] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // ✅ ADD THIS


  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch team total marks
      const { data: teamData } = await supabase
        .from('totalmarkteam')
        .select('*')
        .order('totalmark', { ascending: false });

      setTeamTotals(teamData || []);

      // 2. Fetch top students with category
      const { data: studentData } = await supabase
        .from('totalmarkstudent')
        .select(`
          *,
          students (
            name,
            class,
            team
          )
        `)
        .order('totalmark', { ascending: false });

      // Group by category
      const categories = ['SUB JUNIOR', 'JUNIOR', 'SENIOR', 'SUPER SENIOR'];
      const categoryGroups = {};

      categories.forEach(cat => {
        categoryGroups[cat] = [];
      });

      // Group students by category
      studentData?.forEach(item => {
        const category = item.category?.toUpperCase();
        if (categories.includes(category)) {
          categoryGroups[category].push(item);
        }
      });

      // Sort each category and take top 3
      const allTopStudents = [];
      categories.forEach(cat => {
        const sorted = categoryGroups[cat]
          .sort((a, b) => b.totalmark - a.totalmark)
          .slice(0, 3); // Take only top 3 from each category
        allTopStudents.push({
          category: cat,
          students: sorted
        });
      });

      setTopStudents(allTopStudents);

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceIcon = (index) => {
    if (index === 0) return { icon: '🥇', label: '1st Place' };
    if (index === 1) return { icon: '🥈', label: '2nd Place' };
    if (index === 2) return { icon: '🥉', label: '3rd Place' };
    return { icon: '🏅', label: `${index + 1}th Place` };
  };

  const getStudentPlaceIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}th`;
  };

 const handleViewPrograms = (studentId) => {
  navigation.navigate('student', {
    screen: 'StudentDetails',
    params: { studentId },
  });
};



  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading Leaderboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏆 LEADERBOARD</Text>
          <Text style={styles.headerSubtitle}>Team Rankings & Top Performers</Text>
        </View>

        {/* Team Ranking Section */}
        <Text style={styles.sectionTitle}>TEAM RANKING</Text>
        
        <View style={styles.teamContainer}>
          {teamTotals.map((team, index) => {
            const place = getPlaceIcon(index);
            return (
              <View 
                key={team.id} 
                style={[
                  styles.teamCard,
                  { borderColor: TEAM_COLORS[team.teamname] }
                ]}
              >
                <View style={styles.teamHeader}>
                  <Text style={[
                    styles.teamName,
                    { color: TEAM_COLORS[team.teamname] }
                  ]}>
                    {team.teamname}
                  </Text>
                  <View style={styles.placeBadge}>
                    <Text style={styles.placeIcon}>{place.icon}</Text>
                    <Text style={styles.placeLabel}>{place.label}</Text>
                  </View>
                </View>
                
                <View style={styles.teamStats}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{team.totalmark || 0}</Text>
                    <Text style={styles.statLabel}>Total Points</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Top Students by Category */}
        <Text style={styles.sectionTitle}>TOP STUDENTS BY CATEGORY</Text>
        
        {topStudents.map((categoryData, catIndex) => (
          <View key={catIndex} style={styles.categorySection}>
            {/* Category Header */}
            <View style={[
              styles.categoryHeader,
              { backgroundColor: CATEGORY_COLORS[categoryData.category] }
            ]}>
              <Text style={styles.categoryTitle}>{categoryData.category} CATEGORY</Text>
            </View>

            {/* Students List - Only show top 3 */}
            {categoryData.students.map((student, index) => (
              <View 
                key={student.id}
                style={[
                  styles.studentCard,
                  index % 2 === 0 ? styles.evenCard : styles.oddCard
                ]}
              >
                <View style={styles.studentHeader}>
                  <View style={styles.studentRank}>
                    <Text style={styles.rankIcon}>{getStudentPlaceIcon(index)}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>
                      {student.students?.name || 'Unknown Student'}
                    </Text>
                    <View style={styles.studentMeta}>
                      <View style={styles.metaItem}>
                        <Icon name="school" size={14} color="#666" />
                        <Text style={styles.metaText}>
                          Class: {student.students?.class || 'N/A'}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <View 
                          style={[
                            styles.teamDot, 
                            { backgroundColor: TEAM_COLORS[student.students?.team] }
                          ]} 
                        />
                        <Text style={styles.metaText}>
                          Team: {student.students?.team || 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.studentScore}>
                    <Text style={styles.scoreNumber}>{student.totalmark || 0}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
  style={styles.viewProgramsBtn}
  onPress={() => handleViewPrograms(student.student_id)}
>
  <Text style={styles.viewProgramsText}>
    <Icon name="list-alt" size={14} /> Click to view all programs ...
  </Text>
</TouchableOpacity>

              </View>
            ))}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 School Competition Leaderboard</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ==================== STUDENT DETAILS SCREEN ====================
export function StudentDetailsScreen({ route }) {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <ScrollView 
        contentContainerStyle={stylesDetails.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========== HEADER WITH BACK BUTTON ========== */}
        <View style={stylesDetails.header}>
          <TouchableOpacity
            style={stylesDetails.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={stylesDetails.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={stylesDetails.headerTitle}>Student Details</Text>
          <View style={{ width: 60 }} /> {/* Spacer for balance */}
        </View>

        {/* ========== STUDENT PHOTO ========== */}
        <View style={stylesDetails.photoSection}>
          <View style={stylesDetails.photoContainer}>
            <View style={stylesDetails.photoPlaceholder}>
              <Text style={stylesDetails.photoText}>
                {student?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* ========== STUDENT INFO SECTION ========== */}
        <View style={stylesDetails.infoSection}>
          <Text style={stylesDetails.studentName}>{student?.name}</Text>
          
          <View style={stylesDetails.infoGrid}>
            <View style={stylesDetails.infoItem}>
              <View style={[stylesDetails.teamBadge, { backgroundColor: TEAM_COLORS[student?.team] }]}>
                <Text style={stylesDetails.teamText}>TEAM</Text>
              </View>
              <Text style={[stylesDetails.infoValue, { color: TEAM_COLORS[student?.team] }]}>
                {student?.team}
              </Text>
            </View>
            
            <View style={stylesDetails.infoItem}>
              <View style={stylesDetails.classBadge}>
                <Text style={stylesDetails.classText}>CLASS</Text>
              </View>
              <Text style={stylesDetails.infoValue}>{student?.class}</Text>
            </View>
          </View>
        </View>

        {/* ========== PROGRAM RESULTS TITLE ========== */}
        <View style={stylesDetails.sectionTitleContainer}>
          <Text style={stylesDetails.sectionTitle}>Program Results</Text>
        </View>

        {/* ========== PROGRAM RESULTS TABLE ========== */}
        {studentResults.length === 0 ? (
          <View style={stylesDetails.noResultsContainer}>
            <Text style={stylesDetails.noResultsText}>No program results available</Text>
          </View>
        ) : (
          <View style={stylesDetails.tableContainer}>
            {/* Table Header */}
            <View style={stylesDetails.tableHeader}>
              <Text style={[stylesDetails.tableHeaderText, stylesDetails.programHeader]}>
                PROGRAM NAME
              </Text>
              <Text style={[stylesDetails.tableHeaderText, stylesDetails.prizeHeader]}>
                PRIZE
              </Text>
              <Text style={[stylesDetails.tableHeaderText, stylesDetails.markHeader]}>
                MARK
              </Text>
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
                <Text style={[stylesDetails.tableCell, stylesDetails.programCell]}>
                  {result.programs?.name || 'Unknown'}
                </Text>
                <Text style={[stylesDetails.tableCell, stylesDetails.prizeCell]}>
                  {formatPrizePlace(result.prize_place)}
                </Text>
                <Text style={[stylesDetails.tableCell, stylesDetails.markCell]}>
                  {result.mark || 0}
                </Text>
              </View>
            ))}

            {/* Total Row */}
            <View style={[stylesDetails.tableRow, stylesDetails.totalRow]}>
              <Text style={[stylesDetails.tableCell, stylesDetails.totalText, stylesDetails.programCell]}>
                TOTAL
              </Text>
              <Text style={[stylesDetails.tableCell, stylesDetails.totalText, stylesDetails.prizeCell]}>
                -
              </Text>
              <Text style={[stylesDetails.tableCell, stylesDetails.totalText, stylesDetails.markCell]}>
                {totalMarks}
              </Text>
            </View>
          </View>
        )}

        {/* ========== SUMMARY SECTION ========== */}
        <View style={stylesDetails.summarySection}>
          <View style={stylesDetails.summaryContainer}>
            <View style={stylesDetails.summaryItem}>
              <Text style={stylesDetails.summaryLabel}>Total Programs</Text>
              <Text style={stylesDetails.summaryValue}>{studentResults.length}</Text>
            </View>
            
            <View style={stylesDetails.divider} />
            
            <View style={stylesDetails.summaryItem}>
              <Text style={stylesDetails.summaryLabel}>Total Marks</Text>
              <Text style={stylesDetails.summaryValue}>{totalMarks}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A237E',
    letterSpacing: 1,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  teamContainer: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  placeBadge: {
    alignItems: 'center',
  },
  placeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  placeLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  teamStats: {
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A237E',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: 25,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  studentCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  evenCard: {
    backgroundColor: '#fff',
  },
  oddCard: {
    backgroundColor: '#F9F9F9',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentRank: {
    marginRight: 15,
    width: 30,
    alignItems: 'center',
  },
  rankIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  studentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 3,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  teamDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  studentScore: {
    marginLeft: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A237E',
  },
  viewProgramsBtn: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  viewProgramsText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

const stylesDetails = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 20,
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
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1a237e',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  
  // Photo Section
  photoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
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
    fontSize: 52,
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Info Section
  infoSection: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 25,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 40,
  },
  infoItem: {
    alignItems: 'center',
  },
  teamBadge: {
    backgroundColor: '#e53935',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  classBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  teamText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  classText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // Section Title
  sectionTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
  },
  
  // No Results
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  // Table Styles
  tableContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a237e',
    paddingVertical: 16,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  programHeader: {
    flex: 2,
    textAlign: 'left',
    paddingLeft: 15,
  },
  prizeHeader: {
    flex: 1,
  },
  markHeader: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  programCell: {
    flex: 2,
    textAlign: 'left',
    paddingLeft: 15,
    paddingRight: 10,
    fontWeight: '500',
  },
  prizeCell: {
    flex: 1,
    fontWeight: '500',
  },
  markCell: {
    flex: 1,
    fontWeight: '500',
  },
  totalRow: {
    backgroundColor: '#f0f7ff',
    borderTopWidth: 2,
    borderTopColor: '#1a237e',
    borderBottomWidth: 0,
  },
  totalText: {
    fontWeight: 'bold',
    color: '#1a237e',
    fontSize: 15,
  },
  
  // Summary Section
  summarySection: {
    paddingHorizontal: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 10,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
});

export default LeaderboardScreen;
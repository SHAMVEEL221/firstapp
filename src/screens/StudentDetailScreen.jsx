import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

const StudentDetailScreen = ({ route }) => {
  const { studentId } = route.params;

  const [student, setStudent] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      // Student info
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      // Programs
      const { data: programData } = await supabase
        .from('program_results')
        .select('*')
        .eq('student_id', studentId)
        .order('mark', { ascending: false });

      setStudent(studentData);
      setPrograms(programData || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const totalMarks = programs.reduce((sum, p) => sum + (p.mark || 0), 0);

  return (
    <ScrollView style={styles.container}>
      {/* STUDENT PHOTO */}
      <View style={styles.photoContainer}>
        <Image
          source={{
            uri:
              student.photo ||
              'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.photo}
        />
      </View>

      {/* INFO BOX */}
      <View style={styles.infoBox}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.info}>Team: {student.team}</Text>
        <Text style={styles.info}>Class: {student.class}</Text>
        <Text style={styles.info}>Category: {student.category}</Text>
      </View>

      {/* PROGRAM LIST */}
      <Text style={styles.sectionTitle}>Programs</Text>

      {programs.map((p, index) => (
        <View key={p.id} style={styles.programCard}>
          <Text style={styles.programName}>{p.program_name}</Text>
          <Text>Rank: {p.rank}</Text>
          <Text>Mark: {p.mark}</Text>
        </View>
      ))}

      {/* SUMMARY */}
      <View style={styles.summaryBox}>
        <Text>Total Programs: {programs.length}</Text>
        <Text>Total Marks: {totalMarks}</Text>
      </View>
    </ScrollView>
  );
};

export default StudentDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoBox: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 20,
    marginBottom: 10,
  },
  programCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryBox: {
    backgroundColor: '#E3F2FD',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
});

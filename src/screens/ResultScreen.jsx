import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal } from 'react-native';

const ProgramsScreen = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [programResultsMap, setProgramResultsMap] = useState({});


  const categories = [
    { id: 'All', label: 'All', color: '#6366f1', gradient: ['#6366f1', '#8b5cf6'] },
    { id: 'Sub Junior', label: 'Sub Junior', color: '#ef4444', gradient: ['#ef4444', '#f97316'] },
    { id: 'Junior', label: 'Junior', color: '#10b981', gradient: ['#10b981', '#14b8a6'] },
    { id: 'Senior', label: 'Senior', color: '#3b82f6', gradient: ['#3b82f6', '#6366f1'] },
    { id: 'Super Senior', label: 'Super Senior', color: '#8b5cf6', gradient: ['#8b5cf6', '#a855f7'] },
    { id: 'General', label: 'General', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },
  ];

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [programs, activeCategory, searchQuery]);

  fetchPrograms 

  const fetchPrograms = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
  } else {
    setPrograms(data || []);
    checkProgramResults(data || []); // ✅ GREEN / RED DOT FIX
  }

  setLoading(false);
  setRefreshing(false);
};


  const fetchResults = async (program) => {
    setSelectedProgram(program);
    setModalVisible(true);
    setResults([]);
    setResultsLoading(true);

    if (program.category === 'General') {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('program_id', program.id)
        .order('prize_place', { ascending: true, nullsLast: true });


      if (error) {
        console.error('Error fetching team results:', error);
        setResults([]);
      } else {
        setResults(data || []);
      }
    } else {
      const { data, error } = await supabase
        .from('results')
        .select(`
          id,
          prize_place,
          mark,
          students (
            name
          )
        `)
        .eq('program_id', program.id)
        .order('prize_place', { ascending: true, nullsLast: true });


      if (error) {
        console.error('Error fetching student results:', error);
        setResults([]);
      } else {
        setResults(data || []);
      }
    }
    setResultsLoading(false);
  };

  const checkProgramResults = async (programs) => {
  let map = {};

  for (const program of programs) {
    if (program.category === 'General') {
      const { data, error } = await supabase
        .from('teams')
        .select('id')
        .eq('program_id', program.id)
        .not('prize_place', 'is', null)
        .limit(1);

      map[program.id] = !error && data && data.length > 0;
    } else {
      const { data, error } = await supabase
        .from('results')
        .select('id')
        .eq('program_id', program.id)
        .not('prize_place', 'is', null)
        .limit(1);

      map[program.id] = !error && data && data.length > 0;
    }
  }

  setProgramResultsMap(map);
};



 const onRefresh = () => {
  setRefreshing(true);
  fetchPrograms(); // fetchPrograms already checks results
};



  const filterPrograms = () => {
    let filtered = [...programs];

    if (activeCategory !== 'All') {
      filtered = filtered.filter(
        (program) => program.category === activeCategory
      );
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (program) =>
          program.name?.toLowerCase().includes(query) ||
          program.category?.toLowerCase().includes(query)
      );
    }

    setFilteredPrograms(filtered);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Sub Junior': return '#ef4444';
      case 'Junior': return '#10b981';
      case 'Senior': return '#3b82f6';
      case 'Super Senior': return '#8b5cf6';
      case 'General': return '#f59e0b';
      default: return '#6366f1';
    }
  };

  const getCategoryGradient = (category) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.gradient : ['#6366f1', '#8b5cf6'];
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading programs...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Programs</Text>
          <Text style={styles.subtitle}>Browse and manage all events</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshBtn}
          onPress={fetchPrograms}
        >
          <Ionicons name="refresh" size={22} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search programs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((category) => {
              const count = category.id === 'All' 
                ? programs.length 
                : programs.filter(p => p.category === category.id).length;
              
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setActiveCategory(category.id)}
                  style={[
                    styles.categoryCard,
                    activeCategory === category.id && { 
                      shadowColor: category.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                    },
                  ]}
                >
                  <View style={[
                    styles.categoryGradient,
                    activeCategory === category.id && { 
                      backgroundColor: category.color,
                    },
                    activeCategory !== category.id && { 
                      borderColor: '#e2e8f0',
                    },
                  ]}>
                    <View style={styles.categoryHeader}>
                      <Text style={[
                        styles.categoryLabel,
                        activeCategory === category.id && styles.activeCategoryLabel,
                      ]}>
                        {category.label}
                      </Text>
                      <View style={[
                        styles.countBadge,
                        activeCategory === category.id && styles.activeCountBadge,
                      ]}>
                        <Text style={[
                          styles.countText,
                          activeCategory === category.id && styles.activeCountText,
                        ]}>
                          {count}
                        </Text>
                      </View>
                    </View>
                    {activeCategory === category.id && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>
              {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
            </Text>
            {(searchQuery || activeCategory !== 'All') && (
              <View style={styles.filtersContainer}>
                {searchQuery && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>Search: "{searchQuery}"</Text>
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Ionicons name="close" size={14} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                )}
                {activeCategory !== 'All' && (
                  <View style={[styles.filterTag, { backgroundColor: `${getCategoryColor(activeCategory)}15` }]}>
                    <Text style={[styles.filterTagText, { color: getCategoryColor(activeCategory) }]}>
                      Category: {activeCategory}
                    </Text>
                    <TouchableOpacity onPress={() => setActiveCategory('All')}>
                      <Ionicons name="close" size={14} color={getCategoryColor(activeCategory)} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalText}>Total: {programs.length}</Text>
          </View>
        </View>

        {/* Programs List */}
        {filteredPrograms.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar" size={50} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>No programs found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : activeCategory !== 'All'
                ? `No programs in ${activeCategory} category`
                : 'No programs available yet'}
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={fetchPrograms}
            >
              <Ionicons name="refresh" size={18} color="#ffffff" />
              <Text style={styles.emptyButtonText}>Refresh List</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredPrograms.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.programCard}
              onPress={() => fetchResults(item)}
              activeOpacity={0.9}
            >
              <View style={styles.programCardContent}>
              <View
  style={[
    styles.statusDot,
    {
     backgroundColor: programResultsMap[item.id] === true
  ? '#22c55e'
  : '#ef4444'

    },
  ]}
/>

                <View style={styles.programHeader}>
                  <View style={styles.programInfo}>
                    <Text style={styles.programName} numberOfLines={1}>{item.name}</Text>
                    <View style={[styles.categoryPill, { backgroundColor: `${getCategoryColor(item.category)}15` }]}>
                      <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(item.category) }]} />
                      <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                        {item.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.programArrow}>
                    <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
                  </View>
                </View>
                
                {item.description && (
                  <Text style={styles.programDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}

                <View style={styles.programFooter}>
                  <View style={styles.dateContainer}>
                    <Ionicons name="time-outline" size={14} color="#64748b" />
                    <Text style={styles.dateText}>
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <View style={styles.resultsBadge}>
                    <Ionicons name="trophy" size={14} color="#f59e0b" />
                    <Text style={styles.resultsText}>View Results</Text>
                  </View>
                </View>
              </View>

            </TouchableOpacity>
          ))
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Results Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedProgram?.name}</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              {selectedProgram?.category === 'General' ? 'Team Results' : 'Student Results'}
            </Text>

            {resultsLoading ? (
              <View style={styles.resultsLoader}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading results...</Text>
              </View>
            ) : results.length === 0 ? (
              <View style={styles.noResults}>
                <Ionicons name="trophy-outline" size={50} color="#cbd5e1" />
                <Text style={styles.noResultsText}>No results available</Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.resultsList}
                showsVerticalScrollIndicator={false}
              >
                {results.map((item, index) => (
                  <View key={item.id} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>
  {item.prize_place ? `#${item.prize_place}` : '—'}
</Text>

                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultName}>
                          {selectedProgram?.category === 'General' 
                            ? item.team 
                            : item.students?.name || 'Unknown'}
                        </Text>
                        <View style={styles.resultDetails}>
                          <View style={styles.detailItem}>
                            <Ionicons name="trophy" size={14} color="#f59e0b" />
                            <Text style={styles.detailText}>
                              {item.prize_place ? `Place: ${item.prize_place}` : 'No placement'}
                            </Text>
                          </View>
                          <View style={styles.detailItem}>
                            <Ionicons name="star" size={14} color="#6366f1" />
                            <Text style={styles.detailText}>
                              {item.mark || item.marks ? `Marks: ${item.mark || item.marks}` : 'No marks'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loaderCard: {
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    padding: 0,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 4,
  },
  categoryContent: {
    paddingRight: 20,
    gap: 12,
  },
  categoryCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 140,
  },
  categoryGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  activeCategoryLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  activeCountText: {
    color: '#ffffff',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterTagText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  totalBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  totalText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  programCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  programCardContent: {
    padding: 20,
  },
  statusDot: {
  position: 'absolute',
  bottom: 14,
  right: 14,
  width: 12,
  height: 12,
  borderRadius: 6,
  borderWidth: 2,
  borderColor: '#ffffff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 4,
},

  programHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  programArrow: {
    marginLeft: 8,
  },
  programDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  programFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  resultsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  resultsText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginHorizontal: 20,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 40,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyButtonText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultsLoader: {
    padding: 40,
    alignItems: 'center',
  },
  resultsList: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  resultDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 12,
  },
  scrollContent: {
  flexGrow: 1,
  paddingBottom: 100, // 👈 IMPORTANT (tab bar height + space)
},

});

export default ProgramsScreen;
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { height } = Dimensions.get('window');

const AdvancedRefreshScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 0],
    extrapolate: 'clamp',
  });
  
  const opacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Text style={[styles.headerTitle, { opacity }]}>
          Pull to Refresh Demo
        </Animated.Text>
        {refreshing && (
          <View style={styles.refreshAnimation}>
            <View style={styles.spinner} />
            <Text style={styles.refreshingText}>Refreshing...</Text>
          </View>
        )}
      </Animated.View>

      {/* ScrollView */}
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.content}
      >
        <View style={styles.placeholder} />
        
        {/* Content */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Content Card 1</Text>
          <Text style={styles.cardText}>Swipe down to see refresh animation</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Content Card 2</Text>
          <Text style={styles.cardText}>Pull down from the top</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.buttonText}>Manual Refresh</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshAnimation: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
    marginRight: 10,
    animation: 'spin 1s linear infinite',
  },
  refreshingText: {
    color: 'white',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 120,
  },
  placeholder: {
    height: 100,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdvancedRefreshScreen;
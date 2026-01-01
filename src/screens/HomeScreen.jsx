import React, { useState } from 'react';

import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  Modal,
  Alert,
  Share,
  Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets(); // Get safe area insets
  
  // Function to share the app
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this amazing app!',
        url: 'https://yourapp.com',
        title: 'Awesome App'
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setMenuVisible(false);
  };

  // Function to show about
  const showAbout = () => {
    Alert.alert(
      'About App',
      'Welcome to our amazing app!\n\nVersion: 1.0.0\n\nThis app helps you manage your daily tasks and stay organized.',
      [{ text: 'OK', onPress: () => setMenuVisible(false) }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Navbar */}
      <View style={styles.header}>
        {/* Center: Logo */}
        <View style={styles.logoContainer}>
          {/* If you don't have a logo image, use this placeholder */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>A</Text>
          </View>
          <Text style={styles.logoText}>MyApp</Text>
        </View>
        
        {/* Right: Menu Button */}
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 } // Add extra padding for bottom navbar
        ]}
      >
       {/*secction 2*/}
       {/* Section 2 – Quick Icons */}
<View style={styles.quickBar}>
  <View style={styles.quickGrid}>

    <View style={styles.quickItemWrapper}>
      <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#FF6B6B' }]}>
        <Ionicons name="image" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.quickText}>Photos</Text>
    </View>

    <View style={styles.quickItemWrapper}>
      <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#2ECC71' }]}>
        <Ionicons name="play" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.quickText}>Videos</Text>
    </View>

    <View style={styles.quickItemWrapper}>
      <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#7B61FF' }]}>
        <Ionicons name="people" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.quickText}>Social</Text>
    </View>

    <View style={styles.quickItemWrapper}>
      <TouchableOpacity style={[styles.quickItem, { backgroundColor: '#4D96FF' }]}>
        <Ionicons name="globe-outline" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.quickText}>Website</Text>
    </View>

  </View>
</View>


{/*secction 2*/}
        {/* Cards Section */}
       {/* Section – Featured Content */}
<View style={styles.imageSection}>
  <Text style={styles.sectionTitle}>Latest Images</Text>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.imageRow}
  >
    {[
      {
        title: 'Nature View',
        subtitle: 'Beautiful scenery',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
      },
      {
        title: 'City Life',
        subtitle: 'Urban exploration',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      },
      {
        title: 'Workspace',
        subtitle: 'Modern setup',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      },
      {
        title: 'Photography',
        subtitle: 'Creative shots',
        image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
      },
      {
        title: 'Travel',
        subtitle: 'Explore the world',
        image: 'https://images.unsplash.com/photo-1500534314209-a26db0f5c8c8',
      },
    ].map((item, index) => (
      <TouchableOpacity key={index} activeOpacity={0.9} style={styles.imageCard}>
        <Image source={{ uri: item.image }} style={styles.featureImage} />
        
        <View style={styles.imageTextContainer}>
          <Text style={styles.imageTitle}>{item.title}</Text>
          <Text style={styles.imageSubtitle}>{item.subtitle}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>


        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityCard}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Task Completed</Text>
              <Text style={styles.activityTime}>10 minutes ago</Text>
            </View>
          </View>
          
          <View style={styles.activityCard}>
            <Ionicons name="person-add" size={20} color="#2196F3" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Friend Added</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions - Fixed Grid Layout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={30} color="#2196F3" />
              <Text style={styles.actionText}>Create</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person" size={30} color="#9C27B0" />
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Ionicons name="share-social" size={30} color="#FF9800" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={showAbout}>
              <Ionicons name="information-circle" size={30} color="#4CAF50" />
              <Text style={styles.actionText}>About</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <TouchableOpacity style={styles.menuItem} onPress={showAbout}>
              <Ionicons name="information-circle-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>About App</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={onShare}>
              <Ionicons name="share-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Share App</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Settings');
            }}>
              <Ionicons name="settings-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Help');
            }}>
              <Ionicons name="help-circle-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 25,
    borderBottomColor: '#e0e0e0',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoPlaceholderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  // Hero Section

  quickBar: {
  backgroundColor: '#ffffff',
  borderRadius: 20,
  paddingVertical: 18,
  marginBottom: 30,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
},

quickGrid: {
  flexDirection: 'row',
  justifyContent: 'space-around',
},

quickItemWrapper: {
  alignItems: 'center',
},

quickItem: {
  width: 64,
  height: 64,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 3,
},

quickText: {
  color: '#333',
  fontSize: 12,
  marginTop: 8,
  fontWeight: '600',
},

  // Scroll Content
  scrollContent: {
    padding: 16,
  },
  sectionTitle:{
    color:"#000",
    fontSize:20,
    fontFamily:"Arial, Helvetica, sans-serif",
    fontWeight:'bold'
  },
  // Section Styles
  imageSection: {
  marginBottom: 35,
},

imageRow: {
  paddingVertical: 10,
},

imageCard: {
  width: width * 0.65,
  marginRight: 16,
  backgroundColor: '#ffffff',
  borderRadius: 18,
  overflow: 'hidden',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
},

featureImage: {
  width: '100%',
  height: 140,
},

imageTextContainer: {
  padding: 12,
},

imageTitle: {
  fontSize: 15,
  fontWeight: '700',
  color: '#333',
},

imageSubtitle: {
  fontSize: 12,
  color: '#777',
  marginTop: 4,
},

  // Cards
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  // Activity
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityContent: {
    marginLeft: 15,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  // Actions Grid - Fixed Layout
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5, // Compensate for button margins
  },
  actionButton: {
    width: (width - 52) / 2, // Calculate width with proper spacing
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 5, // Add horizontal margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
  },
  // Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  logoutItem: {
    marginTop: 10,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
});

export default HomeScreen;
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const SearchScreen = () => {
  const navigation = useNavigation();

  return (
     <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Search</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search here..."
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Hi')}
        >
          <Text style={styles.buttonText}>Go to Hi Page</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Search results will appear here</Text>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  button: {
  marginTop: 15,
  backgroundColor: '#2196F3',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});

export default SearchScreen;
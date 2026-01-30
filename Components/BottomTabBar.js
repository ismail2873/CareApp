import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomTabBar = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.bottomItem}
        onPress={() => onTabChange('Home')}
      >
        <Icon name="home" size={24} color={activeTab === 'Home' ? '#ee582bff' : 'gray'} />
        <Text style={[styles.bottomText, { color: activeTab === 'Home' ? '#ee582bff' : 'gray' }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomItem}
        onPress={() => onTabChange('Profile')}
      >
        <Icon name="person" size={24} color={activeTab === 'Profile' ? '#ee582bff' : 'gray'} />
        <Text style={[styles.bottomText, { color: activeTab === 'Profile' ? '#ee582bff' : 'gray' }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 10,
  },
  bottomItem: {
    alignItems: 'center',
  },
  bottomText: {
    color: '#ee582bff',
    fontSize: 12,
    marginTop: 3,
  },
});

export default BottomTabBar;

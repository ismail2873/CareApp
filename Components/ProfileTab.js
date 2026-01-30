import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileTab = ({ navigation, onBack }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem('token');

        if (!token) {
          console.log('Token not found');
          return;
        }

        const response = await axios.get(
          'https://muhammadb122.sg-host.com/wp-json/wp/v2/users/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFirstName(response.data.first_name || '');
        setLastName(response.data.last_name || '');
        setName(response.data.name || '');
        setBio(response.data.description || '');
      } catch (error) {
        console.log('Fetch Error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      setLoading(true);

      if (password && password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      const data = {};
      if (firstName) data.first_name = firstName;
      if (lastName) data.last_name = lastName;
      if (bio) data.description = bio;
      if (name) data.name = name;
      if (password) data.password = password;

      if (Object.keys(data).length === 0) {
        Alert.alert('No Changes', 'Please update a field before saving.');
        return;
      }

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token not found');
        return;
      }
      await axios.put(
        'https://muhammadb122.sg-host.com/wp-json/wp/v2/users/me',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      Alert.alert('Success', 'Profile Updated!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.log('Update Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Update Failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.log('Token not found');
        return;
      }
      await axios.post(
        'https://muhammadb122.sg-host.com/wp-json/auth/v1/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFirstName('');
      setLastName('');
      setName('');
      setBio('');
      setPassword('');
      setConfirmPassword('');

      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignInto' }],
      });
    } catch (error) {
      console.log('Logout Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Logout Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
      >
        <Icon name="arrow-back" size={24} color="darkblue" />
      </TouchableOpacity>

      <View style={{ alignItems: 'center', margin: 10 }}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={name}
        editable={false}
        style={styles.input2}
      />

      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
        style={[styles.input, styles.bioInput]}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon
            name={showConfirmPassword ? 'eye' : 'eye-off'}
            size={22}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
        <Text style={styles.saveText}>
          {loading ? 'Loading...' : 'Save Profile'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  input2: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: 'gray',
  },
  bioInput: { height: 90, textAlignVertical: 'top' },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  saveBtn: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  logoutBtn: {
    backgroundColor: '#ee582b',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});

export default ProfileTab;

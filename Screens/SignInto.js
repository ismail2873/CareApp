import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState } from 'react';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInTo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);


  const handleLogin = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email || !emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      Alert.alert('Invalid Password', 'Password must be at least 4 characters long.');
      return;
    }
    try {
      const response = await fetch(
        'https://muhammadb122.sg-host.com/wp-json/jwt-auth/v1/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password: password }),
        }
      );

      const data = await response.json();

      if (response.status === 200 && data.token) {
        // Save token as a string in AsyncStorage
        await AsyncStorage.setItem('token', data.token);

        // Save other user data as a JSON string
        const userData = {
          user_email: data.user_email,
          user_nicename: data.user_nicename,
          user_display_name: data.user_display_name,
        };
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));

        // Navigate to the 'SignIn' screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });

        Alert.alert('Login Successful');
      } else {
        // Handle different error messages based on the response status
        if (response.status === 403) {
          if (data.code === '[jwt_auth] incorrect_password') {
            Alert.alert('Login Failed', 'The password you entered is incorrect.');
          } else if (data.code === '[jwt_auth] invalid_email') {
            Alert.alert('Login Failed', 'Unknown email address. Please check again or try your username.');
          } else {
            Alert.alert('Login Failed', 'Invalid credentials');
          }
        } else {
          Alert.alert('Login Failed', 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.log(error);
      
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  const navigation = useNavigation();
  
  return (
    <View style={{ margin: 20, flex: 1, justifyContent: 'center' }}>
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 5,
        }}
      >
        <Text style={{ fontWeight: '600', marginTop: 20, color: 'darkblue' }}>
          Email
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: '#81b1e733',
            marginTop: 10,
            borderRadius: 10,
          }}
        />
        <Text style={{ fontWeight: '600', marginTop: 20, color: 'darkblue' }}>
          Password
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',

            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            style={{
              backgroundColor: '#81b1e733',
              marginTop: 10,
              borderRadius: 10,
              width: '100%',
            }}
          />
          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            style={{ padding: 10, position: 'absolute', right: 0, bottom: 1 }}
          >
            <Icon
              name={secure ? 'eye-off' : 'eye'}
              size={20}
              color="darkblue"
            />
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: 'darkblue',
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signInTextContainer}>
          <Text style={styles.signInText}>Create an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.signInLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignInTo;

const styles = StyleSheet.create({
  alertBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertText: { fontSize: 16, color: 'darkblue', marginBottom: 10 },
  button: { backgroundColor: 'darkblue', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  signInTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  signInText: {
    color: 'darkblue',
  },
  signInLink: {
    fontWeight: 'bold',
    color: 'darkblue',
    // marginTop: 5,
  },
});

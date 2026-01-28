import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('SignInto');
    }, 3000);
  }, []);
  return (
    <View style={styles.container}>
      <Image source={require('./assets/images/logo.png')} style={styles.logo} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: { width: 200, height: 200, resizeMode: 'contain' },
});
export default Splash;

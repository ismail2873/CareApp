import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
  ImageBackground,
  TextInput,
  Alert
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default is "All"
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  // Set initial active tab state
  const [activeTab, setActiveTab] = useState('Home'); // Set default tab to Home

  // Fetch categories
  useEffect(() => {
    axios
      .get('https://muhammadb122.sg-host.com/wp-json/wp/v2/course-category')
      .then(res => {
        const formatted = res.data.map(item => ({
          label: item.name,
          value: item.id,
          count: item.count,
        }));
        // Add "All" category
        setCategories([{ label: 'All', value: 'All', count: 0 }, ...formatted]);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://muhammadb122.sg-host.com/wp-json/wp/v2/courses',
      );
      const coursesWithImages = await Promise.all(
        res.data.map(async course => {
          let imageUrl = null;
          if (course.featured_media) {
            try {
              const mediaRes = await axios.get(
                `https://muhammadb122.sg-host.com/wp-json/wp/v2/media/${course.featured_media}`,
              );
              imageUrl = mediaRes.data.source_url;
            } catch (err) {
              console.log('Error fetching media:', err);
            }
          }
          return {
            id: course.id,
            title: course.title.rendered,
            description: course.content.rendered,
            categories: course['course-category'] || [],
            video: course.acf?.video_url || null,
            image: imageUrl,
          };
        }),
      );
      setCourses(coursesWithImages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCourseSelect = course => {
    setSelectedCourse(course);
    setVisible(true);
  };

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(
      course =>
        Array.isArray(course.categories) &&
        course.categories.includes(selectedCategory),
    );

  // Profile section state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingp, setLoadingp] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingp(true);

        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          // Handle the case where token is not available
          console.log('Token not found');
          return;
        }

        // Make the API request with the token in the Authorization header
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
        setLoadingp(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this will run once when the component mounts

  const updateProfile = async () => {
    try {
      setLoadingp(true);

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
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        // Handle the case where token is not available
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
      setLoadingp(false);
    }
  };

  const logout = async () => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        // Handle the case where token is not available
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

      // Clear user data
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
      setLoadingp(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {activeTab === 'Home' ? (
        <ScrollView style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require('./assets/images/logo.png')}
              style={styles.logo}
            />
          </View>

          {/* HERO SECTION */}
          <ImageBackground
            source={require('./assets/images/Capture.png')}
            style={styles.imagegradient}
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.48)', 'rgba(6, 6, 6, 0.38)']}
              style={styles.gradient}
            />

            <Text style={styles.heading}>Explore Courses</Text>

            <Dropdown
              style={styles.dropdown3}
              data={categories}
              labelField="label"
              valueField="value"
              placeholder="Select Courses Category"
              value={selectedCategory}
              onChange={item => setSelectedCategory(item.value)}
            />
          </ImageBackground>

          {/* COURSES LIST */}
          <View style={{ padding: 20 }}>
            {loading ? (
              <ActivityIndicator size="large" color="darkblue" />
            ) : filteredCourses.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No courses found.
              </Text>
            ) : (
              filteredCourses.map(course => (
                <View key={course.id} style={styles.courseCard}>
                  {course.image && (
                    <Image
                      source={{ uri: course.image }}
                      style={styles.cardImage}
                    />
                  )}

                  <Text style={styles.courseTitle}>
                    {course.title.replace(/&amp;|&#038;/g, '&')}
                  </Text>

                  <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                    <RenderHTML
                      contentWidth={width - 40}
                      source={{ html: course.description.slice(0, 300) + '...' }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DetailScreen', { course })
                    }
                    style={styles.courseButton}
                  >
                    <Text style={{ color: 'white' }}>More Detail</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* VIDEO MODAL */}
          <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
              <View style={styles.modalBox}>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                  {selectedCourse?.title}
                </Text>

                {selectedCourse?.video ? (
                  <Video
                    source={{ uri: selectedCourse.video }}
                    style={{ width: '100%', height: 300 }}
                    controls
                  />
                ) : (
                  <Text>No video available</Text>
                )}

                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text style={styles.close}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      ) : (
        <ScrollView style={styles.containerp}>
          {/* Profile Section */}
          <TouchableOpacity
            style={styles.backBtnp}
            onPress={() => setActiveTab('Home')}
          >
            <Icon name="arrow-back" size={24} color="darkblue" />
          </TouchableOpacity>

          <View style={{ alignItems: 'center', margin: 10 }}>
            <Text style={styles.titlep}>Edit Profile</Text>
          </View>

          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.inputp}
          />

          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.inputp}
          />

          <TextInput
            placeholder="Email"
            value={name}
            editable={false}
            style={styles.input2p}
          />

          <TextInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            style={[styles.inputp, styles.bioInputp]}
          />

          <View style={styles.passwordContainerp}>
            <TextInput
              placeholder="New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInputp}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainerp}>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.passwordInputp}
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

          <TouchableOpacity style={styles.saveBtnp} onPress={updateProfile}>
            <Text style={styles.saveTextp}>
              {loadingp ? 'Loading...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutBtnp} onPress={logout}>
            <Text style={styles.logoutTextp}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Custom Bottom Menu Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => setActiveTab('Home')}
        >
          <Icon name="home" size={24} color={activeTab === 'Home' ? '#ee582bff' : 'gray'} />
          <Text style={[styles.bottomText, { color: activeTab === 'Home' ? '#ee582bff' : 'gray' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => setActiveTab('Profile')}
        >
          <Icon name="person" size={24} color={activeTab === 'Profile' ? '#ee582bff' : 'gray'} />
          <Text style={[styles.bottomText, { color: activeTab === 'Profile' ? '#ee582bff' : 'gray' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;


const styles = StyleSheet.create({
  header: {
    backgroundColor: 'darkblue',
    padding: 10,
    alignItems: 'center',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },

  dropdown3: {
    height: 40,
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 5,
  },

  courseCard: {
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    marginBottom: 20,
    paddingBottom: 10,
    overflow: 'hidden',
  },

  cardImage: {
    width: '100%',
    height: 150,
  },

  courseTitle: {

    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    color: '#ee582bff',
  },

  courseButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'darkblue',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 5,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },

  close: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'right',
  },

  gradient: { ...StyleSheet.absoluteFillObject },

  imagegradient: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,

    paddingVertical: 10,
    // width: '90%',
  },

  bottomItem: {
    alignItems: 'center',
  },

  bottomText: {
    color: '#ee582bff',
    fontSize: 12,
    marginTop: 3,
  },
  containerp: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backBtnp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputp: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  input2p: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: 'gray',
  },
  bioInputp: { height: 90, textAlignVertical: 'top' },
  passwordContainerp: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  passwordInputp: {
    flex: 1,
    padding: 12,
  },
  saveBtnp: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveTextp: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  titlep: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  logoutBtnp: {
    backgroundColor: '#ee582b',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutTextp: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});

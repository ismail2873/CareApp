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
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const SignIn = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

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
        setCategories(formatted);
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

  const filteredCourses = selectedCategory
    ? courses.filter(
        course =>
          Array.isArray(course.categories) &&
          course.categories.includes(selectedCategory),
      )
    : courses;

  return (
    <View style={{ flex: 1 }}>
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
                  {course.title.replace(/&amp;/g, '&')}
                </Text>

                <RenderHTML
                  contentWidth={width - 40}
                  source={{ html: course.description.slice(0, 300) + '...' }}
                />

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

      {/* ✅ CUSTOM BOTTOM MENU BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Icon name="home" size={24} color="white" />
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="white" />
          <Text style={styles.bottomText}>Profile</Text>
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
    backgroundColor: '#ee582bff',
    paddingVertical: 10,
    // width: '90%',
  },

  bottomItem: {
    alignItems: 'center',
  },

  bottomText: {
    color: 'white',
    fontSize: 12,
    marginTop: 3,
  },
});

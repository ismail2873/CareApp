import React from 'react';
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
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import LinearGradient from 'react-native-linear-gradient';

const HomeTab = ({ 
  navigation, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  courses, 
  loading, 
  visible, 
  setVisible, 
  selectedCourse,
  handleCourseSelect 
}) => {
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require('../Screens/assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      <ImageBackground
        source={require('../Screens/assets/images/Capture.png')}
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

      <View style={{ padding: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="darkblue" />
        ) : courses.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No courses found.
          </Text>
        ) : (
          courses.map(course => (
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
  );
};

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
});

export default HomeTab;

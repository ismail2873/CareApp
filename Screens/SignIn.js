// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   ImageBackground,
//   Modal,
//   ActivityIndicator,
// } from 'react-native';

// import LinearGradient from 'react-native-linear-gradient';
// import { Dropdown } from 'react-native-element-dropdown';
// import CoursesVideo from './CoursesVideo.json';
// import Video from 'react-native-video';

// const API_URL =
//   'https://muhammadb122.sg-host.com/wp-json/wp/v2/course-category';

// const SignIn = () => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const [value2, setValue2] = useState(null);

//   const [visible, setVisible] = useState(false);

//   const [selectedCourse, setSelectedCourse] = useState(null);

//   const handleCourseSelect = item => {
//     setSelectedCourse(item);
//     setVisible(true);
//   };
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   useEffect(() => {
//     fetch('https://muhammadb122.sg-host.com/wp-json/wp/v2/course-category')
//       .then(res => res.json())
//       .then(data => {
//         console.log('CATEGORIES DATA:', data);
//         const formatted = data.map(item => ({
//           label: item.name,
//           value: item.id,
//           count: item.count,
//         }));
//         setCategories(formatted);
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <ScrollView>
//       <Modal
//         transparent={true}
//         animationType="slide"
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalBox}>
//             <TouchableOpacity>
//               <View
//                 style={{
//                   alignItems: 'center',
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   borderBlockColor: 'blue',
//                   alignItems: 'center',
//                   borderRadius: 5,
//                   // borderColor: 'gray',
//                   borderWidth: 1,
//                   padding: 10,
//                   marginBottom: 10,
//                 }}
//               >
//                 <Text style={styles.modalTitle}>Onetime for one person</Text>
//                 <Text>Free</Text>
//               </View>
//             </TouchableOpacity>

//             <View style={{ flexDirection: 'row', marginTop: 15 }}>
//               <TouchableOpacity
//                 style={styles.modalBtn}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={{ color: 'white' }}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.modalBtn, { backgroundColor: 'green' }]}
//                 onPress={() => alert('Course Enrolled')}
//               >
//                 <Text style={{ color: 'white' }}>Enroll</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide" // slide | fade | none
//         transparent={true}
//         visible={visible}
//         onRequestClose={() => setVisible(false)}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.modalBox}>
//             <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
//               {selectedCourse?.label}
//             </Text>
//             <Video
//               source={{ uri: selectedCourse?.video }}
//               style={{ width: '100%', height: 300 }}
//               controls
//               resizeMode="contain"
//             />

//             <TouchableOpacity onPress={() => setVisible(false)}>
//               <Text style={styles.close}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           backgroundColor: 'darkblue',
//           padding: 10,
//         }}
//       >
//         <View>
//           <Image
//             source={require('./assets/images/logo.png')}
//             style={styles.logo}
//           />
//         </View>

//         <View>
//           {/* <Dropdown
//             style={styles.dropdown3}
//             data={categories}
//             labelField="label"
//             valueField="value"
//             placeholder="Select Category"
//             value={selectedCategory}
//             onChange={item => {
//               setSelectedCategory(item.value);
//               console.log('Selected:', item);
//             }}
//           /> */}
//         </View>
//       </View>
//       <View>
//         <ImageBackground
//           source={require('./assets/images/Capture.png')}
//           style={styles.imagegradient}
//         >
//           <LinearGradient
//             colors={['rgba(0, 0, 0, 0.48)', 'rgba(6, 6, 6, 0.38)']}
//             style={styles.gradient}
//           />
//           <Dropdown
//             style={styles.dropdown3}
//             data={categories}
//             labelField="label"
//             valueField="value"
//             placeholder="Select Category"
//             value={selectedCategory}
//             onChange={item => {
//               setSelectedCategory(item.value);
//               console.log('Selected:', item);
//             }}
//           />
//           {/* <Dropdown
//             style={styles.dropdown}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={CoursesVideo}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="label"
//             placeholder="Select Course"
//             searchPlaceholder="Search..."
//             value={selectedCourse}
//             onChange={handleCourseSelect}
//           /> */}
//         </ImageBackground>
//       </View>
//       <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'darkblue' }}>
//           Explore Courses
//         </Text>
//       </View>
//       <View
//         style={{
//           padding: 20,

//           gap: 20,
//           justifyContent: 'center',
//           marginBottom: 20,
//         }}
//       >
//         <View style={{ backgroundColor: 'white', elevation: 5 }}>
//           <Image
//             source={require('./assets/images/enter.jpg')}
//             style={styles.card}
//           />
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: 'bold',
//               padding: 10,
//               color: '#ee582bff',
//             }}
//           >
//             Enterpreniur LeaderShip
//           </Text>
//           <Text
//             style={{
//               paddingHorizontal: 10,
//               paddingBottom: 10,
//               fontStyle: 'italic',
//             }}
//           >
//             Sed lectus amet, eu lacus viverra magna ullamcorper ultricies.
//             Laoreet est molestie tellus, volutpat, vitae. Viverra vitae nunc
//             molestie nec.
//           </Text>
//           <TouchableOpacity
//             onPress={() => setModalVisible(true)}
//             style={{
//               padding: 5,
//               backgroundColor: 'darkblue',
//               width: 130,
//               alignItems: 'center',
//               margin: 10,
//             }}
//           >
//             <Text style={{ color: 'white' }}>Take the course</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={{ backgroundColor: 'white', elevation: 5 }}>
//           <Image
//             source={require('./assets/images/digitize.jpg')}
//             style={styles.card}
//           />
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: 'bold',
//               padding: 10,
//               color: '#ee582bff',
//             }}
//           >
//             Digitization
//           </Text>
//           <Text
//             style={{
//               paddingHorizontal: 10,
//               paddingBottom: 10,
//               fontStyle: 'italic',
//             }}
//           >
//             Sed lectus amet, eu lacus viverra magna ullamcorper ultricies.
//             Laoreet est molestie tellus, volutpat, vitae. Viverra vitae nunc
//             molestie nec.
//           </Text>
//           <TouchableOpacity
//             onPress={() => setModalVisible(true)}
//             style={{
//               padding: 5,
//               backgroundColor: 'darkblue',
//               width: 130,
//               alignItems: 'center',
//               margin: 10,
//             }}
//           >
//             <Text style={{ color: 'white' }}>Take the course</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={{ backgroundColor: 'white', elevation: 5 }}>
//           <Image
//             source={require('./assets/images/bussiness.jpg')}
//             style={styles.card}
//           />
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: 'bold',
//               padding: 10,
//               color: '#ee582bff',
//             }}
//           >
//             Business planning and managment
//           </Text>
//           <Text
//             style={{
//               paddingHorizontal: 10,
//               paddingBottom: 10,
//               fontStyle: 'italic',
//             }}
//           >
//             Sed lectus amet, eu lacus viverra magna ullamcorper ultricies.
//             Laoreet est molestie tellus, volutpat, vitae. Viverra vitae nunc
//             molestie nec.
//           </Text>
//           <TouchableOpacity
//             onPress={() => setModalVisible(true)}
//             style={{
//               padding: 5,
//               backgroundColor: 'darkblue',
//               width: 130,
//               alignItems: 'center',
//               margin: 10,
//             }}
//           >
//             <Text style={{ color: 'white' }}>Take the course</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default SignIn;

// const styles = StyleSheet.create({
//   dropdown: {
//     width: '90%',

//     height: 40,

//     backgroundColor: 'white',
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     elevation: 5,
//   },

//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: 'darkblue',
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
//   logo: {
//     width: 100,
//     height: 40,
//     resizeMode: 'contain',
//   },
//   image: {
//     width: '100%',
//     height: 400,
//   },
//   card: {
//     width: '100%',
//     height: 150,
//   },
//   gradient: { ...StyleSheet.absoluteFillObject },

//   imagegradient: {
//     width: '100%',
//     height: 300,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBox: {
//     width: '80%',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   close: {
//     marginTop: 20,
//     color: 'blue',
//     textAlign: 'right',
//   },

//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   container: {
//     padding: 20,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: 'darkblue',
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   card2: {
//     backgroundColor: '#ffffffff',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//     width: '45%',
//     elevation: 5,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     textAlign: 'center',
//   },
//   count: {
//     fontSize: 14,
//     color: 'gray',
//     textAlign: 'center',
//     marginTop: 5,
//   },

//   dropdown3: {
//     height: 40,
//     width: '90%',

//     borderRadius: 8,
//     paddingHorizontal: 10,
//     alignSelf: 'center',
//     backgroundColor: 'white',
//     marginTop: 5,
//     elevation: 5,
//   },
//   selectedText: {
//     fontSize: 14,
//     color: 'darkblue',
//   },
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalBox: {
//     width: '90%',
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: 16,
//     // fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalBtn: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: 'red',
//     margin: 5,
//     alignItems: 'center',
//     borderRadius: 5,
//   },
// });

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

  // Fetch courses and their featured images
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
            categories: course['course-category'] || [], // ← fix here
            video: course.acf?.video_url || null, // ACF video URL if exists
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

  // Handle course selection for modal
  const handleCourseSelect = course => {
    setSelectedCourse(course);
    setVisible(true);
  };

  // Filter courses by selected category
  // const filteredCourses = selectedCategory
  //   ? courses.filter(course => course.categories.includes(selectedCategory))
  //   : courses;
  const filteredCourses = selectedCategory
    ? courses.filter(
        course =>
          Array.isArray(course.categories) &&
          course.categories.includes(selectedCategory),
      )
    : courses;

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'darkblue',
          padding: 10,
        }}
      >
        <View>
          <Image
            source={require('./assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={require('./assets/images/power.png')}
              style={styles.logo2}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        source={require('./assets/images/Capture.png')}
        style={styles.imagegradient}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.48)', 'rgba(6, 6, 6, 0.38)']}
          style={styles.gradient}
        />
        {/* <View style={{ padding: 20, backgroundColor: 'darkblue' }}> */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 10,
          }}
        >
          Explore Courses
        </Text>
        <Dropdown
          style={styles.dropdown3}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select Courses Category"
          value={selectedCategory}
          onChange={item => setSelectedCategory(item.value)}
        />
        {/* </View> */}
      </ImageBackground>
      {/* Courses List */}
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
                {course.title
                  .replace(/&amp;/g, '&')
                  .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))}
              </Text>
              {/* Render HTML description */}

              <RenderHTML
                contentWidth={width - 40}
                source={{ html: course.description.slice(0, 300) + '...' }}
                tagsStyles={{
                  p: { paddingHorizontal: 10, color: '#333' },
                  strong: { fontWeight: 'bold' },
                  em: { fontStyle: 'italic' },
                }}
              />
              {/* <Text
                style={{
                  paddingHorizontal: 10,
                  paddingBottom: 10,
                  fontStyle: 'italic',
                }}
              >
                {course.description}
              </Text> */}
              <TouchableOpacity
                // onPress={() => handleCourseSelect(course)}
                onPress={() => navigation.navigate('DetailScreen', { course })}
                style={styles.courseButton}
              >
                <Text style={{ color: 'white' }}>More Detail</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Video Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
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
                resizeMode="contain"
              />
            ) : (
              <Text>No video available for this course.</Text>
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

export default SignIn;

const styles = StyleSheet.create({
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
  logo2: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import HomeTab from '../Components/HomeTab';
import ProfileTab from '../Components/ProfileTab';
import BottomTabBar from '../Components/BottomTabBar';
import axios from 'axios';

const SignIn = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [visible, setVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://muhammadb122.sg-host.com/wp-json/wp/v2/course-category')
      .then(res => {
        const formatted = res.data.map(item => ({
          label: item.name,
          value: item.id,
          count: item.count,
        }));
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleBackToHome = () => {
    setActiveTab('Home');
  };

  return (
    <View style={{ flex: 1 }}>
      {activeTab === 'Home' ? (
        <HomeTab 
          navigation={navigation}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          courses={filteredCourses}
          loading={loading}
          visible={visible}
          setVisible={setVisible}
          selectedCourse={selectedCourse}
          handleCourseSelect={handleCourseSelect}
        />
      ) : (
        <ProfileTab navigation={navigation} onBack={handleBackToHome} />
      )}
      
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
};

export default SignIn;

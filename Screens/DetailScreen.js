import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import LessonModal from '../Components/LessonModal';

const DetailScreen = ({ route, navigation }) => {
  const { course } = route.params;
  console.log("couse id",course.id);
  
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('Basic');
  const [videoUrl, setVideoUrl] = useState(null);
  const [courseModules, setCourseModules] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [loadingModules, setLoadingModules] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const tabs = ['Basic', 'Curriculum', 'Additional'];

  useEffect(() => {
    fetchVideo();
    fetchCourseModules();
    fetchCourseDetails();
  }, []);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `https://muhammadb122.sg-host.com/wp-json/wp/v2/courses/${course.id}`,
      );
      if (response.data.intro_video) {
        let url = response.data.intro_video.url;
        if (url && url.startsWith('http://')) {
          url = url.replace('http://', 'https://');
        }
        setVideoUrl(url);
      }
    } catch (error) {
      console.log('Error fetching intro video:', error);
    }
  };

  const fetchCourseDetails = async () => {
    setLoadingDetails(true);
    try {
      console.log('🔍 Fetching course details...');
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const response = await fetch(
        `https://muhammadb122.sg-host.com/wp-json/proxy/v1/course?id=${course.id}`,
        requestOptions
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Course details response:', result);
      setCourseDetails(result.data);
      
    } catch (error) {
      console.log('❌ Error fetching course details:', error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchCourseModules = async () => {
    setLoadingModules(true);
    try {
      console.log('=== USING WORKING PROXY APIS ===');
      
      // Use the working proxy endpoints you found
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      // First fetch topics (modules)
      console.log('🔍 Fetching modules...');
      const topicsResponse = await fetch(
        `https://muhammadb122.sg-host.com/wp-json/proxy/v1/topics?course_id=${course.id}`,
        requestOptions
      );
      
      if (!topicsResponse.ok) {
        throw new Error(`HTTP ${topicsResponse.status}: ${topicsResponse.statusText}`);
      }
      
      const topicsResult = await topicsResponse.json();
      console.log('✅ Modules response:', topicsResult);
      
      const modules = topicsResult?.data || [];
      console.log('Modules found:', modules.length);

      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          try {
            console.log(`🔍 Fetching lessons for module ${module.ID}...`);
            
            const lessonsResponse = await fetch(
              `https://muhammadb122.sg-host.com/wp-json/proxy/v1/lessons?topic_id=${module.ID}`,
              requestOptions
            );
            
            if (!lessonsResponse.ok) {
              console.log(`❌ Lessons fetch failed for module ${module.ID}: ${lessonsResponse.status}`);
              return { ...module, lessons: [] };
            }
            
            const lessonsResult = await lessonsResponse.json();
            console.log(`✅ Lessons fetched for module ${module.ID}:`, lessonsResult?.data?.length || 0);
            return { ...module, lessons: lessonsResult?.data || [] };
            
          } catch (error) {
            console.log(`❌ Error fetching lessons for module ${module.ID}:`, error.message);
            return { ...module, lessons: [] };
          }
        })
      );

      setCourseModules(modulesWithLessons);
      console.log('✅ All modules and lessons loaded successfully!');
      
    } catch (error) {
      console.log('=== PROXY API FAILED ===');
      console.log('❌ Error:', error.message);
      
      // Fall back to mock data
      console.log('🔄 Falling back to mock data for testing...');
      setCourseModules([]);
    } finally {
      setLoadingModules(false);
    }
  };

  const processModulesResponse = async (modulesResponse) => {
    console.log("✅ Processing modules response:", modulesResponse.data);
    const modules = modulesResponse?.data?.data || [];
    console.log('Modules found:', modules.length);

    const authHeader = 'Basic a2V5XzMyZjI1NjAyMjUyNTk2OGY2ZjUzMTM2Y2U1YTk0ZWI2OnNlY3JldF80N2Q0ZTg2NzliYjE0ODdjZDcxZmE1YTRkNThiMWFhMzBkMTM5ZTc3YTRhMjMyZjdhOWUyMjg0NWMyZDQ1NDc2';

    // Fetching lessons for each module
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        try {
          console.log(`Fetching lessons for module ${module.ID}...`);
          
          const lessonsConfig = {
            method: 'get',
            url: `https://muhammadb122.sg-host.com/wp-json/tutor/v1/lessons?topic_id=${module.ID}`,
            timeout: 8000,
            headers: { 
              'Authorization': authHeader,
              'Accept': 'application/json',
            }
          };

          const lessonsResponse = await axios.request(lessonsConfig);
          console.log(`✅ Lessons fetched for module ${module.ID}:`, lessonsResponse.data.data?.length || 0);
          return { ...module, lessons: lessonsResponse?.data?.data || [] };
        } catch (error) {
          console.log(`❌ Error fetching lessons for module ${module.ID}:`, error.message);
          return { ...module, lessons: [] };
        }
      })
    );

    setCourseModules(modulesWithLessons);
    console.log('✅ All modules and lessons loaded successfully!');
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleLessonPress = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const closeLessonModal = () => {
    setShowLessonModal(false);
    setSelectedLesson(null);
  };

  const decodeHtml = html => {
    if (!html) return '';
    return html
      .replace(/&amp;/g, '&')
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  };

  const renderBasicTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.courseTitle}>{decodeHtml(course.title)}</Text>
        
        <RenderHTML
          contentWidth={width - 40}
          source={{ html: course.description }}
          tagsStyles={{
            p: { color: '#333', fontSize: 14, textAlign: 'justify' },
            strong: { fontWeight: 'bold' },
            em: { fontStyle: 'italic' },
          }}
        />
      </View>

      {/* {videoUrl ? (
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          controls
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.noVideo}>No video available for this course.</Text>
      )} */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderCurriculumTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.curriculumContainer}>
        <Text style={styles.curriculumTitle}>Course Modules</Text>
        
        {loadingModules ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading curriculum...</Text>
          </View>
        ) : courseModules.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No modules available for this course.</Text>
          </View>
        ) : (
          courseModules.map((module, index) => (
            <View key={module.ID} style={styles.moduleContainer}>
              <TouchableOpacity
                style={styles.moduleHeader}
                onPress={() => toggleModule(module.ID)}
              >
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleTitle}>{module.post_title}</Text>
                  <Text style={styles.moduleLessonCount}>
                    {module.lessons?.length || 0} lessons
                  </Text>
                </View>
                <Icon 
                  name={expandedModule === module.ID ? 'chevron-down' : 'chevron-forward'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {expandedModule === module.ID && (
                <View style={styles.lessonsContainer}>
                  {module.lessons?.map((lesson) => (
                    <TouchableOpacity
                      key={lesson.ID}
                      style={styles.lessonItem}
                      onPress={() => handleLessonPress(lesson)}
                    >
                      <View style={styles.lessonInfo}>
                        <Text style={styles.lessonTitle}>{lesson.post_title}</Text>
                        {lesson.video?.[0]?.runtime && (
                          <Text style={styles.lessonDuration}>
                            {lesson.video[0].runtime.hours !== '0' && `${lesson.video[0].runtime.hours}h `}
                            {lesson.video[0].runtime.minutes !== '0' && `${lesson.video[0].runtime.minutes}m `}
                            {lesson.video[0].runtime.seconds !== '0' && `${lesson.video[0].runtime.seconds}s`}
                          </Text>
                        )}
                      </View>
                      <Icon name="play-circle-outline" size={20} color="#ee582bff" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderAdditionalTab = () => {
    if (loadingDetails) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ee582bff" />
          <Text style={styles.loadingText}>Loading course information...</Text>
        </View>
      );
    }

    if (!courseDetails) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Course information not available</Text>
        </View>
      );
    }

    const {
      course_level = [],
      course_duration = [],
      course_benefits = [],
      course_requirements = [],
      course_target_audience = [],
      course_material_includes = []
    } = courseDetails;

    return (
      <ScrollView style={styles.additionalContainer} showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 30 }}>
        {/* Course Level */}
        {course_level.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="bar-chart" size={20} color="#ee582bff" />
              <Text style={styles.infoTitle}>Course Level</Text>
            </View>
            <Text style={styles.infoContent}>{course_level[0]}</Text>
          </View>
        )}

        {/* Course Duration */}
        {course_duration.length > 0 && course_duration[0] && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="time-outline" size={20} color="#ee582bff" />
              <Text style={styles.infoTitle}>Duration</Text>
            </View>
            <Text style={styles.infoContent}>
              {course_duration[0].hours > 0 && `${course_duration[0].hours}h `}
              {course_duration[0].minutes > 0 && `${course_duration[0].minutes}m`}
            </Text>
          </View>
        )}

        {/* Course Benefits */}
        {course_benefits.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="checkmark-circle-outline" size={20} color="#ee582bff" />
              <Text style={styles.infoTitle}>What You'll Learn</Text>
            </View>
            {course_benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Icon name="checkmark-outline" size={16} color="#4CAF50" style={styles.bulletIcon} />
                <Text style={styles.infoContent}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Course Requirements */}
        {course_requirements.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="list" size={20} color="#ee582bff" />
              <Text style={styles.infoTitle}>Requirements</Text>
            </View>
            {course_requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementItem}>
                <Icon name="arrow-forward" size={16} color="#FF9800" style={styles.bulletIcon} />
                <Text style={styles.infoContent}>{requirement}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Target Audience */}
        {course_target_audience.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
                <Icon name="person-circle-outline" size={20} color="#ee582bff" />
              <Text style={styles.infoTitle}>Target Audience</Text>
            </View>
            {course_target_audience.map((audience, index) => (
              <View key={index} style={styles.audienceItem}>
                <Icon name="person-circle-outline" size={16} color="#2196F3" style={styles.bulletIcon} />
                <Text style={styles.infoContent}>{audience}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Course Materials */}
        {course_material_includes.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Icon name="book" size={20} color="#ee582bff" />
              <Text style={styles.infoTitle}>Course Materials</Text>
            </View>
            {course_material_includes.map((material, index) => (
              <View key={index} style={styles.materialItem}>
                <Icon name="folder" size={16} color="#9C27B0" style={styles.bulletIcon} />
                <Text style={styles.infoContent}>{material}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Basic':
        return renderBasicTab();
      case 'Curriculum':
        return renderCurriculumTab();
      case 'Additional':
        return renderAdditionalTab();
      default:
        return renderBasicTab();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      {course.image && (
        <Image source={{ uri: course.image }} style={styles.courseImage} />
      )}

      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? '#ee582bff' : 'gray' }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderContent()}
      
      <LessonModal
        visible={showLessonModal}
        onClose={closeLessonModal}
        lesson={selectedLesson}
      />
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'darkblue',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  courseImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  tabContainer: {
    backgroundColor: '#fff',
    elevation: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ee582bff',
    marginBottom: 15,
    marginTop: 15,
  },
  video: {
    width: '100%',
    height: 250,
    marginVertical: 20,
    backgroundColor: '#000',
  },
  noVideo: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'gray',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: 'darkblue',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  // Additional Tab Styles
  additionalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  infoContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  audienceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  // Curriculum Styles
  curriculumContainer: {
    padding: 20,
  },
  curriculumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  moduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  moduleLessonCount: {
    fontSize: 12,
    color: '#666',
  },
  lessonsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#999',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ee582bff',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  placeholderBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#ee582bff',
  },
  placeholderBoxText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  curriculumContainer: {
    padding: 20,
  },
  curriculumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  moduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f0ff',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  moduleLessonCount: {
    fontSize: 14,
    color: '#666',
  },
  lessonsContainer: {
    backgroundColor: '#fff',
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#999',
  },
});

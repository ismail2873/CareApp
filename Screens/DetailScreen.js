import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import axios from 'axios';

const DetailScreen = ({ route, navigation }) => {
  const { course } = route.params; // other data comes from route
  const { width } = useWindowDimensions();

  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `https://muhammadb122.sg-host.com/wp-json/wp/v2/courses/${course.id}`,
        );
        if (response.data.intro_video) {
          // Get the video URL
          let url = response.data.intro_video.url;

          // Check if the URL starts with http and convert it to https
          if (url && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
          }

          setVideoUrl(url);  // Set the updated URL
        }
        console.log('Video URL:', videoUrl);
        
      } catch (error) {
        console.log('Error fetching intro video:', error);
      }
    };

    fetchVideo();
  }, [course.id]);

  // Function to decode HTML entities in title
  const decodeHtml = html => {
    if (!html) return '';
    return html
      .replace(/&amp;/g, '&')
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
                <Image
                  source={require('./assets/images/logo.png')}
                  style={styles.logo}
                />
              </View>
      {/* Course Image */}
      {course.image && (
        <Image source={{ uri: course.image }} resizeMethod='contain' style={styles.courseImage} />
      )}
<View style={{ paddingHorizontal: 20 }}>
      {/* Course Title */}
      <Text style={styles.courseTitle}>{decodeHtml(course.title)}</Text>

      {/* Course Description */}
      <RenderHTML
        contentWidth={width - 40}
        source={{ html: course.description }}
        tagsStyles={{
          p: { color: '#333', fontSize: 14 ,textAlign: 'justify'},
          strong: { fontWeight: 'bold' },
          em: { fontStyle: 'italic' },
        }}
      />
</View>
      {/* Course Video */}
      {videoUrl ? (
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          controls
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.noVideo}>No video available for this course.</Text>
      )}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
    marginBottom: 28,
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  courseImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ee582bff',
    // paddingHorizontal: 10,
    marginBottom: 10,
  },
  video: {
    width: '100%',
    height: 250,
    marginVertical: 20,
  },
  noVideo: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'gray',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: 'darkblue',
    padding: 12,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    paddingBottom: 15,
  },
});

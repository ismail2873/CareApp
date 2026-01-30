import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import RenderHTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');

const LessonModal = ({ visible, onClose, lesson }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!lesson) return null;

  const videoUrl = lesson.video?.[0]?.source_external_url;

  const renderOverviewTab = () => (
    <ScrollView style={styles.contentContainer}>
    <View style={{ marginBottom: 50 }} >
      <RenderHTML
        contentWidth={width - 40}
        source={{ html: lesson.post_content }}
        tagsStyles={{
          p: { 
            color: '#333', 
            fontSize: 14, 
            lineHeight: 22,
            marginBottom: 15,
          },
          b: { 
            fontWeight: 'bold', 
            color: '#000',
            fontSize: 16,
          },
          h3: { 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: '#ee582bff',
            marginTop: 20,
            marginBottom: 15,
          },
          span: { 
            color: '#555', 
            fontSize: 14,
            lineHeight: 22,
          },
        }}
      />
      </View>
    </ScrollView>
  );

  const renderNotesTab = () => (
    <View style={styles.contentContainer}>
      <View style={styles.notesContainer}>
        <Icon name="create-outline" size={40} color="#ccc" />
        <Text style={styles.notesTitle}>Notes</Text>
        <Text style={styles.notesText}>Take notes while watching the lesson</Text>
        <TouchableOpacity style={styles.addNoteButton}>
          <Icon name="add" size={20} color="#ee582bff" />
          <Text style={styles.addNoteText}>Add Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverviewTab();
      case 'Notes':
        return renderNotesTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.post_title}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Video Player */}
        {videoUrl ? (
          <Video
            source={{ uri: videoUrl }}
            style={styles.videoPlayer}
            controls
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Icon name="videocam-off" size={50} color="#ccc" />
            <Text style={styles.noVideoText}>No video available</Text>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Overview' && styles.activeTab]}
            onPress={() => setActiveTab('Overview')}
          >
            <Text style={[styles.tabText, activeTab === 'Overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.tab, activeTab === 'Notes' && styles.activeTab]}
            onPress={() => setActiveTab('Notes')}
          >
            <Text style={[styles.tabText, activeTab === 'Notes' && styles.activeTabText]}>
              Notes
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ee582bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 40,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 15,
  },
  placeholder: {
    width: 34,
  },
  videoPlayer: {
    width: '100%',
    height: height * 0.3,
    backgroundColor: '#000',
  },
  noVideoContainer: {
    width: '100%',
    height: height * 0.3,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ee582bff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ee582bff',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  notesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ee582bff',
  },
  addNoteText: {
    marginLeft: 8,
    color: '#ee582bff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LessonModal;

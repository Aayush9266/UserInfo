import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  PanResponder,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { User } from "@/services/api";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

interface UserCardProps {
  user: User | null;
  isLoading: boolean;
  totalUsers: number;
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  isDarkMode: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isLoading,
  totalUsers,
  currentIndex,
  onPrevious,
  onNext,
  isDarkMode,
}) => {
  // For touch handling
  const [touchStart, setTouchStart] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [swiping, setSwiping] = useState(false);

  // Handle touch start
  const handleTouchStart = (event: GestureResponderEvent) => {
    setTouchStart(event.nativeEvent.pageX);
    setSwiping(true);
  };

  // Handle touch end
  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (!swiping) return;

    const touchEnd = event.nativeEvent.pageX;
    const diff = touchStart - touchEnd;

    // Minimum distance for a swipe to be registered
    const minSwipeDistance = 50;

    if (diff > minSwipeDistance) {
      // Swiped left - go to next
      if (currentIndex < totalUsers - 1) {
        console.log("Navigating to next user");
        onNext();
      }
    } else if (diff < -minSwipeDistance) {
      // Swiped right - go to previous
      if (currentIndex > 0) {
        console.log("Navigating to previous user");
        onPrevious();
      }
    }

    setSwiping(false);
  };

  // Dynamic styles based on theme
  const styles = StyleSheet.create({
    card: {
      backgroundColor: isDarkMode ? "#374151" : "rgba(255, 255, 255, 0.8)",
      borderRadius: 24,
      shadowColor: isDarkMode ? "#000" : "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: isDarkMode ? 0.2 : 0.1,
      shadowRadius: 15,
      elevation: 10,
      padding: 24,
    },
    header: {
      alignItems: "center",
      marginBottom: 24,
    },
    avatarContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 4,
      borderColor: isDarkMode ? "#4B5563" : "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.2 : 0.1,
      shadowRadius: 5,
      overflow: "hidden",
      marginBottom: 16,
    },
    avatar: {
      width: "100%",
      height: "100%",
    },
    userName: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      color: isDarkMode ? "#FFFFFF" : "#111827",
    },
    userCount: {
      fontSize: 12,
      color: isDarkMode ? "#9CA3AF" : "#777",
      marginTop: 4,
      fontFamily: "monospace",
    },
    infoContainer: {
      marginBottom: 24,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#4B5563" : "rgba(0,0,0,0.05)",
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: isDarkMode ? "#9CA3AF" : "#666",
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "500",
      color: isDarkMode ? "#FFFFFF" : "#333",
      maxWidth: 180,
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 24,
    },
    navButton: {
      height: 48,
      width: 48,
      borderRadius: 24,
      backgroundColor: isDarkMode ? "#3B82F6" : "#3B82F6",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.2 : 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    disabledButton: {
      opacity: 0.5,
    },
    loadingContent: {
      alignItems: "center",
      marginBottom: 24,
    },
    loadingAvatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
      marginBottom: 16,
    },
    loadingName: {
      height: 20,
      width: 120,
      backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
      borderRadius: 4,
    },
    loadingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#4B5563" : "rgba(0,0,0,0.05)",
    },
    loadingLabel: {
      height: 14,
      width: 80,
      backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
      borderRadius: 2,
    },
    loadingValue: {
      height: 14,
      width: 160,
      backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
      borderRadius: 2,
    },
    swipeHintContainer: {
      position: "absolute",
      bottom: 8,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    swipeHintText: {
      fontSize: 14,
      color: isDarkMode ? "#9CA3AF" : "#6B7280", // Subtle color for the text
      textAlign: "center", // Center the text
      marginTop: 16, // Add some spacing
      fontStyle: "italic", // Make it italic for a subtle look
    },
  });

  // For loading state
  if (isLoading || !user) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingAvatar}></View>
          <View style={styles.loadingName}></View>
        </View>

        {[...Array(8)].map((_, i) => (
          <View key={i} style={styles.loadingRow}>
            <View style={styles.loadingLabel}></View>
            <View style={styles.loadingValue}></View>
          </View>
        ))}
      </View>
    );
  }

  const userFields = [
    { label: "ID", value: user.id },
    { label: "UID", value: user.uid },
    { label: "Password", value: user.password },
    { label: "First Name", value: user.first_name },
    { label: "Last Name", value: user.last_name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
  ];

  return (
    <View
      style={styles.card}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsImageOpen(true)}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.userCount}>
          User {currentIndex + 1} of {totalUsers}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        {userFields.map((field) => (
          <View key={field.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{field.label}</Text>
            <Text
              style={styles.infoValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {field.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={onPrevious}
          disabled={currentIndex === 0}
          style={[
            styles.navButton,
            currentIndex === 0 && styles.disabledButton,
          ]}
          accessibilityLabel="Previous user"
        >
          <ChevronLeft size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNext}
          disabled={currentIndex >= totalUsers - 1}
          style={[
            styles.navButton,
            currentIndex >= totalUsers - 1 && styles.disabledButton,
          ]}
          accessibilityLabel="Next user"
        >
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.swipeHintContainer}>
        <Text style={styles.swipeHintText}>Swipe left/right to navigate</Text>
      </View>
      <Modal visible={isImageOpen} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsImageOpen(false)}>
          <View className="flex-1 bg-black bg-opacity-90 justify-center items-center">
            <TouchableOpacity
              className="absolute top-10 right-5 p-4"
              onPress={() => setIsImageOpen(false)}
            >
              <Text className="text-white text-2xl">✕</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: user.avatar }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default UserCard;

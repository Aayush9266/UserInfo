import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  StatusBar,
  useColorScheme,
} from "react-native";
import { fetchUsers, User } from "@/services/api";
import UserCard from "@/components/UserCard";
import Icon from "react-native-vector-icons/MaterialIcons";

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUsers(80);
        setUsers(data);
        setIsError(false);
      } catch (error) {
        console.error("Failed to load user data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (isError) {
      console.error("Failed to load user data. Please try again.");
    }
  }, [isError]);

  const currentUser: User | null =
    users && users.length > 0 ? users[currentIndex] : null;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (users && currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const toggleTheme = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsDarkMode((prev) => !prev);
      fadeAnim.setValue(1);
    });
  };

  return (
    <>
      <StatusBar
        backgroundColor={isDarkMode ? "#1F2937" : "#F0F4FF"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <ScrollView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View className="flex-row justify-between items-center mb-6 px-4">
          <View className="flex-1">
            <Text
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              User Information
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            className={`flex-row items-center ${
              isDarkMode ? "bg-blue-500" : "bg-gray-900"
            } py-2 px-3 rounded-full shadow`}
          >
            <Icon
              name={isDarkMode ? "brightness-7" : "brightness-3"}
              size={18}
              color="#FFFFFF"
            />
            <Text className="text-white font-medium text-sm ml-1.5">
              {isDarkMode ? "Light" : "Dark"}
            </Text>
          </TouchableOpacity>
        </View>

        <UserCard
          user={currentUser}
          isLoading={isLoading}
          totalUsers={users?.length || 0}
          currentIndex={currentIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isDarkMode={isDarkMode}
        />

        <View>
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } text-center mt-4 italic`}
          >
            Click on the arrows to explore more
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Index;

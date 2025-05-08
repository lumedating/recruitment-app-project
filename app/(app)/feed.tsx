import FeedItem from "@/components/feedItem";
import { useAuth } from "@/context/authContext";
import { useFirestore } from "@/context/firestoreContext";
import { globalStyles, globalStyleSheet } from "@/globalStyles";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function Feed() {
  const [userResponse, setUserResponse] = useState<any>(null);
  const [otherResponses, setOtherResponses] = useState<any[]>([]);
  const { user } = useAuth();
  const { listenToDailyResponses, toggleLikeOnResponse } = useFirestore();

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenToDailyResponses(
      user.uid,
      (myResponse: any, others: any[]) => {
        setUserResponse(myResponse);
        setOtherResponses(others);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleLikePress = async (ownerId: string) => {
    if (!user?.uid) {
      Alert.alert("Error", "User ID not available.");
      return;
    }

    try {
      await toggleLikeOnResponse(ownerId, user.uid);
    } catch (error: any) {
      console.error("Failed to like:", error.message);
      Alert.alert("Error", "Failed to like the post. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.personalResponse}>
        <View style={styles.personalResponseTop}>
          <Text style={styles.personalResponseHeader}>
            Your response was...
          </Text>
          <Link dismissTo href="/home" style={globalStyleSheet.linkText}>
            Edit response
          </Link>
        </View>
        <Text style={styles.personalResponseText}>
          {userResponse?.responseText || "No response submitted yet."}
        </Text>
      </View>

      <View style={styles.feedContainer}>
        {otherResponses.map((res) => (
          <FeedItem
            key={res.responseID}
            profilePic={require("../../assets/images/Anonymous Profile Picture.png")}
            username={"Anonymous"}
            likeCount={res.likes || 0}
            likedBy={res.likedBy || {}}
            userId={res.userId}
            currentUserId={user?.uid}
            onLikePress={() => handleLikePress(res.userId)}
          >
            {res.responseText || ""}
          </FeedItem>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    paddingHorizontal: 25,
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: globalStyles.colors.background,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
  },
  personalResponse: {
    width: "100%",
    padding: 20,
    paddingTop: 12,
    backgroundColor: globalStyles.colors.card,
    borderRadius: 12,
    borderColor: globalStyles.colors.line,
    borderWidth: 1,
  },
  personalResponseTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  personalResponseHeader: {
    fontFamily: globalStyles.fonts.secondary,
    fontSize: 14,
    color: globalStyles.colors.secondaryText,
  },
  personalResponseText: {
    marginTop: 15,
    fontFamily: globalStyles.fonts.primary,
    fontSize: 25,
    lineHeight: 25,
  },
  feedContainer: {
    width: "100%",
    marginTop: 50,
  },
});

import FeedItem from "@/components/feedItem";
import { useAuth } from "@/context/authContext";
import { useFirestore } from "@/context/firestoreContext";
import { globalStyles, globalStyleSheet } from "@/globalStyles";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function Feed() {
  type ResponseItem = {
    likes: number;
    responseID: string;
    responseText: string;
    timestamp: any;
    username: string;
    userId: string;
    likedBy: { [userId: string]: boolean }; // Map of userIds who liked this response
  };

  const [otherResponses, setOtherResponses] = useState<ResponseItem[]>([]);

  const [userResponse, setUserResponse] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const {
    fetchDailyResponse,
    fetchAllDailyResponsesExceptUser,
    toggleLikeOnResponse,
  } = useFirestore();

  const fetchResponses = async () => {
    const [userRes, othersRes] = await Promise.all([
      fetchDailyResponse(user?.uid),
      fetchAllDailyResponsesExceptUser(user?.uid),
    ]);

    if (!userRes.success) {
      Alert.alert("Your Response", userRes.msg);
    } else {
      setUserResponse(userRes.data);
    }

    if (!othersRes.success) {
      Alert.alert("Feed", othersRes.msg);
    } else {
      setOtherResponses(othersRes.data);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

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
        <Text style={styles.personalResponseText}>{userResponse}</Text>
      </View>

      <View>
        {otherResponses.map((res, idx) => (
          <FeedItem
            key={res.responseID || idx}
            profilePic={require("../../assets/images/Anonymous Profile Picture.png")}
            username={"Anonymous"}
            likeCount={res.likes || 0}
            likedBy={res.likedBy || {}}
            userId={res.userId} // Who posted this response
            currentUserId={user?.uid}
            onLikePress={async () => {
              await toggleLikeOnResponse(res.userId, user?.uid);
              await fetchResponses(); // Refreshes the full state
            }}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    flexDirection: "row",
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
});

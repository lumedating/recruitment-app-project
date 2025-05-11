import { globalStyles, globalStyleSheet } from "@/globalStyles";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FeedItem({
  children,
  profilePic,
  username,
  likeCount,
  likedBy,
  userId,
  currentUserId,
  onLikePress,
}: {
  children: React.ReactNode;
  profilePic: any;
  username: string;
  likeCount: number;
  likedBy: { [key: string]: boolean };
  userId: string;
  currentUserId: string;
  onLikePress: () => void;
}) {
  const hasLiked = likedBy?.[currentUserId] === true;

  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <Image
          source={profilePic}
          resizeMode="cover"
          style={styles.profilePicture}
        />
        <Text style={styles.usernameText}>{username}</Text>
      </View>

      <Text style={styles.responseText}>{children}</Text>

      <TouchableOpacity style={styles.containerBottom} onPress={onLikePress}>
        <Image
          source={
            hasLiked
              ? require("../assets/images/Heart Icon Filled.png")
              : require("../assets/images/Heart Icon.png")
          }
          resizeMode="cover"
          style={styles.likeCountImage}
        />
        <Text style={styles.likeCountText}>{likeCount}</Text>
      </TouchableOpacity>

      <View style={globalStyleSheet.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", paddingBottom: 25 },
  containerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  usernameText: {
    fontFamily: globalStyles.fonts.primarySemiBold,
    color: globalStyles.colors.secondaryText,
    fontSize: 20,
    marginLeft: 8,
  },
  responseText: {
    marginTop: 15,
    fontFamily: globalStyles.fonts.primary,
    fontSize: 25,
    lineHeight: 25,
  },
  containerBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  likeCountImage: {
    width: 30,
    height: 30,
  },
  likeCountText: {
    fontFamily: globalStyles.fonts.primarySemiBold,
    color: globalStyles.colors.text,
    fontSize: 23,
    marginLeft: 5,
    marginTop: -5,
  },
});

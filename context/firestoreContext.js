import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext } from "react";
import { db } from "../firebaseConfig";

export const FirestoreContext = createContext();

export const FirestoreContextProvider = ({ children }) => {
  const addDailyResponse = async (userId, responseText) => {
    try {
      // Get today's date in LOCAL time (not UTC)
      const currentDateObj = new Date();
      const localDate =
        currentDateObj.getFullYear() +
        "-" +
        String(currentDateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(currentDateObj.getDate()).padStart(2, "0");

      const responseID = doc(collection(db, "responseIDs")).id;

      const responseData = {
        likes: 0,
        responseID: responseID,
        responseText: responseText,
        timestamp: serverTimestamp(),
        username: "Anonymous",
      };

      // 1️⃣ Update the dailyResponses collection (map with userId keys)
      const dailyResponseRef = doc(db, "dailyResponses", localDate);
      await setDoc(
        dailyResponseRef,
        {
          responses: {
            [userId]: responseData,
          },
        },
        { merge: true }
      );

      // 2️⃣ Update the users collection (responses map keyed by date)
      const userDocRef = doc(db, "users", userId);
      await setDoc(
        userDocRef,
        {
          responses: {
            [localDate]: responseData,
          },
        },
        { merge: true }
      );

      return { success: true, data: responseID };
    } catch (error) {
      return { success: false, msg: error.message };
    }
  };

  const fetchDailyResponse = async (userId) => {
    try {
      // Get today's date in LOCAL time (YYYY-MM-DD)
      const currentDateObj = new Date();
      const localDate =
        currentDateObj.getFullYear() +
        "-" +
        String(currentDateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(currentDateObj.getDate()).padStart(2, "0");

      // Reference to the user's doc
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        return { success: false, msg: "User not found" };
      }

      const userData = userSnap.data();

      const responseForToday = userData.responses?.[localDate];

      if (responseForToday) {
        return { success: true, data: responseForToday.responseText };
      } else {
        return { success: false, msg: "No response for today" };
      }
    } catch (error) {
      return { success: false, msg: error.message };
    }
  };

  const fetchAllDailyResponsesExceptUser = async (userId) => {
    try {
      const currentDateObj = new Date();
      const localDate =
        currentDateObj.getFullYear() +
        "-" +
        String(currentDateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(currentDateObj.getDate()).padStart(2, "0");

      const dailyResponseRef = doc(db, "dailyResponses", localDate);
      const dailySnap = await getDoc(dailyResponseRef);

      if (!dailySnap.exists()) {
        return { success: false, msg: "No responses for today yet." };
      }

      const allResponses = dailySnap.data().responses || {};

      // Filter out current user's response
      const otherResponses = Object.entries(allResponses)
        .filter(([uid]) => uid !== userId)
        .map(([uid, response]) => ({
          ...response,
          userId: uid,
          likedBy: response.likedBy || {},
        }))
        .sort((a, b) => (b.likes || 0) - (a.likes || 0));

      return { success: true, data: otherResponses };
    } catch (error) {
      return { success: false, msg: error.message };
    }
  };

  const toggleLikeOnResponse = async (responseOwnerId, currentUserId) => {
    try {
      const currentDateObj = new Date();
      const localDate =
        currentDateObj.getFullYear() +
        "-" +
        String(currentDateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(currentDateObj.getDate()).padStart(2, "0");

      const dailyResponseRef = doc(db, "dailyResponses", localDate);
      const userDocRef = doc(db, "users", responseOwnerId);

      const result = await runTransaction(db, async (transaction) => {
        const dailySnap = await transaction.get(dailyResponseRef);
        if (!dailySnap.exists()) throw new Error("Daily responses not found");

        const data = dailySnap.data();
        const response = data.responses?.[responseOwnerId];
        if (!response) throw new Error("Response not found");

        const likedBy = response.likedBy || {};
        const hasLiked = likedBy[currentUserId] === true;

        const updatedLikedBy = { ...likedBy };
        if (hasLiked) {
          delete updatedLikedBy[currentUserId];
        } else {
          updatedLikedBy[currentUserId] = true;
        }

        const newLikeCount = Object.keys(updatedLikedBy).length;

        const updatedResponse = {
          ...response,
          likes: newLikeCount,
          likedBy: updatedLikedBy,
        };

        // Update both docs within the transaction
        transaction.set(
          dailyResponseRef,
          {
            responses: {
              [responseOwnerId]: updatedResponse,
            },
          },
          { merge: true }
        );

        transaction.set(
          userDocRef,
          {
            responses: {
              [localDate]: updatedResponse,
            },
          },
          { merge: true }
        );

        return {
          newLikeCount,
          newLikedBy: updatedLikedBy,
          hasLiked: !hasLiked,
        };
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <FirestoreContext.Provider
      value={{
        addDailyResponse,
        fetchDailyResponse,
        fetchAllDailyResponsesExceptUser,
        toggleLikeOnResponse,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = () => {
  const value = useContext(FirestoreContext);

  if (!value) {
    throw new Error("useFirestore must be used within a FirestoreProvider");
  }

  return value;
};

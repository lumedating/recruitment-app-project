import {
  collection,
  doc,
  getDoc,
  onSnapshot,
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
        likedBy: {},
        responseID,
        responseText,
        timestamp: serverTimestamp(),
        username: "Anonymous",
      };

      const dailyResponseRef = doc(db, "dailyResponses", localDate);
      const userDocRef = doc(db, "users", userId);

      // Write both (not transactionally)
      await setDoc(
        dailyResponseRef,
        {
          responses: { [userId]: responseData },
        },
        { merge: true }
      );

      await setDoc(
        userDocRef,
        {
          responses: { [localDate]: responseData },
        },
        { merge: true }
      );

      return { success: true };
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

  const listenToDailyResponses = (userId, callback) => {
    const currentDateObj = new Date();
    const localDate =
      currentDateObj.getFullYear() +
      "-" +
      String(currentDateObj.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(currentDateObj.getDate()).padStart(2, "0");

    const dailyResponseRef = doc(db, "dailyResponses", localDate);

    return onSnapshot(dailyResponseRef, (docSnap) => {
      const data = docSnap.exists() ? docSnap.data().responses || {} : {};
      const userResponse = data[userId] || null;
      const others = Object.entries(data)
        .filter(([uid]) => uid !== userId)
        .map(([uid, response]) => ({
          ...response,
          userId: uid,
        }))
        .sort((a, b) => (b.likes || 0) - (a.likes || 0));
      callback(userResponse, others);
    });
  };

  const toggleLikeOnResponse = async (responseOwnerId, currentUserId) => {
    if (!responseOwnerId || !currentUserId) {
      console.warn("Missing response owner ID or current user ID.");
      return;
    }

    const currentDateObj = new Date();
    const localDate =
      currentDateObj.getFullYear() +
      "-" +
      String(currentDateObj.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(currentDateObj.getDate()).padStart(2, "0");

    const dailyResponseRef = doc(db, "dailyResponses", localDate);
    const userDocRef = doc(db, "users", responseOwnerId);

    try {
      await runTransaction(db, async (transaction) => {
        const dailySnap = await transaction.get(dailyResponseRef);
        if (!dailySnap.exists()) {
          console.warn("No daily response doc found.");
          throw new Error("Daily response not found");
        }

        const allResponses = dailySnap.data().responses || {};
        const response = allResponses[responseOwnerId];
        if (!response) {
          console.warn("No response found for this owner.");
          throw new Error("Response not found");
        }

        const likedBy = response.likedBy || {};
        const hasLiked = likedBy[currentUserId];

        if (hasLiked) {
          delete likedBy[currentUserId];
        } else {
          likedBy[currentUserId] = true;
        }

        const newLikeCount = Object.keys(likedBy).length;

        // ✅ Instead of set, use update with dot notation for nested fields
        transaction.update(dailyResponseRef, {
          [`responses.${responseOwnerId}.likedBy`]: likedBy,
          [`responses.${responseOwnerId}.likes`]: newLikeCount,
        });

        transaction.update(userDocRef, {
          [`responses.${localDate}.likedBy`]: likedBy,
          [`responses.${localDate}.likes`]: newLikeCount,
        });
      });
    } catch (error) {
      console.error("Transaction failed:", error.message);
      throw error;
    }
  };

  return (
    <FirestoreContext.Provider
      value={{
        addDailyResponse,
        fetchDailyResponse,
        listenToDailyResponses,
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

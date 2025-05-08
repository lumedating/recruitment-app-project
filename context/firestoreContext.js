import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
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

  return (
    <FirestoreContext.Provider value={{ addDailyResponse }}>
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

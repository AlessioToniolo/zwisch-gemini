import React, { createContext, useState, useEffect } from 'react';
import {
  auth, db
} from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists) {
          setCurrentUser({ ...user, ...userDoc.data() });
        } else {
          // If the user document doesn't exist, create it
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name: user.displayName,
            createdAt: new Date(),
          });
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import { useState, useEffect } from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const Auth = () => {
  const [user, setUser] = useState(null);

  // Check if user is already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {user ? (
        <div className="p-6 bg-white rounded-lg shadow-lg text-center">
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
};

export default Auth;

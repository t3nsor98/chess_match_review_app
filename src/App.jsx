import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Chess Review App</h1>
        {user ? (
          <>
            <button
              onClick={() => signOut(auth).then(() => setUser(null))}
              className="px-4 py-2 bg-red-500 text-white rounded mb-4"
            >
              Sign Out
            </button>
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
            </Routes>
          </>
        ) : (
          <Auth setUser={setUser} />
        )}
      </div>
    </Router>
  );
}

export default App;

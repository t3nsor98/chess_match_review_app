import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ChessBoard from "./ChessBoard";

const Dashboard = ({ user }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [pgnInput, setPgnInput] = useState("");

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesRef = collection(db, "games");
      const q = query(gamesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const gamesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gamesList);
    } catch (error) {
      console.error("Error fetching games: ", error);
      setError("Failed to fetch games. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePgnSubmit = () => {
    setSelectedGame(pgnInput);
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-xl font-bold mb-2">Match History</h2>
      {loading ? (
        <p className="text-gray-600">Loading games...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : games.length === 0 ? (
        <p className="text-gray-600">No games found.</p>
      ) : (
        <ul className="border rounded p-2 bg-white">
          {games.map((game) => (
            <li
              key={game.id}
              className="p-2 border-b last:border-0 cursor-pointer hover:bg-gray-200"
              onClick={() => setSelectedGame(game.pgn)}
            >
              {new Date(game.createdAt?.seconds * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 w-full max-w-lg">
        <textarea
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Paste your PGN here..."
          value={pgnInput}
          onChange={(e) => setPgnInput(e.target.value)}
        ></textarea>
        <button
          onClick={handlePgnSubmit}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Review PGN
        </button>
      </div>
      {selectedGame && <ChessBoard pgn={selectedGame} />}
    </div>
  );
};

export default Dashboard;

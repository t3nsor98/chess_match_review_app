import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessBoard = ({ pgn }) => {
  const [game, setGame] = useState(new Chess());
  const [bestMove, setBestMove] = useState("");
  const [mistakes, setMistakes] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    if (pgn) {
      const newGame = new Chess();
      if (newGame.loadPgn(pgn)) {
        setGame(newGame);
        analyzeGame(newGame);
      }
    }
  }, [pgn]);

  useEffect(() => {
    const loadStockfish = () => {
      const stockfishInstance = new Worker(
        new URL("stockfish/src/stockfish.js", import.meta.url)
      );
      stockfishInstance.postMessage("uci");
      setEngine(stockfishInstance);
    };
    loadStockfish();
  }, []);

  const analyzeGame = (chessGame) => {
    if (!engine) return;

    const moves = chessGame.history({ verbose: true });
    let detectedMistakes = [];

    const analyzeMove = (index) => {
      if (index >= moves.length) return;

      const move = moves[index];
      chessGame.undo();
      engine.postMessage(`position fen ${chessGame.fen()}`);
      engine.postMessage("go depth 15");

      engine.onmessage = (event) => {
        if (typeof event.data === "string") {
          if (event.data.includes("bestmove")) {
            const move = event.data.split("bestmove ")[1].split(" ")[0];
            setBestMove(move);
            if (move !== moves[index].from + moves[index].to) {
              detectedMistakes.push({
                move: moves[index].san,
                moveNumber: index + 1,
              });
              setMistakes([...detectedMistakes]);
            }
            analyzeMove(index + 1);
          }
          if (event.data.includes("info depth 15")) {
            const evalMatch = event.data.match(/score cp (-?\d+)/);
            if (evalMatch) {
              setEvaluation(parseInt(evalMatch[1], 10) / 100);
            }
          }
        }
      };
    };

    analyzeMove(0);
  };

  return (
    <div className="mt-4 w-full max-w-lg flex flex-col items-center">
      <Chessboard position={game.fen()} />
      {bestMove && <p className="mt-2 text-green-600">Best Move: {bestMove}</p>}
      {evaluation !== null && (
        <p className="mt-2 text-blue-600">Evaluation: {evaluation}</p>
      )}
      {mistakes.length > 0 && (
        <div className="mt-2 text-red-600">
          <h3 className="font-bold">Mistakes:</h3>
          <ul>
            {mistakes.map((mistake, index) => (
              <li key={index}>
                Move {mistake.moveNumber}: {mistake.move}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;

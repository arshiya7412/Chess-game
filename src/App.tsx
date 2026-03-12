/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { Sidebar } from './components/Sidebar';
import { getBestMove } from './utils/ai';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [gameMode, setGameMode] = useState<'pvp' | 'pva'>('pva');
  const [history, setHistory] = useState<Move[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sound effects (optional, using browser Audio API if available)
  const playMoveSound = useCallback(() => {
    try {
      const audio = new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3');
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  const playCaptureSound = useCallback(() => {
    try {
      const audio = new Audio('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3');
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  const updateGameState = useCallback((newGame: Chess, move?: Move) => {
    setGame(newGame);
    setFen(newGame.fen());
    setHistory(newGame.history({ verbose: true }) as Move[]);
    if (move) {
      setLastMove({ from: move.from, to: move.to });
      if (move.captured) {
        playCaptureSound();
      } else {
        playMoveSound();
      }
    } else {
      setLastMove(null);
    }
  }, [playCaptureSound, playMoveSound]);

  const makeAiMove = useCallback(() => {
    if (game.isGameOver() || game.turn() === 'w') return;

    setIsAiThinking(true);
    
    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      const bestMove = getBestMove(game, 3);
      if (bestMove) {
        const newGame = new Chess(game.fen());
        const move = newGame.move(bestMove);
        updateGameState(newGame, move);
      }
      setIsAiThinking(false);
    }, 100);
  }, [game, updateGameState]);

  // Trigger AI move when it's black's turn in PvA mode
  useEffect(() => {
    if (gameMode === 'pva' && game.turn() === 'b' && !game.isGameOver()) {
      makeAiMove();
    }
  }, [fen, gameMode, game, makeAiMove]);

  const onSquareClick = (square: string) => {
    if (game.isGameOver()) return;
    if (gameMode === 'pva' && game.turn() === 'b') return; // Prevent moves during AI turn

    // If a square is already selected, try to move
    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare as Square, verbose: true });
      const move = moves.find((m) => m.to === square);

      if (move) {
        const newGame = new Chess(game.fen());
        try {
          const result = newGame.move({
            from: selectedSquare,
            to: square,
            promotion: 'q', // Always promote to queen for simplicity
          });
          
          if (result) {
            updateGameState(newGame, result);
            setSelectedSquare(null);
            setPossibleMoves([]);
            return;
          }
        } catch (e) {
          // Invalid move
        }
      }
    }

    // If clicking on a piece of the current turn's color, select it
    const piece = game.get(square as Square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as Square, verbose: true });
      setPossibleMoves(moves.map((m) => m.to));
    } else {
      // Clicked on empty square or opponent's piece without a valid move
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const handleRestart = () => {
    const newGame = new Chess();
    updateGameState(newGame);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const newGame = new Chess(game.fen());
    newGame.undo();
    
    // If playing against AI, undo two moves (AI and Player)
    if (gameMode === 'pva' && newGame.turn() === 'b') {
      newGame.undo();
    }
    
    updateGameState(newGame);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const handleToggleMode = () => {
    setGameMode((prev) => (prev === 'pvp' ? 'pva' : 'pvp'));
    handleRestart(); // Restart game when switching modes
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex items-center justify-center p-4 md:p-8 transition-colors duration-200">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-stone-800 shadow-md text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 items-start justify-center">
        
        {/* Main Board Area */}
        <div className="flex-1 w-full flex flex-col items-center justify-center max-w-[600px] mx-auto">
          <div className="w-full flex justify-between items-end mb-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-white font-bold shadow-md">
                {gameMode === 'pva' ? 'AI' : 'P2'}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-tight">Black</span>
                {isAiThinking && <span className="text-xs text-stone-500 animate-pulse">Thinking...</span>}
              </div>
            </div>
            {/* Captured pieces could go here */}
          </div>

          <ChessBoard
            game={game}
            selectedSquare={selectedSquare}
            possibleMoves={possibleMoves}
            lastMove={lastMove}
            onSquareClick={onSquareClick}
          />

          <div className="w-full flex justify-between items-start mt-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center text-stone-800 font-bold shadow-md">
                P1
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-tight">White</span>
                <span className="text-xs text-stone-500">You</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 h-[600px] flex-shrink-0">
          <Sidebar
            game={game}
            history={history}
            gameMode={gameMode}
            onRestart={handleRestart}
            onUndo={handleUndo}
            onToggleMode={handleToggleMode}
          />
        </div>

      </div>
    </div>
  );
}

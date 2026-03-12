import React from 'react';
import { Chess, Move } from 'chess.js';
import { RotateCcw, Undo2, Bot, User, Settings } from 'lucide-react';

interface SidebarProps {
  game: Chess;
  history: Move[];
  gameMode: 'pvp' | 'pva';
  onRestart: () => void;
  onUndo: () => void;
  onToggleMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  game,
  history,
  gameMode,
  onRestart,
  onUndo,
  onToggleMode
}) => {
  const isGameOver = game.isGameOver();
  const isCheckmate = game.isCheckmate();
  const isDraw = game.isDraw();
  const isStalemate = game.isStalemate();
  const isThreefoldRepetition = game.isThreefoldRepetition();
  const isInsufficientMaterial = game.isInsufficientMaterial();
  const turn = game.turn() === 'w' ? 'White' : 'Black';

  let statusMessage = `${turn} to move`;
  let statusColor = 'text-stone-700 dark:text-stone-300';

  if (isCheckmate) {
    statusMessage = `Checkmate! ${turn === 'White' ? 'Black' : 'White'} wins!`;
    statusColor = 'text-red-600 font-bold';
  } else if (isStalemate) {
    statusMessage = 'Draw by stalemate';
    statusColor = 'text-amber-600 font-bold';
  } else if (isThreefoldRepetition) {
    statusMessage = 'Draw by threefold repetition';
    statusColor = 'text-amber-600 font-bold';
  } else if (isInsufficientMaterial) {
    statusMessage = 'Draw by insufficient material';
    statusColor = 'text-amber-600 font-bold';
  } else if (isDraw) {
    statusMessage = 'Game drawn';
    statusColor = 'text-amber-600 font-bold';
  } else if (game.inCheck()) {
    statusMessage = `${turn} is in check!`;
    statusColor = 'text-red-500 font-semibold';
  }

  // Group history into pairs (White, Black)
  const groupedHistory: { white: Move; black?: Move }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    groupedHistory.push({
      white: history[i],
      black: history[i + 1]
    });
  }

  return (
    <div className="flex flex-col w-full md:w-80 h-full bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      {/* Header / Status */}
      <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Chess</h2>
        <div className={`text-lg ${statusColor}`}>
          {statusMessage}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 grid grid-cols-2 gap-3 border-b border-stone-200 dark:border-stone-800">
        <button
          onClick={onToggleMode}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg transition-colors text-sm font-medium"
        >
          {gameMode === 'pvp' ? <User size={18} /> : <Bot size={18} />}
          {gameMode === 'pvp' ? 'PvP' : 'vs AI'}
        </button>
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg transition-colors text-sm font-medium"
        >
          <RotateCcw size={18} />
          Restart
        </button>
        <button
          onClick={onUndo}
          disabled={history.length === 0 || isGameOver}
          className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Undo2 size={18} />
          Undo Move
        </button>
      </div>

      {/* Move History */}
      <div className="flex-1 overflow-y-auto p-4 bg-stone-50/50 dark:bg-stone-900/20">
        <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-3">
          Move History
        </h3>
        {history.length === 0 ? (
          <p className="text-stone-400 dark:text-stone-600 text-sm italic text-center mt-8">
            No moves yet
          </p>
        ) : (
          <div className="space-y-1">
            {groupedHistory.map((pair, index) => (
              <div
                key={index}
                className="flex items-center text-sm py-1.5 px-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <span className="w-8 text-stone-400 dark:text-stone-500 font-mono">
                  {index + 1}.
                </span>
                <span className="flex-1 font-medium text-stone-700 dark:text-stone-300">
                  {pair.white.san}
                </span>
                <span className="flex-1 font-medium text-stone-700 dark:text-stone-300">
                  {pair.black ? pair.black.san : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

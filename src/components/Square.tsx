import React from 'react';
import { Piece, PieceType, PieceColor } from './Piece';

interface SquareProps {
  square: string;
  piece: { type: PieceType; color: PieceColor } | null;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isLastMove: boolean;
  inCheck: boolean;
  onClick: (square: string) => void;
}

export const Square: React.FC<SquareProps> = ({
  square,
  piece,
  isLight,
  isSelected,
  isPossibleMove,
  isLastMove,
  inCheck,
  onClick
}) => {
  // Base colors for the board
  const baseColor = isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]';
  
  // Highlight colors
  let highlightClass = '';
  if (isSelected) {
    highlightClass = 'bg-[#f6f669] opacity-80'; // Yellow highlight for selected
  } else if (isLastMove) {
    highlightClass = 'bg-[#cdd26a] opacity-80'; // Greenish highlight for last move
  }

  // Check highlight
  const checkHighlight = inCheck && piece?.type === 'k' ? 'bg-red-500 opacity-90' : '';

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center cursor-pointer select-none ${baseColor}`}
      onClick={() => onClick(square)}
    >
      {/* Highlight overlays */}
      {highlightClass && <div className={`absolute inset-0 ${highlightClass}`} />}
      {checkHighlight && <div className={`absolute inset-0 ${checkHighlight}`} />}
      
      {/* Possible move indicator */}
      {isPossibleMove && !piece && (
        <div className="absolute w-[30%] h-[30%] rounded-full bg-black/20 z-10" />
      )}
      {isPossibleMove && piece && (
        <div className="absolute inset-0 border-[6px] border-black/20 rounded-full z-10" />
      )}

      {/* Piece */}
      {piece && (
        <div className="relative z-20 w-[80%] h-[80%]">
          <Piece type={piece.type} color={piece.color} />
        </div>
      )}

      {/* Coordinates (optional, could add if needed) */}
    </div>
  );
};

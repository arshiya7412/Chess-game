import React from 'react';
import { Chess, Square as ChessSquare } from 'chess.js';
import { Square } from './Square';
import { PieceType, PieceColor } from './Piece';

interface ChessBoardProps {
  game: Chess;
  selectedSquare: string | null;
  possibleMoves: string[];
  lastMove: { from: string; to: string } | null;
  onSquareClick: (square: string) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  selectedSquare,
  possibleMoves,
  lastMove,
  onSquareClick
}) => {
  const board = game.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  const inCheck = game.inCheck();
  const turn = game.turn();

  return (
    <div className="w-full max-w-[600px] aspect-square border-4 border-stone-800 rounded-sm shadow-2xl overflow-hidden">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {board.map((row, rowIndex) => 
          row.map((piece, colIndex) => {
            const file = files[colIndex];
            const rank = 8 - rowIndex;
            const square = `${file}${rank}` as ChessSquare;
            
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isPossibleMove = possibleMoves.includes(square);
            const isLastMove = lastMove?.from === square || lastMove?.to === square;
            const isKingInCheck = inCheck && piece?.type === 'k' && piece?.color === turn;

            return (
              <Square
                key={square}
                square={square}
                piece={piece as { type: PieceType; color: PieceColor } | null}
                isLight={isLight}
                isSelected={isSelected}
                isPossibleMove={isPossibleMove}
                isLastMove={isLastMove}
                inCheck={isKingInCheck}
                onClick={onSquareClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

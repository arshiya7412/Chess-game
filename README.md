# React Chess Game

A fully functional, responsive chess application built with React, TypeScript, and Tailwind CSS. Play locally against a friend or challenge the built-in Minimax AI.

## 🌟 Features

- **Standard Chess Rules**: Full implementation of chess logic including castling, en passant, pawn promotion, check, and checkmate detection (powered by `chess.js`).
- **Game Modes**: 
  - **Player vs Player (PvP)**: Play locally with a friend on the same device.
  - **Player vs AI (PvA)**: Challenge the built-in AI opponent.
- **Custom AI**: The AI uses the Minimax algorithm with alpha-beta pruning and piece-square tables for positional evaluation (Depth 3).
- **Interactive Board**: 
  - Highlights selected pieces and their legal moves.
  - Highlights the last move made.
  - Highlights the King in red when in check.
- **Game Controls**: Undo moves, restart the game, and switch game modes at any time.
- **Move History**: Tracks and displays the game's move history in standard algebraic notation.
- **Dark Mode**: Fully supports dark and light themes with a built-in toggle.
- **Sound Effects**: Audio feedback for standard moves and piece captures.
- **Responsive Design**: Optimized for both desktop and mobile screens.

## 🛠️ Technologies Used

- **Frontend Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Chess Logic**: [chess.js](https://github.com/jhlywa/chess.js)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-chess-game.git
   cd react-chess-game
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port provided in your terminal).

## 📂 Project Structure

- `/src/components/ChessBoard.tsx`: Renders the 8x8 grid and manages square states.
- `/src/components/Square.tsx`: Individual square component handling highlights and piece rendering.
- `/src/components/Piece.tsx`: SVG-based chess piece icons.
- `/src/components/Sidebar.tsx`: UI for game status, controls, and move history.
- `/src/utils/ai.ts`: The Minimax AI logic and piece-square evaluation tables.
- `/src/App.tsx`: Main application state, game loop, and layout.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/react-chess-game/issues).

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

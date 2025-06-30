# Mines Game

A classic Minesweeper-style game built with **Next.js**, **Zustand** for state management, and styled with pure CSS.

---

## About

Mines Game is a web-based game where players try to reveal safe cells without triggering mines.  
This project uses the React-based **Next.js** framework for server-side rendering and routing,  
**Zustand** for lightweight and simple state management, and pure CSS for styling without any additional frameworks.

---

## Features

- Interactive grid with clickable cells  
- Mine detection and game-over handling  
- **Autoplay** mode to automatically play multiple rounds  
- **Balance limitation** feature to control betting amount limits  
- **Betting strategy** options to customize betting behavior  
- **Big bonus round** triggered after every 3 rounds to increase winnings  
- State persistence across game sessions  
- Responsive layout for all screen sizes  

---

## Technologies

- **Next.js** – React framework for building web applications  
- **Zustand** – Lightweight state management library  
- **CSS** – Pure CSS for styling without dependencies  

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/mines-game.git
   cd mines-game
2. Install dependencies:

npm install
# or
yarn install

3. Run the development server:

npm run dev
# or
yarn dev

4. Open http://localhost:3000 in your browser to play the game.

## Usage
- Click on cells to reveal safe spots.

- Avoid clicking on mines to prevent game over.

- Use the UI controls to restart or change game settings.

- Enable Autoplay to automatically play multiple rounds based on your betting strategy and balance limits.

- Watch for the Big Bonus Round every 3 rounds for a chance to win bigger rewards.

## State Management
The game state — including the grid data, mine positions, betting amounts, autoplay settings, and bonus round triggers —
is managed with Zustand for efficient and simple global state handling.

## Styling
All styles are written in pure CSS. Stylesheets are located in the /styles folder and imported directly into components or pages.


   

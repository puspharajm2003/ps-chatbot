# PS Chatbot - Luxury Intelligence

Welcome to **PS Chatbot**, a high-end, luxurious AI application powered by React, Vite, and OpenRouter AI. This platform allows users to interact with advanced text, image, and video generation models with a sleek, responsive, and glassmorphism-inspired UI.

## Features

- **Luxurious UI/UX**: Dark mode, gold accents, smooth framer-motion animations, and glassmorphism.
- **Dynamic AI Models**: Seamlessly switch between PS Standard Intelligence, PS Advanced Intelligence, Vision, and Motion capabilities.
- **OpenRouter Integration**: Fully configured to tap into OpenRouter's free and premium intelligence endpoints.
- **Secure Authentication System**: Custom Auth gateway paired with a Node.js Express backend and PostgreSQL database.
- **Profile Management**: Securely update your username, password, and manage your personal OpenRouter API Key directly from your profile dashboard.

## Project Structure

The project is split into two primary environments:
- **Frontend**: A React application powered by Vite located in the root directory.
- **Backend**: A Node.js and Express API Server located in the `/server` directory that interacts with a NeonDB PostgreSQL database.

## Step-by-Step Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- An [OpenRouter](https://openrouter.ai/) account for an API key.
- A [Neon PostgreSQL](https://neon.tech/) database (or any standard Postgres SQL instance).

### 1. Database & Backend Configuration

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/server` directory and add your Neon Database connection string:
   ```env
   DATABASE_URL=postgresql://your_db_user:your_db_password@your_neon_db_url/neondb?sslmode=require
   PORT=5000
   ```
4. Start the backend server. (The server will automatically initialize the necessary `users` table upon the first run):
   ```bash
   node index.js
   ```

### 2. Frontend Configuration

1. Open a new terminal window and navigate to the project root directory.
2. Install the frontend React dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local link provided by Vite (e.g., `http://localhost:5174`).

### 3. Usage & Access

- **Sign Up / Sign In**: Upon loading the application, you will be presented with the authentication gateway. Create a new account, which will be securely saved into your connected PostgreSQL database.
- **Guest Mode**: If you want to test the UI without an account, simply click "Continue as Guest".
- **Adding Your API Key**: To use the live text AI models, click the gear icon in the sidebar to visit your **Profile Settings**. Paste your OpenRouter API key into the designated field and click Save. 
- **Generating Content**: Select your desired intelligence model from the top navigation dropdown. Type `/script` to generate code blocks, or switch to the *Vision/Motion* models to see the gorgeous UI handle simulated multimedia formatting.

## Technology Stack

- **Frontend**: React, Vite, Framer Motion, Lucide React, Vanilla CSS.
- **Backend**: Node.js, Express, pg (PostgreSQL Client), bcryptjs.
- **Database**: Neon PostgreSQL.

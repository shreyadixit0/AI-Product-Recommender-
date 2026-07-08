# AI Product Recommendation System

A modern, AI-powered web application that understands natural language queries and recommends products based on user needs. Built with Next.js and powered by the Gemini AI API.

## 🚀 Features

- **Natural Language Search:** Tell the AI what you need in plain English (e.g., "I need a budget phone under 15,000 rupees"), and it will find the best match.
- **Dual Currency Support:** Instantly toggle the UI between USD ($) and INR (₹). The AI backend is also configured to automatically handle currency conversions during the search process.
- **Beautiful UI & Animations:** Features a sleek dark/light mode, an animated cyber-grid background with floating neural orbs, and glassmorphism styling.
- **Seamless Modal View:** View product details in an elegant, animated modal overlay.
- **Secure API Handling:** API logic is handled server-side via Next.js API Routes, keeping API keys completely hidden from the frontend client.

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid, Keyframe Animations)
- **AI Integration:** Google Gemini SDK (`@google/genai`)
- **Icons:** Lucide React

## ⚙️ How to Run Locally

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser:** Visit `http://localhost:3000`

## 🧠 How it Works

1. The user inputs a query like "I want to buy a gaming keyboard."
2. The frontend sends this query to the local Next.js API route (`/api/recommend`).
3. The server securely attaches the `GEMINI_API_KEY` and constructs a prompt combining the user's query with our mock product catalog.
4. The Gemini AI model analyzes the request, performs any necessary currency conversions, and returns a JSON array of matching product IDs.
5. The API filters the catalog based on the AI's response and sends the recommended products back to the frontend to be displayed.

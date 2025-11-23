🌏 Unfold India – AI Voyage

Your AI-powered travel buddy for budget-friendly trips across India.
Generate detailed itineraries, translate local languages, and even get voice assistance — all in one place.

🚀 Features

✔ AI-generated travel itineraries across India
✔ Budget-friendly recommendations
✔ Day-wise breakdowns (food, stay, transport, hidden gems)
✔ Translation tool – Hindi, Tamil, Marathi, Bengali, Telugu, Gujarati
✔ Text-to-speech – Hear the itinerary in real voice
✔ Fast & responsive frontend UI
✔ Fully integrated with a deployed FastAPI backend

🧠 Tech Stack
⚛ Frontend

React / Vite (Lovable AI-generated base)

TailwindCSS

State Management (if used)

🐍 Backend (Deployed Separately)

FastAPI

Groq API (for AI responses & TTS)

Python-dotenv

🔗 Live Demo

👉 Frontend:
https://unfold-india-ai-voyage.lovable.app/

👉 Backend:
https://unfold-india-backend.onrender.com/docs
 (Swagger API)

💻 Run Frontend Locally
1️⃣ Clone Repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File
VITE_API_URL=https://unfold-india-backend.onrender.com

4️⃣ Run the App
npm run dev

📡 API Endpoints Used (Frontend → Backend)
Feature	Endpoint
Chat / Itinerary	/chat
Translation	/api/translate
Text-to-Speech	/api/tts
📂 Project Structure
frontend/
│── public/
│── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.jsx
│── .env
│── package.json
│── README.md  ← YOU ARE HERE

🚀 Deployment
Frontend	Backend
Lovable.app (Vercel-like hosting)	Render (FastAPI)

If you want full control, move frontend to Vercel or deploy via Netlify.

📌 Future Improvements

Save itineraries to database

User authentication (login/signup)

Custom domain (unfoldindia.in)

Add payment + premium features

AI-generated travel reel maker 🎥

Real-time train/bus/flight pricing

🤝 Contribute

Pull requests are welcome! Open an issue first to discuss any major changes.

🙌 Acknowledgements

Groq API

FastAPI

Lovable AI

TailwindCSS

All early testers ❤️

⭐ Support

If this project helped you — star the repo ⭐
It motivates further development!

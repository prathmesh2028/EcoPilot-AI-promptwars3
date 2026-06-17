<div align="center">
  <img src="https://via.placeholder.com/150/059669/FFFFFF?text=EcoPilot+AI" alt="EcoPilot AI Logo" width="100" height="100" />
  <h1>EcoPilot AI</h1>
  <p><em>Your personalized, AI-driven sustainability coach.</em></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-19-059669?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=google" alt="Google Gemini" />
  </p>
</div>

---

## 🌍 Why EcoPilot?
Current carbon footprint calculators have a retention problem: they output static, depressing numbers and generic advice (e.g., "turn off the lights"). They induce climate anxiety without providing an actionable path forward.

**EcoPilot AI** shifts the paradigm from a *calculator* to a *coach*. By translating deterministic carbon math into a relatable "Carbon Twin" persona via Google's Gemini API, EcoPilot delivers highly personalized, gamified micro-challenges. It mathematically projects how small habit changes today compound into massive emission reductions over 5 years.

---

## ✨ Core Features
* 🧠 **Carbon Twin Engine:** AI-generated personas reflecting your current environmental archetype.
* 🎯 **Action Plan:** Hyper-personalized sustainability recommendations based on your specific lifestyle constraints.
* 🏆 **Gamified Challenges:** Actionable, week-long eco-challenges to build lasting micro-habits.
* 🔮 **Future Simulator:** Interactive sliders that dynamically project the 5-year carbon impact of adopting new habits.
* 📄 **Executive Reports:** Instantly generated, professional PDF-ready sustainability capability reports.
* 💾 **Zero-Data Loss:** Full `localStorage` persistence ensures your state is maintained across sessions—no database required.

---

## 🛠️ Technical Architecture & Tech Stack

EcoPilot is engineered for high maintainability, low latency, and zero hallucination risk.

* **Frontend:** React 19, React Router v7, Vite
* **Styling:** Tailwind CSS v4, Lucide React Icons
* **AI Engine:** Google Generative AI SDK (`gemini-1.5-flash` / `gemini-1.5-pro`)
* **State Management:** React Context API

### Decoupled AI Architecture
To prevent LLM math hallucinations, EcoPilot uses a strict **decoupled architecture**:
1. **Deterministic Math:** Pure JavaScript logic calculates precise `kg CO2e` emissions using IPCC-aligned factors.
2. **Generative Narrative:** Gemini receives these hard numbers via explicit JSON schemas and strictly acts as a narrative engine to generate human-readable insights.
3. **Graceful Fallbacks:** All AI API calls are wrapped in robust `try/catch` blocks. If rate-limits are hit, the UI seamlessly falls back to high-quality mock data without crashing.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd EcoPilot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and securely add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the development server
```bash
npm run dev
```
*The app will typically be available at `http://localhost:5173`.*

---

## 📦 Deployment Instructions
This project is a statically built React SPA, optimized for effortless deployment on Vercel, Netlify, or GitHub Pages.

1. **Build the application:**
   ```bash
   npm run build
   ```
2. **Deploy:** Connect your repository to your hosting provider and add `VITE_GEMINI_API_KEY` to the platform's Environment Variables settings. Set the build command to `npm run build` and the output directory to `dist`.

---

## 🔭 Future Scope
- **Backend Integration:** Migrate from `localStorage` to Firebase/Supabase for cross-device authentication and historical tracking.
- **B2B ESG Dashboard:** Allow enterprise companies to aggregate anonymized employee data to track corporate Scope 3 emission reductions.
- **Automated Verification:** Integrate with smart home APIs or step-counters to automatically verify challenge completion rather than relying on self-reporting.

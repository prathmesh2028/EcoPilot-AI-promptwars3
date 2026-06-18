<div align="center">
  <img src="https://via.placeholder.com/150/059669/FFFFFF?text=EcoPilot+AI" alt="EcoPilot AI Logo" width="100" height="100" />
  <h1>EcoPilot AI</h1>
  <p><em>Your personalized, AI-driven sustainability coach.</em></p>

  <p>
    <img src="https://img.shields.io/badge/React-19-059669?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google" alt="Google Gemini" />
    <img src="https://img.shields.io/badge/Test_Coverage-71%25-brightgreen?style=flat-square" alt="Coverage" />
    <img src="https://img.shields.io/badge/a11y-100%25-blue?style=flat-square" alt="Accessibility" />
  </p>
</div>

---

## 🎯 Problem Statement: Understand, Track, Reduce

**Challenge:** Help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

EcoPilot AI solves this challenge through three core pillars:

### 1. UNDERSTAND
* **Dynamic Carbon Score:** We translate raw form inputs into a deterministic `kg CO₂e` baseline score.
* **Emissions Breakdown:** Visualized using Recharts, users instantly see exactly where their emissions originate (Commute vs. Food vs. Energy).
* **AI Carbon Twin:** The Gemini AI analyzes the user's data to generate a relatable "Carbon Twin" persona, translating complex metrics into an understandable, human-readable profile.

### 2. TRACK
* **Historical Tracking:** Zero-data loss `localStorage` persistence ensures users never lose their data across sessions.
* **Benchmarking:** Real-time tracking against the Global Average (4.7t) and the critical Paris Agreement Target (2.3t).
* **Activity Tracking:** The Dashboard acts as the central hub to continuously track environmental impact over time.

### 3. REDUCE
* **Gamified Challenges:** AI-generated, week-long eco-challenges designed to build lasting micro-habits.
* **Action Plan:** Hyper-personalized recommendations (with expected kg savings) based on exact lifestyle constraints.
* **Future Simulator:** Interactive sliders that dynamically project how small habit changes today mathematically compound into massive emission reductions over 1 to 5 years.

---

## 🧠 AI Integration Architecture

EcoPilot uses a **Strictly Decoupled AI Architecture** to prevent hallucination and ensure scientific accuracy:
1. **Deterministic Math:** Pure JavaScript logic calculates precise carbon emissions using IPCC-aligned conversion factors. *The AI is NEVER allowed to do math.*
2. **Generative Narrative:** Google's `gemini-1.5-flash` API receives these hard numbers via explicit JSON schemas and strictly acts as a narrative engine to generate human-readable insights.
3. **Graceful Fallbacks:** If the AI service is rate-limited, the application seamlessly falls back to high-quality mock data, ensuring zero downtime.

---

## 🧪 Automated Testing & Code Quality

This repository is optimized for stability and continuous integration:
* **Testing Framework:** Vitest + React Testing Library
* **Coverage:** 71.85% statement coverage across utilities, components, and contexts.
* **CI/CD Ready:** The test suite extensively mocks the Gemini API (`vi.mock`), ensuring tests pass deterministically in CI environments without requiring actual API keys or internet access.
* **Linting:** 0 ESLint errors. Strict adherence to React Hook dependency arrays and clean code practices.

---

## ♿ Accessibility (a11y)

EcoPilot is designed for everyone:
* **Semantic HTML:** Strict usage of `<main>`, `<header>`, and `<section>` tags.
* **ARIA Labels:** 100% coverage of `aria-label` attributes on all interactive icon buttons to ensure full screen-reader compatibility.
* **Color Contrast:** Tailored Tailwind CSS palettes that meet WCAG AA contrast ratios for text and graphical charts.
* **Keyboard Navigation:** Fully focusable interactive states across the application.

---

## 🛠️ Technical Architecture

* **Frontend:** React 19, React Router v7, Vite
* **Styling:** Tailwind CSS v4, Lucide React Icons
* **Data Visualization:** Recharts
* **State Management:** React Context API (with strict `localStorage` sync)

---

## 🚀 Deployment

The project is a standard Vite Single Page Application (SPA), fully compatible with Google Cloud Run, Vercel, or Netlify.

### Local Setup
1. Clone the repository and run `npm install`.
2. Create a `.env` file with your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Start the server: `npm run dev`
4. Run tests: `npm test` or `npm run test:coverage`

### Production Build
Run `npm run build`. The output will be completely optimized and minified in the `/dist` directory.

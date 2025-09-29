# CyberSphere

```
  _____      _                 _                    
 / ____|    | |               | |                   
| |    _   _| |__   ___ _ __  | |__   ___ _ __ _ __  
| |   | | | | '_ \ / _ \ '__| | '_ \ / _ \ '__| '_ \ 
| |___| |_| | |_) |  __/ |    | | | |  __/ |  | | | |
 \_____\__,_|_.__/ \___|_|    |_| |_|\___|_|  |_| |_|
                                                    
```

> Social media app that lets you hack or defend, build attack and counter simulations and have duels in the arena. Make the leader board and fine-tune your skills in the Attack Lab.

**CyberSphere** is an interactive, gamified web application that puts you in the driver's seat of modern cybersecurity warfare. Choose your side as an elite Hacker or a steadfast Cyber Security expert. Sharpen your skills by running simulated attacks on your own system, then enter the PVP Arena to challenge other players in real-time tactical duels. Climb the leaderboard, customize your profile, and prepare for a future of augmented reality cyber battles.

---

## ✨ Features

*   **🛡️ Asymmetrical PVP Combat:** Choose your role as a **Hacker** or **Cyber Security** specialist and engage in thrilling, turn-based tactical duels with unique abilities for each side.
*   **🔬 Attack Lab:** Sharpen your skills with a local system hardening scanner to find and fix vulnerabilities, or dive into the **PVP Arena** to test your mettle against other players.
*   **👤 Customizable Profiles:** Forge your identity with a unique username, avatar, and role. Level up and gain XP as you dominate the digital world.
*   **📊 Dynamic Dashboard:** Monitor your overall security score, track your progress with trend charts, and view your stats from a personalized command center.
*   **🌍 Social & Competitive:** Climb the global leaderboard, connect with friends, and become a legend in the CyberSphere.
*   **🗺️ Augmented Reality (Coming Soon):** Prepare for location-based gameplay where you can discover digital artifacts and battle rivals in the real world.
*   **🤖 AI-Powered Insights:** Get detailed remediation advice for security vulnerabilities, powered by the Google Gemini API.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **AI:** Google Gemini API for security insights
*   **Deployment:** Google Cloud Platform (GCP) / Firebase Hosting

## ☁️ Deployment

This project is configured for continuous deployment directly to Firebase Hosting using GitHub Actions. The workflow is defined in `.github/workflows/gcp-deploy.yml`.

Any push to the `main` branch will trigger the CI/CD pipeline, which automatically builds, tests, and deploys the latest version of the application, ensuring a seamless and scalable production environment on Google Cloud.

## 🚀 Getting Started

This is a frontend-only application that can be run directly in the browser.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cybersphere.git
    cd cybersphere
    ```

2.  **Set up Environment Variable:**
    To enable the AI-powered remediation advice, you need a Google Gemini API key. The application is set up to use an environment variable, which would typically be configured in a build tool (like Vite or Create React App) or your deployment environment.

3.  **Run Locally:**
    Since this project uses bare ES modules and an import map, the easiest way to run it locally is with a simple HTTP server.
    - If you have Node.js, you can use `npx serve`.
    - Alternatively, you can use an extension like **Live Server** in Visual Studio Code.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

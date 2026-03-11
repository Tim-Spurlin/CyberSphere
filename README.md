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
    git clone https://github.com/<your-github-username>/cybersphere.git
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
# 🛡️ CyberSphere - Advanced Security Testing Platform

<div align="center">

```
  _____      _                 _                    
 / ____|    | |               | |                   
| |    _   _| |__   ___ _ __  | |__   ___ _ __ _ __  
| |   | | | | '_ \ / _ \ '__| | '_ \ / _ \ '__| '_ \ 
| |___| |_| | |_) |  __/ |    | | | |  __/ |  | | | |
 \_____\__,_|_.__/ \___|_|    |_| |_|\___|_|  |_| |_|
                                                    
```

**Interactive Cybersecurity Dashboard for Security Hardening and Penetration Testing**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)
[![Security](https://img.shields.io/badge/Security-Production%20Ready-green.svg)](#security)

[🚀 Live Demo](https://tim-spurlin.github.io/CyberSphere/) • [📖 Documentation](#documentation) • [🔧 Installation](#installation) • [🤝 Contributing](#contributing)

</div>

## 🌟 Overview

**CyberSphere** is a cutting-edge, interactive cybersecurity platform that transforms security testing into an engaging, gamified experience. Choose your role as an elite **Hacker** or a steadfast **Cyber Security Expert**, run comprehensive security assessments on your systems, engage in tactical PvP battles, and climb the leaderboards.

### 🎯 Key Features

- 🛡️ **Comprehensive Security Testing** - 110+ attack simulations across multiple categories
- 🗺️ **Real-World Network Discovery** - Google Maps integration with live geolocation
- 🤖 **AI-Powered Remediation** - Google Gemini AI provides detailed security advice
- ⚔️ **Tactical PvP Combat** - Real-time cyber warfare simulations
- 👥 **Social Leaderboards** - Compete with peers and track progress
- 🎮 **Gamified Experience** - Role-based progression and achievements
- 🔒 **Production-Grade Security** - No mock data, real implementations only

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React 19 + TypeScript]
        TW[Tailwind CSS]
        VT[Vite Build System]
    end
    
    subgraph "Core Features"
        AL[Attack Lab]
        NM[Network Map]
        AI[AI Hub]
        PVP[PvP Battle System]
        PR[User Profiles]
        SO[Social Features]
    end
    
    subgraph "External APIs"
        GM[Google Maps API]
        GA[Google Gemini AI]
        GL[Geolocation API]
        WA[Web Audio API]
        CA[Camera API]
    end
    
    subgraph "Security Engine"
        SC[Security Checks]
        NS[Network Scanner]
        VS[Vulnerability Scanner]
        PW[PipeWire Integration]
        KS[Keylogger Detection]
    end
    
    UI --> AL
    UI --> NM
    UI --> AI
    UI --> PVP
    UI --> PR
    UI --> SO
    
    NM --> GM
    NM --> GL
    AI --> GA
    AL --> SC
    AL --> NS
    AL --> VS
    
    SC --> PW
    SC --> KS
    
    style UI fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style GM fill:#4285f4,stroke:#1a73e8,color:#fff
    style GA fill:#34a853,stroke:#137333,color:#fff
    style SC fill:#ea4335,stroke:#d33b2c,color:#fff
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Google Maps API Key** (optional, for map features)
- **Google Gemini API Key** (optional, for AI features)
- **Modern browser** with geolocation support

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tim-Spurlin/CyberSphere.git
   cd CyberSphere/system-security-hardening-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your API keys
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini AI API key for security insights | No | - |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key for network visualization | No | - |

### API Key Setup

#### Google Gemini AI
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add to your `.env` file

#### Google Maps API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials
4. Add to your `.env` file

## 🛡️ Security Testing Framework

### Attack Categories

```mermaid
mindmap
  root((Security Tests))
    System Hardening
      Kernel Parameters
      File Permissions
      Service Auditing
    Webcam & Mic Guard
      PipeWire Inspection
      Device Permissions
    Keylogger Detection
      Kernel Modules
      Input Devices
      LD_PRELOAD Hooks
    Network Security
      ARP Spoofing
      DNS Poisoning
      MITM Resistance
```

### 110+ Security Checks

Our comprehensive testing framework covers:

- **🔐 System Hardening** (25 checks)
  - Kernel parameter validation
  - File system permissions
  - Service configuration auditing
  - Firewall rule verification

- **📹 Media Device Security** (15 checks)
  - Camera access monitoring
  - Microphone permission auditing
  - PipeWire portal inspection

- **⌨️ Input Security** (20 checks)
  - Keylogger detection
  - Input device monitoring
  - Hook detection systems

- **🌐 Network Security** (30 checks)
  - ARP spoofing resistance
  - DNS poisoning protection
  - MITM attack simulation
  - WiFi security assessment

- **🔍 Vulnerability Scanning** (20 checks)
  - Port scan detection
  - Service vulnerability assessment
  - Configuration weaknesses
  - Patch level verification

## 🗺️ Network Discovery Engine

### Real-Time Network Mapping

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant G as Geolocation API
    participant M as Google Maps
    participant N as Network Scanner
    
    U->>B: Request Location Access
    B->>G: getCurrentPosition()
    G-->>B: Coordinates
    B->>M: Load Map with Location
    B->>N: Start Network Scan
    N-->>B: Network Nodes
    B->>M: Display Network Markers
    M-->>U: Interactive Network Map
```

### Features

- **📍 Precise Geolocation** - Real GPS coordinates, not simulated
- **🗺️ Google Maps Integration** - Professional-grade mapping
- **📡 Network Discovery** - WiFi, cellular, and vulnerability detection
- **🎯 Threat Classification** - Automatic risk assessment
- **🔍 Interactive Exploration** - Click markers for detailed information

## 🤖 AI-Powered Security Insights

### Intelligent Remediation

```mermaid
flowchart LR
    A[Security Check] --> B[Vulnerability Detected]
    B --> C[Send to Gemini AI]
    C --> D[Generate Remediation Plan]
    D --> E[Provide Step-by-Step Guide]
    E --> F[Verification Instructions]
    
    style A fill:#e1f5fe
    style B fill:#ffebee
    style C fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
    style F fill:#e0f2f1
```

### AI Capabilities

- **🔍 Threat Analysis** - Deep understanding of security implications
- **📋 Remediation Plans** - Step-by-step fix instructions
- **✅ Verification Guides** - How to confirm fixes worked
- **🎯 Risk Prioritization** - Focus on critical vulnerabilities first
- **📚 Educational Content** - Learn while you secure

## 🤖 Automated Code Review & Merge

### GitHub Copilot Integration

```mermaid
flowchart TD
    A[Pull Request Created] --> B[Auto-Review Triggered]
    B --> C[Code Quality Analysis]
    B --> D[Security Scanning]
    B --> E[TypeScript Check]
    C --> F{Quality Score ≥ 85?}
    D --> G{Security Issues?}
    E --> H{Type Errors?}
    F --> I[Auto-Approve]
    G --> J[Block/Review Required]
    H --> K[Build Failed]
    I --> L{Score ≥ 90 & auto-merge label?}
    L --> M[Auto-Merge Enabled]
    L --> N[Manual Merge Required]
    
    style A fill:#e1f5fe
    style I fill:#e8f5e8
    style M fill:#e8f5e8
    style J fill:#ffebee
    style K fill:#ffebee
```

### Automated Workflow Features

- **🔍 Intelligent Code Review** - AI-powered analysis of code changes
- **📊 Quality Scoring** - Automated assessment of code quality (0-100)
- **🛡️ Security Scanning** - Vulnerability detection and blocking
- **✅ Auto-Approval** - High-quality PRs get automatic approval
- **🔀 Smart Auto-Merge** - Safe automatic merging with safeguards
- **🏷️ Dynamic Labeling** - Automatic label application based on analysis
- **🤖 Dependabot Integration** - Streamlined dependency updates

### Auto-Merge Criteria

#### Required Conditions (ALL must be met):
- ✅ Code quality score ≥ 90/100
- ✅ No security vulnerabilities detected
- ✅ All CI checks passing
- ✅ PR has `auto-merge` label
- ✅ At least one approval (auto or manual)
- ✅ No merge conflicts

#### Quality Thresholds:
- **🟢 Excellent (90-100)**: Auto-merge eligible
- **🟡 Good (80-89)**: Auto-approve, manual merge
- **🟠 Fair (60-79)**: Review required
- **🔴 Poor (0-59)**: Blocked until fixed

### Usage Instructions

#### For Contributors:
1. Create your PR as usual
2. Wait for automated review (< 5 minutes)
3. Address any issues highlighted by the AI
4. Add `auto-merge` label for automatic merging (if score ≥ 90)

#### For Maintainers:
- Use `do-not-merge` label to prevent auto-merge
- Manual review always overrides automation
- Configure thresholds in `.github/auto-review-config.json`

### 🎭 Try the Demo
```bash
# See the auto-review system in action
./demo-auto-review.sh
```

### 📚 Learn More
- [📖 Complete Usage Guide](.github/AUTO_REVIEW_GUIDE.md)
- [⚙️ Configuration Options](.github/AUTO_REVIEW_CONFIG.md)
- [🧪 Test the System](./test-auto-review.sh)

## ⚔️ PvP Battle System

### Combat Mechanics

```mermaid
stateDiagram-v2
    [*] --> Lobby
    Lobby --> Matchmaking : Find Opponent
    Matchmaking --> Battle : Match Found
    Battle --> TurnPhase : Initialize
    TurnPhase --> AttackPhase : Select Action
    AttackPhase --> DefensePhase : Execute Attack
    DefensePhase --> TurnPhase : Calculate Damage
    TurnPhase --> Victory : System Compromised
    TurnPhase --> Defeat : System Defended
    Victory --> [*]
    Defeat --> [*]
```

### Battle Features

- **⚡ Real-time Combat** - Turn-based tactical warfare
- **🎭 Role-based Actions** - Unique abilities for Hackers vs Defenders
- **🏆 Skill-based Matching** - Fair and competitive gameplay
- **📊 Detailed Analytics** - Learn from each battle
- **🎖️ Achievement System** - Unlock new capabilities

## 📊 Data Flow & Security

### Data Architecture

```mermaid
graph LR
    subgraph "Client Side"
        A[User Interface]
        B[Local Storage]
        C[Security Engine]
    end
    
    subgraph "External APIs"
        D[Google APIs]
        E[Geolocation]
    end
    
    subgraph "Data Processing"
        F[Encryption Layer]
        G[Privacy Filter]
        H[Local Analysis]
    end
    
    A --> B
    A --> C
    C --> H
    H --> G
    G --> F
    F --> D
    E --> F
    
    style F fill:#ff6b6b,stroke:#ff5252,color:#fff
    style G fill:#4ecdc4,stroke:#26a69a,color:#fff
```

### Privacy & Security

- **🔒 Local-First Processing** - Data never leaves your device unnecessarily
- **🛡️ End-to-End Encryption** - All API communications secured
- **🚫 No Telemetry** - Zero tracking or analytics collection
- **🎯 Minimal Permissions** - Only request what's absolutely needed
- **🧹 Auto-Cleanup** - Temporary data automatically purged

## 🎮 User Roles & Progression

### Role Selection

```mermaid
journey
    title User Journey - Role Selection
    section Onboarding
      Create Profile: 5: User
      Choose Role: 5: User
      Complete Tutorial: 4: User
    section Hacker Path
      Learn Exploits: 5: Hacker
      Practice Attacks: 4: Hacker
      PvP Battles: 5: Hacker
      Leaderboard Climb: 5: Hacker
    section Defender Path
      Security Hardening: 5: Defender
      Threat Detection: 4: Defender
      System Defense: 5: Defender
      Network Protection: 5: Defender
```

### Progression System

| Level | XP Required | Unlocks |
|-------|-------------|---------|
| 1-5 | 0-1000 | Basic scans, tutorial content |
| 6-10 | 1000-5000 | Advanced scans, PvP access |
| 11-15 | 5000-15000 | Expert tools, team features |
| 16-20 | 15000-50000 | Master techniques, mentoring |
| 21+ | 50000+ | Legendary status, custom content |

## 🛠️ Development

### Project Structure

```
cybersphere/
├── components/           # React components
│   ├── AttackLab.tsx    # Security testing interface
│   ├── Map.tsx          # Network discovery map
│   ├── AIHub.tsx        # AI interaction panel
│   ├── PvpBattle.tsx    # Combat interface
│   └── ...
├── services/            # API integrations
│   ├── geminiService.ts # AI service
│   └── pvpService.ts    # Battle logic
├── types.ts             # TypeScript definitions
├── constants.ts         # Configuration
└── hooks/               # Custom React hooks
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview build
npm run typecheck       # Type checking
npm run lint            # Code linting

# Testing
npm run test            # Run tests
npm run test:coverage   # Coverage report
npm run test:e2e        # End-to-end tests
```

### Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19 | UI framework |
| **Language** | TypeScript 5.8 | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Build** | Vite | Fast development |
| **Maps** | Google Maps API | Network visualization |
| **AI** | Google Gemini | Security insights |
| **Diagrams** | Mermaid | Architecture visualization |

## 🌐 Deployment Options

### GitHub Pages (Recommended)

```bash
# Automatic deployment via GitHub Actions
git push origin main
```

### Manual Deployment

```bash
# Build and deploy to any static host
npm run build
# Upload dist/ folder to your hosting provider
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment-Specific Configurations

| Environment | Configuration | Features |
|-------------|---------------|----------|
| **Development** | Full debug, hot reload | All features enabled |
| **Staging** | Production build, test APIs | Feature flags |
| **Production** | Optimized, real APIs | Full functionality |

## 📈 Performance Metrics

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Analysis

```bash
npm run build:analyze   # View bundle composition
```

### Performance Optimizations

- **🚀 Code Splitting** - Lazy load components
- **📦 Tree Shaking** - Remove unused code
- **🗜️ Asset Optimization** - Compressed images and fonts
- **⚡ Caching** - Service worker implementation
- **📱 Mobile First** - Responsive design

## 🔒 Security Considerations

### Application Security

- **🛡️ Input Validation** - All user inputs sanitized
- **🔐 API Security** - Keys stored securely
- **🚫 XSS Prevention** - Content Security Policy
- **🔒 HTTPS Only** - Secure communications
- **🧹 Dependency Updates** - Regular security patches

### Privacy Protection

- **📍 Location Data** - Used only for mapping, never stored
- **🎤 Media Access** - Explicit permission required
- **🔍 Scan Results** - Processed locally only
- **👤 User Data** - Minimal collection, no tracking

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- **TypeScript** - Strict type checking
- **ESLint** - Code quality enforcement
- **Prettier** - Consistent formatting
- **Testing** - Unit and integration tests
- **Documentation** - Inline comments and README updates

## 📚 Documentation

### API Reference

- [Component API](docs/components.md)
- [Service Layer](docs/services.md)
- [Type Definitions](docs/types.md)
- [Configuration](docs/configuration.md)

### Guides

- [Setting Up Development Environment](docs/development.md)
- [Deploying to Production](docs/deployment.md)
- [Customizing Security Checks](docs/customization.md)
- [Adding New Features](docs/features.md)

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Map not loading | Missing API key | Add `GOOGLE_MAPS_API_KEY` |
| AI features disabled | Missing Gemini key | Add `GEMINI_API_KEY` |
| Location access denied | Browser permissions | Enable in browser settings |
| Build failures | Node version | Use Node.js 18+ |

### Debug Mode

```bash
npm run dev:debug   # Enable debug logging
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google** - For providing excellent APIs
- **React Team** - For the amazing framework
- **Tailwind CSS** - For utility-first CSS
- **Vite** - For lightning-fast development
- **Open Source Community** - For inspiration and support

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Tim-Spurlin/CyberSphere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Tim-Spurlin/CyberSphere/discussions)
- **Email**: [tim.spurlin@saphyresolutions.com](mailto:tim.spurlin@saphyresolutions.com)

---

<div align="center">

**Made with ❤️ by the CyberSphere Team**

[⭐ Star this repo](https://github.com/Tim-Spurlin/CyberSphere) • [🐛 Report Bug](https://github.com/Tim-Spurlin/CyberSphere/issues) • [💡 Request Feature](https://github.com/Tim-Spurlin/CyberSphere/issues)

</div>

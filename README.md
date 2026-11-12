# 🚀 Smart Job Application Tracker

> A modern, responsive Full-Stack Web Application for job seekers and developers to track applications, practice interview prep, calculate Indian in-hand salaries, and discover 100% real-time hiring alerts across all domains.

Built with **React.js 18 + Spring Boot 3 + MySQL 8** | Pure JdbcTemplate (NO Hibernate) | JWT Auth

---

## ✨ Features

- 🟢 **Live Tech Hiring Radar & Job Feed** — Fetches 100% real-time active tech openings via public job APIs (Remotive API) and verified campus/MNC off-campus drives (TCS, Zoho, Infosys, Cognizant, AWS, Razorpay, CRED).
- 🏷️ **Multi-Domain Filters with Live Counters** — Filter openings across 8 domains:
  - Java & Backend
  - React & Frontend
  - Full Stack
  - Python & AI / Data
  - Cloud & DevOps
  - Mobile (Android/iOS/Flutter)
  - QA & Automation Testing
  - Cybersecurity & Network
- 🇮🇳 **Automatic Rupee (₹ LPA) Salary Conversion** — Automatically converts USD/foreign/hourly salaries into Indian Rupees in Lakhs Per Annum (e.g. `$55,000 - $95,000` ➔ `₹46.8 - 80.8 LPA`).
- ⚡ **1-Click Track into MySQL & Kanban** — Instantly import any live opening or drive into your MySQL database with status `APPLIED` and view it on your Kanban board.
- 📋 **Interactive Kanban Board & List Views** — Toggle between Kanban pipeline columns and table view with CSV export and quick status updates.
- 📱 **Full Responsive Web Design** — Mobile off-canvas drawer navigation (`☰`), touch-swipe Kanban columns, and adaptive fluid grids across all screens.
- 🌓 **Glowing Dark & Light Mode** — Theme switcher with high-contrast typography, custom glows, and zero visibility conflicts.
- 🧮 **Offer Calculator & CTC Comparator** — Calculates monthly in-hand salary under the New Indian Tax Regime (PF, HRA, Standard Deduction) and compares two competing offers side-by-side.
- 🎯 **ATS Resume Scanner & Interview Prep** — Analyzes job description keywords against your skills profile and includes domain-specific interview prep checklists.
- 🔐 **JWT Authentication & Data Isolation** — Secure login, registration, and BCrypt encrypted passwords.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, React Hot Toast |
| **Icons & Charts** | React Icons (`react-icons/fa`, `react-icons/md`), Recharts |
| **Backend** | Spring Boot 3.2.4, Spring Security 6 |
| **Data Access** | Spring Boot `JdbcTemplate` (Manual SQL queries — **NO Hibernate / JPA**) |
| **Database** | MySQL 8.0 (`job_tracker_db`, utf8mb4) |
| **Security** | Stateless JWT (jjwt 0.12.3) + BCrypt password hashing |
| **Build & Run** | Maven (`mvnw.cmd`) + Vite + 1-Click `run-app.bat` |

---

## 📁 Project Architecture

```
smart-job-tracker/
├── backend/
│   ├── src/main/java/com/jobtracker/app/
│   │   ├── config/          # Spring Security, CORS & JWT filter config
│   │   ├── controller/      # Auth, Application, Dashboard, Interview REST endpoints
│   │   ├── dto/             # Request & Response POJOs
│   │   ├── entity/          # Plain Java objects (User, JobApplication, Interview)
│   │   ├── repository/      # Hand-crafted SQL with JdbcTemplate & RowMappers
│   │   └── service/         # Business logic & password verification
│   ├── src/main/resources/
│   │   ├── application.properties  # Localhost MySQL configuration
│   │   └── schema.sql              # Auto-initialized table schemas
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout (Navbar, Sidebar), Modals, Badges
│   │   ├── context/         # AuthContext & ThemeContext (Dark/Light)
│   │   ├── pages/           # Dashboard, JobNews, Applications, Offers, Profile
│   │   ├── services/        # Axios API clients & Real-time JobNewsService
│   │   ├── styles/          # Responsive Global CSS & Dark Mode theme
│   │   └── utils/           # Currency converter (₹), Date formatters
│   └── package.json
└── run-app.bat              # 1-Click Windows launcher for Backend + Frontend
```

---

## ⚙️ How to Run Locally

### Prerequisites
- Java 17+ (JDK)
- Node.js 18+
- MySQL 8.0 running on `localhost:3306` (with password `0000` or updated in `application.properties`)

### Option A: 1-Click Launch (Windows)
Double-click `run-app.bat` in the project root:
```powershell
.\run-app.bat
```
This automatically starts:
1. Spring Boot Backend on `http://localhost:8080`
2. React Vite Frontend on `http://localhost:5173`
3. Launches your default browser directly to `http://localhost:5173`

---

### Option B: Manual Terminal Launch

#### 1. Start the Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

#### 3. Open in Browser
Visit **http://localhost:5173**

**Default Demo Credentials:**
- **Email:** `naveenpalanisamy052@gmail.com`
- **Password:** `123456`
*(Or click "Create one free" to register a new user)*

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login and obtain JWT token |
| `GET` | `/api/dashboard/stats` | Dashboard metrics & monthly statistics |
| `GET` | `/api/applications` | List user job applications (with search & filter) |
| `POST` | `/api/applications` | Create a new job application |
| `PATCH` | `/api/applications/{id}/status` | Quick update status for Kanban drag/drop |
| `GET` | `/api/interviews` | List scheduled interviews |
| `POST` | `/api/interviews` | Schedule new interview round |

---

## 📄 License
MIT License. Open source and free for developers and job seekers!

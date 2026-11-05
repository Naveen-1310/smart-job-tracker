# Smart Job Application Tracker

> A professional Full Stack Web Application for freshers and job seekers to manage their job search journey.

Built with **React.js + Spring Boot + MySQL** | JWT Auth | REST API

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login, registration, BCrypt passwords
- 📊 **Dashboard** — Stat cards, pie chart, bar chart, recent apps, upcoming interviews
- 💼 **Job Application CRUD** — Add, view, edit, delete applications
- 🔍 **Search & Filter** — By company, role, or status
- 📅 **Interview Management** — Schedule rounds, add meeting links, track status
- 👤 **User Profile** — Update info, change password
- 🛡️ **Data Isolation** — Each user sees only their own data

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Vite, React Router DOM v6 |
| State | React Context API |
| UI | Custom CSS + Bootstrap 5 + react-icons |
| Charts | Recharts |
| HTTP | Axios |
| Backend | Spring Boot 3.2, Spring Security 6 |
| Auth | JWT (jjwt 0.12.3), BCrypt |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8 |
| Build | Maven |

---

## 📁 Project Structure

```
smart-job-tracker/
├── backend/          ← Spring Boot Maven project
│   └── pom.xml
└── frontend/         ← React.js Vite project
    └── package.json
```

---

## ⚙️ Local Setup — Step by Step

### Prerequisites
- ☑️ Java 17+ (JDK)
- ☑️ Node.js 18+
- ☑️ MySQL 8
- ☑️ Maven 3.8+
- ☑️ IntelliJ IDEA or VS Code

---

### Step 1: Set Up MySQL Database

Open MySQL Workbench or terminal and run:

```sql
CREATE DATABASE job_tracker_db;
```

That's it! Hibernate will auto-create the tables when you run the backend.

---

### Step 2: Configure Backend

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/job_tracker_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

---

### Step 3: Run the Backend

```bash
cd smart-job-tracker/backend
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

You should see:
```
Tomcat started on port 8080
Started JobTrackerApplication
```

---

### Step 4: Install Frontend Dependencies

```bash
cd smart-job-tracker/frontend
npm install
```

---

### Step 5: Run the Frontend

```bash
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

### Step 6: Open the App

Go to: **http://localhost:5173**

1. Click **Create one free** to register
2. Login with your credentials
3. Start adding job applications!

---

## 🔌 API Reference (Postman Testing)

### Base URL
```
http://localhost:8080/api
```

### 1. Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "Naveen Kumar",
  "email": "naveen@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "naveen@example.com",
  "password": "password123"
}

→ Response: { "token": "eyJ...", "name": "Naveen Kumar", ... }
```

### 3. Add Application (with Bearer Token)
```
POST /api/applications
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "companyName": "Google",
  "jobRole": "Software Engineer",
  "jobLocation": "Bangalore",
  "jobType": "FULL_TIME",
  "applicationDate": "2024-11-01",
  "status": "APPLIED"
}
```

### 4. Get All Applications
```
GET /api/applications
Authorization: Bearer <token>

// With search:
GET /api/applications?keyword=google
GET /api/applications?status=APPLIED
```

### 5. Dashboard Stats
```
GET /api/dashboard/stats
Authorization: Bearer <token>
```

### 6. Schedule Interview
```
POST /api/interviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobApplicationId": 1,
  "interviewDate": "2024-11-15T10:30:00",
  "round": "Round 1 - Technical",
  "interviewType": "ONLINE",
  "meetingLink": "https://meet.google.com/abc-xyz",
  "status": "SCHEDULED"
}
```

---

## 🗄️ Database Tables (Auto-Created by Hibernate)

```sql
-- Verify tables were created
USE job_tracker_db;
SHOW TABLES;

-- Sample queries
SELECT * FROM users;
SELECT * FROM job_applications;
SELECT * FROM interviews;
```

---

## 📸 Application Pages

| Page | Route |
|------|-------|
| Login | /login |
| Register | /register |
| Dashboard | /dashboard |
| Applications List | /applications |
| Add Application | /applications/new |
| Edit Application | /applications/:id/edit |
| Application Detail | /applications/:id |
| Interviews | /interviews |
| Profile | /profile |

---

## 🚀 Deployment (Optional)

### Backend → Render.com (Free)
1. Create a `Procfile` with: `web: java -jar target/smart-job-tracker-1.0.0.jar`
2. Set environment variables for DB_URL, DB_USER, DB_PASSWORD
3. Connect GitHub → Render → auto-deploy

### Frontend → Netlify / Vercel (Free)
1. Update `vite.config.js` proxy target to your deployed backend URL
2. Run `npm run build` → upload `dist/` folder
3. Or connect GitHub for auto-deploy

### Database → Railway.app / PlanetScale (Free tiers)
- Create a MySQL database → copy the connection string

---

## 🎯 Key Concepts to Explain in Interview

| Concept | Where Used |
|---------|-----------|
| JWT Authentication | JwtUtil, JwtAuthFilter, SecurityConfig |
| BCrypt Password Hashing | AuthService, SecurityConfig |
| Spring Security Filter Chain | SecurityConfig |
| JPA Entity Relationships | @OneToMany, @ManyToOne in entities |
| DTO Pattern | dto/request and dto/response packages |
| Service Layer Pattern | All *Service.java classes |
| Global Exception Handling | GlobalExceptionHandler.java |
| React Context API | AuthContext.jsx |
| Axios Interceptors | services/api.js |
| Protected Routes | ProtectedRoute.jsx |

---

## 👨‍💻 Author

Built for fresher Java Full Stack Developer portfolio.

Technology: React.js + Spring Boot + MySQL + JWT

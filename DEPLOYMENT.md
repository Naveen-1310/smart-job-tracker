# 🚀 Free Full-Stack Deployment Guide (100% Free)

Deploy your **Smart Job Application Tracker** (Spring Boot + MySQL + React) so recruiters and visitors can use it live on the web.

---

## 🏗️ Architecture Overview

| Component | Free Cloud Provider | Purpose |
| :--- | :--- | :--- |
| **Database** | **Aiven.io** or **TiDB Cloud** | Free cloud-hosted MySQL 8.0 |
| **Backend** | **Render.com** | Free Spring Boot Web Service |
| **Frontend** | **Vercel** or **Render Static** | Free React + Vite Web Hosting with CDN |

---

## Step 1: Create a Free Cloud MySQL Database (2 mins)

1. Go to [Aiven.io](https://aiven.io/) or [TiDB Cloud](https://tidbcloud.com/) and sign up for a free account.
2. Create a new **MySQL** service (select the Free tier).
3. Copy your database connection details:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (e.g., `avnadmin`)
   - **Password**
   - **Database Name** (e.g., `defaultdb` or `job_tracker_db`)

Your JDBC URL will look like:
```
jdbc:mysql://<HOST>:<PORT>/<DATABASE_NAME>?useSSL=true&requireSSL=true
```

---

## Step 2: Deploy Spring Boot Backend on Render (3 mins)

1. Go to [Render.com](https://render.com/) and sign in with your GitHub account.
2. Click **New +** > **Web Service**.
3. Select your GitHub repository: `Naveen-1310/smart-job-tracker`.
4. Fill in the deployment settings:
   - **Name:** `smart-job-tracker-api`
   - **Region:** Singapore / Frankfurt / Oregon (nearest to you)
   - **Root Directory:** `backend`
   - **Runtime:** `Java` (or `Docker` using the included `backend/Dockerfile`)
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/smart-job-tracker-1.0.0.jar`
   - **Instance Type:** `Free`
5. Click **Advanced** > **Add Environment Variable**:
   | Key | Value |
   | :--- | :--- |
   | `SPRING_DATASOURCE_URL` | Your cloud MySQL JDBC URL from Step 1 |
   | `SPRING_DATASOURCE_USERNAME` | Your cloud MySQL username |
   | `SPRING_DATASOURCE_PASSWORD` | Your cloud MySQL password |
   | `APP_CORS_ALLOWED_ORIGINS` | `https://*.vercel.app,http://localhost:5173` |
6. Click **Create Web Service**.
   - Render will build your JAR and run `schema.sql` automatically on startup!
   - Copy your live backend URL (e.g., `https://smart-job-tracker-api.onrender.com`).

---

## Step 3: Deploy React Frontend on Vercel (2 mins)

1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** > **Project**.
3. Import `Naveen-1310/smart-job-tracker`.
4. Configure Project:
   - **Root Directory:** Click *Edit* and select `frontend`.
   - **Framework Preset:** `Vite` (auto-detected).
5. Expand **Environment Variables**:
   | Name | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://smart-job-tracker-api.onrender.com/api` *(Your Render URL from Step 2 with `/api`)* |
6. Click **Deploy**.
   - Within 30 seconds, your site will be live at `https://smart-job-tracker-xxxx.vercel.app`!

---

## Step 4: Add the Live Link to Your GitHub Repository

1. Open your repository on GitHub: `https://github.com/Naveen-1310/smart-job-tracker`
2. Click the ⚙️ icon next to **About** on the right side.
3. Paste your Vercel URL under **Website**: e.g. `https://smart-job-tracker.vercel.app`
4. Add topics: `java`, `spring-boot`, `react`, `mysql`, `job-tracker`, `kanban`
5. Click **Save changes**.

🎉 Anyone visiting your GitHub repo can now click your live link, register an account, and track job applications in real-time!

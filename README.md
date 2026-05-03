# ⚡ SmartGrid+ — AI Electricity Billing System

**AI-powered smart grid and electricity billing platform with real-time analytics and automation.**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=flat&logo=mysql&logoColor=white)

---

## 🌟 Overview

SmartGrid+ is a comprehensive full-stack platform designed to modernize electricity billing and grid management. By leveraging AI-driven forecasting and real-time data visualization, it empowers both utilities and consumers to optimize energy consumption and maintain grid stability.

### 🏆 Highlights

*   **Full-Stack Architecture**: Robust React frontend coupled with a high-performance Node.js backend.
*   **Real-Time Dashboard**: Live monitoring of energy flow and consumption metrics.
*   **AI Predictions**: Intelligent energy forecasting using historical usage patterns.
*   **Admin Control System**: Centralized "Command Center" for grid-wide oversight and management.

---

## 🚀 Key Features

*   **Usage Analytics**: High-fidelity charts and metrics for deep-dive historical analysis.
*   **Automated Billing**: Tax-calculated, transparent monthly invoice generation.
*   **Energy Asset Management**: Performance tracking for Solar panels and Battery storage.
*   **Automation Rules**: Smart, rule-based triggers for automated grid optimization.
*   **Security First**: JWT-protected sessions and environment-based configuration.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Vanilla CSS
*   **Backend**: Node.js, Express
*   **Database**: MySQL
*   **Authentication**: JSON Web Tokens (JWT)

---

## 🏗️ Architecture

The system is built on a modular three-tier architecture ensuring scalability and reliability:

**Frontend (React)** → **Backend API (Express)** → **MySQL Database**

---

## 📦 Key Modules

*   **Customer Management**: Account profiles, contact details, and status tracking.
*   **Meter Tracking**: Real-time smart meter data and geographical mapping.
*   **Billing & Payments**: Automated invoicing and secure transaction processing.
*   **AI Predictor**: Forecasting consumption trends for the next billing cycle.
*   **Automation Engine**: Dynamic rules for optimizing energy loads across the grid.

---

## ⚙️ Setup & Installation

### ⏱️ Quick Start
1.  **Clone** the repository.
2.  **Setup** the MySQL backend and `.env`.
3.  **Run** the frontend and backend servers.

---

### 📋 Detailed Instructions

#### 1. Clone the repository
```bash
git clone https://github.com/binayak-builds/SmartGrid-Plus.git
cd SmartGrid-Plus
```

#### 2. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    npm install
    ```
2.  Create a `.env` file and configure your credentials:
    ```env
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=smartgrid
    JWT_SECRET=your_jwt_secret
    ```
3.  Initialize the database using `init.sql`:
    ```bash
    mysql -u root -p < init.sql
    ```
4.  Start the server:
    ```bash
    npm start
    ```

#### 3. Frontend Setup
1.  Navigate back to the root directory:
    ```bash
    cd ..
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🔒 Security

*   **No Hardcoded Secrets**: All sensitive information is managed via environment variables.
*   **JWT Authentication**: Secure user sessions with standard industry practices.
*   **Transaction Integrity**: Database operations are atomic and secure.

---

## 🔮 Future Improvements

*   **IoT Integration**: Direct smart-meter hardware connectivity.
*   **Real-Time Bridge**: WebSockets for instant grid-to-dashboard notifications.
*   **Cloud Scaling**: Readiness for containerized deployment (Docker/AWS).
*   **Mobile Experience**: Progressive Web App (PWA) or native mobile support.

---

## 👨‍💻 Author

**Binayak Mondal**  
*Full Stack Developer & AI Enthusiast*

# SmartGrid+ — AI Electricity Billing System

SmartGrid+ is a comprehensive full-stack, AI-powered electricity billing and smart grid management system. It provides real-time monitoring, intelligent usage predictions, and automated grid management tools for both residential and commercial users.

---

## 🚀 Features

*   **Real-time Grid Monitoring**: Visualize live energy flow and consumption data.
*   **Usage Analytics Dashboard**: High-fidelity charts and metrics for historical analysis.
*   **Automated Billing System**: Tax-calculated, transparent billing generated monthly.
*   **AI-based Consumption Prediction**: Smart forecasting of future energy needs and costs.
*   **Payment Tracking & History**: Secure transaction logs and payment status tracking.
*   **Admin Command Center**: Centralized management of users, rates, and grid stability.
*   **Alerts & Automation Rules**: Automated responses to consumption spikes or grid conditions.
*   **Energy Asset Management**: Integrated tracking of Solar and Battery storage performance.

---

## 🛠️ Tech Stack

*   **Frontend**: React + Vite (Vanilla CSS for styling)
*   **Backend**: Node.js + Express
*   **Database**: MySQL

---

## 🏗️ Architecture

The system follows a standard client-server architecture:
`Frontend (React)` ↔ `Backend API (Express)` ↔ `Database (MySQL)`

Data flows via RESTful APIs, with the backend handling business logic, AI calculations, and database transactions.

---

## 📦 Key Modules

*   **Customer Management**: Profiles, contact details, and account status.
*   **Meter Tracking**: Real-time tracking of smart meter data and locations.
*   **Billing System**: Automated generation of bills based on dynamic tax rates.
*   **Payment Processing**: Management of transaction statuses and payment history.
*   **AI Predictions**: Trend analysis and forecasting using historical usage patterns.
*   **Automation Engine**: Configurable rules for automated grid optimization.

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/binayak-builds/SmartGrid-Plus.git
cd SmartGrid-Plus
```

### 2. Backend Setup
Navigate to the backend directory and create a `.env` file:
```bash
cd backend
npm install
```
Add the following to your `.env`:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=smartgrid
JWT_SECRET=your_jwt_secret
```
Initialize the database:
```bash
mysql -u root -p < init.sql
npm start
```

### 3. Frontend Setup
Navigate to the root directory:
```bash
cd ..
npm install
npm run dev
```

---

## 🔒 Security

*   **Environment Variables**: All sensitive keys (DB, JWT) are managed via `.env` files.
*   **Credential Safety**: No hardcoded credentials exist within the codebase.
*   **Authentication**: Secure user sessions are maintained using JSON Web Tokens (JWT).

---

## 🔮 Future Improvements

*   **IoT Integration**: Direct communication with hardware smart meters.
*   **WebSockets**: Real-time "Push" notifications for alerts and live grid updates.
*   **Cloud Deployment**: Scaling with AWS/Google Cloud.
*   **Mobile App**: Dedicated Android/iOS application for on-the-go monitoring.

---

## 👨‍💻 Author

**Binayak Mondal**  
*Full Stack Developer & AI Enthusiast*

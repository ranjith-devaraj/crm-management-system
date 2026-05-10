# 🚀 CRM Management System

A full-stack CRM (Customer Relationship Management) web application designed to manage customers, service requests, and client interactions efficiently.

---

## 📸 Preview

<img width="1448" height="1086" alt="Untitled design" src="https://github.com/user-attachments/assets/1442ce96-acb4-4d4d-85bb-06ed585c95b2" />



---

## 🧠 Features

### 🔐 Authentication & Roles
- Role-based login system
- Owner / Employee / Client access
- Secure session handling

### 👥 Customer Management
- Add new customers
- Edit & update details
- Delete customers
- Assign login credentials to clients

### 📩 Service Request System
- Clients can raise service requests
- Admin/Employee can:
  - ✅ Accept
  - ❌ Reject
- Status tracking (Pending / Approved / Completed)

### 📊 Dashboard Analytics
- Total Customers
- In Progress Projects
- Completed Projects
- Visual charts (Bar & Pie)

### 👤 Client Portal
- View approved projects
- Track request status
- Submit new service requests

---

## 🛠 Tech Stack

### Frontend
- ⚛️ React
- 🟦 TypeScript
- 🎨 Tailwind CSS
- 📊 Recharts

### Backend
- 🐘 PHP (REST API)

### Database
- 🐬 MySQL

---

## 📁 Project Structure
<img width="310" height="391" alt="image" src="https://github.com/user-attachments/assets/9b2f745e-fbea-4d31-a3d9-d00b604374d5" />


---

## ⚙️ Setup Instructions

### 🔽 1. Clone Repository

git clone https://github.com/ranjith-devaraj/crm-management-system.git


---

### 💻 2. Frontend Setup

cd frontend
npm install
npm run dev

Runs on:

http://localhost:5173


---

### 🖥️ 3. Backend Setup

- Place `backend/` folder inside:
  - XAMPP → `htdocs/`
- Start:
  - Apache ✅
  - MySQL ✅

---

### 🗄️ 4. Database Setup

Create database:
```sql
CREATE DATABASE crm;
---
Update DB config:

$conn = new mysqli("localhost", "root", "", "crm", 3306);

🔑### Default Login

<img width="775" height="198" alt="image" src="https://github.com/user-attachments/assets/33c03b03-ce66-49ef-90c9-56c70819faa6" />

### 📡 API Endpoints

<img width="754" height="292" alt="image" src="https://github.com/user-attachments/assets/7eb30d84-1c36-4821-8b80-0cc10d78fc08" />

### 💡 Future Improvements

🔐 JWT Authentication
📧 Email Notifications
📁 File Upload Support
☁️ Cloud Deployment (AWS / Vercel)
📱 Mobile Responsive Optimization

### 👨‍💻 Author

Ranjith Devaraj
🎓 B.Tech – AI & Data Science

⭐ Support

### If you like this project:

👉 Give it a ⭐ on GitHub
👉 Share on LinkedIn

🔗 GitHub Repository

https://github.com/ranjith-devaraj/crm-management-system


---

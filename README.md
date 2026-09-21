# 🔐 Cloud Digital Evidence Management System

A full-stack web-based **Digital Evidence Management System** designed to manage, upload, search, view, and delete digital evidence through a secure and user-friendly interface.

The application uses **React.js and Vite** for the frontend, **Node.js and Express.js** for the backend, and **Firebase Authentication** for user authentication.

## 📌 Project Description

The **Cloud Digital Evidence Management System** is a web application developed for managing digital evidence such as documents, images, videos, audio files, and other digital files.

The system provides an authenticated environment where users can upload and manage evidence, search for files, view evidence information, delete files, and monitor user activities through audit logs.

## 🎯 Objectives

- Provide a centralized system for digital evidence management
- Implement secure user authentication
- Allow users to upload digital evidence
- Provide evidence search and filtering
- Allow users to view and delete evidence
- Maintain activity logs
- Provide dashboard-based evidence statistics
- Develop a simple and user-friendly web interface
- Demonstrate full-stack and cloud-based application development

## ✨ Features

### 🔐 User Authentication

- User registration
- User login
- Firebase Email/Password Authentication
- User logout
- Authenticated application access

### 📊 Dashboard

The dashboard displays:

- Total Evidence
- Total Images
- Total Documents
- Total Videos
- Recent Evidence

### 📤 Upload Evidence

Users can upload digital evidence by providing:

- Evidence Title
- Evidence Description
- Evidence Type
- Evidence File

Supported evidence types:

- Image
- Document
- Video
- Audio
- Other

### 📁 Evidence Management

Users can:

- View uploaded evidence
- Check evidence type
- Check file size
- Check upload date and time
- Delete evidence

### 🔍 Search Evidence

The search module provides:

- Evidence name search
- Evidence type filtering
- Search result count
- View evidence
- Delete evidence

### 📋 Audit Logs

The application records activities such as:

- Evidence Viewed
- Evidence Uploaded
- Evidence Deleted
- User Logout

Audit information includes:

- User
- Action
- File name
- Date and time

### ⚙️ Settings

The Settings page displays:

- User Email
- Firebase User ID
- Application information
- Backend technology
- Authentication technology
- Database information
- Evidence storage information

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- Multer
- REST API

### Authentication

- Firebase Authentication
- Email and Password Authentication

### Database

- Firebase Firestore

### Evidence Storage

- Local file storage using Node.js backend

> **Note:** Firebase Authentication and Firestore are used in the application. Evidence files are currently stored locally in the backend `uploads` folder because Firebase Cloud Storage was not enabled.

## 🏗️ System Architecture

```text
                         ┌───────────────────┐
                         │       User        │
                         └─────────┬─────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   React + Vite Frontend  │
                    │       Port: 5173         │
                    └────────────┬─────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
        ┌───────────────────┐       ┌────────────────────┐
        │ Firebase          │       │ Node.js + Express  │
        │ Authentication    │       │ Backend API        │
        └───────────────────┘       │ Port: 5000         │
                                    └─────────┬──────────┘
                                              │
                                              ▼
                                    ┌────────────────────┐
                                    │ Local Evidence     │
                                    │ Storage / uploads  │
                                    └────────────────────┘
```

## 📂 Project Structure

```text
Cloud-Digital-Evidence/
│
├── backend/
│   ├── uploads/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── UploadEvidence.jsx
│   │   ├── firebase.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│   ├── 01-login.png
│   ├── 02-dashboard.png
│   ├── 03-evidence.png
│   ├── 04-search.png
│   ├── 05-audit-logs.png
│   └── 06-settings.png
│
├── test-evidence.txt
└── README.md
```

## 🚀 How to Run the Project

### 1. Start the Backend

Open PowerShell:

```powershell
cd D:\Cloud-Digital-Evidence\backend
node server.js
```

Backend runs at:

```text
http://localhost:5000
```

Expected output:

```text
Backend server running on http://localhost:5000
```

Keep this terminal open.

### 2. Start the Frontend

Open a second PowerShell window:

```powershell
cd D:\Cloud-Digital-Evidence\frontend
npm.cmd run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open the URL in your browser.

## 🔑 Application Workflow

```text
User
  ↓
Login / Register
  ↓
Dashboard
  ↓
Upload Evidence
  ↓
Node.js + Express API
  ↓
Local Evidence Storage
  ↓
Evidence Management
  ↓
Search / View / Delete
  ↓
Audit Logs
```

## 🔌 Backend API Endpoints

### Health Check

```http
GET /
```

### Get All Evidence

```http
GET /api/evidence
```

### Upload Evidence

```http
POST /api/evidence/upload
```

### View Evidence

```http
GET /api/evidence/file/:filename
```

### Delete Evidence

```http
DELETE /api/evidence/:filename
```

## 📸 Screenshots

### 🔐 Login Page

The login page allows users to securely access the application using Firebase Authentication.

![Login](screenshots/01-login.png)

### 📊 Dashboard

The dashboard provides an overview of the available digital evidence and displays evidence statistics.

![Dashboard](screenshots/02-dashboard.png)

### 📁 Evidence Management

The Evidence Management page allows users to view uploaded files, check file information, and delete evidence.

![Evidence Management](screenshots/03-evidence.png)

### 🔍 Search Evidence

The Search Evidence page allows users to search for evidence and filter files by type.

![Search Evidence](screenshots/04-search.png)

### 📋 Audit Logs

The Audit Logs page displays evidence-related activities performed during the application session.

![Audit Logs](screenshots/05-audit-logs.png)

### ⚙️ Settings

The Settings page displays account and application information.

![Settings](screenshots/06-settings.png)

## 🔒 Security Features

- Firebase Email/Password Authentication
- Authenticated application access
- File upload size limitation
- Safe filename handling
- Backend API separation
- User activity logging

## 📈 Future Enhancements

- ☁️ Firebase Cloud Storage
- 🔐 Role-Based Access Control
- 👮 Admin Dashboard
- 🧾 Permanent Audit Log Storage
- 🔍 Advanced Evidence Metadata Search
- 📄 Evidence Report Generation
- 🔗 Evidence Hash Generation
- 🛡️ Digital Evidence Integrity Verification
- 📦 Chain-of-Custody Tracking
- 🌐 Cloud Deployment
- 📱 Mobile Responsive Improvements

## 🎓 Project Information

**Project Title:** Cloud Digital Evidence Management System

**Project Type:** Full-Stack Web Application

**Domain:** Cloud Computing + Digital Forensics + Web Development

**Frontend:** React.js + Vite

**Backend:** Node.js + Express.js

**Authentication:** Firebase Authentication

**Database:** Firebase Firestore

**Evidence Storage:** Local Backend Storage

## 👩‍💻 Developed By

**Reshmitha Kukati**

GitHub: https://github.com/kukatireshmitha986-create

## 🏷️ GitHub Topics

cloud-computing, digital-forensics, digital-evidence, evidence-management, react, reactjs, vite, javascript, nodejs, expressjs, firebase, firebase-authentication, firestore, rest-api, full-stack, web-application, cybersecurity

## 📄 License

This project is developed for educational and academic purposes.

# 📝 Notes App

A modern full-stack Notes Management application built with **Next.js**,
**NestJS**, and **PostgreSQL**. The application provides secure user
authentication, personal note management, rich-text editing, categories,
tags, search/filtering, logging, testing, and SonarQube code-quality
analysis.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- Secure password handling
- JWT-based authentication
- Protected routes and APIs
- User-specific notes
- Logout functionality

### 📝 Notes Management

Users can: - Create, edit, and delete notes - Write notes using a
rich-text editor - Add categories and multiple tags - Mark notes as
**Favorite** - **Pin notes to the top** - **Archive / unarchive**
notes - Search and filter notes

### 📊 Dashboard

The dashboard provides a modern overview of the user's notes,
including: - Total notes - Favorite notes - Pinned notes - Archived
notes - Category-based organization - Search and filtering - Note
cards/list with important note information - Dashboard statistics and
charts for a quick visual overview

### 🎨 Modern Frontend UI

The frontend is built with **Next.js and React** with a responsive,
clean, and modern interface.

Main screens: - Login - Sign Up - Dashboard - Note Editor - User Profile

The Note Editor includes: - Title - Rich-text content - Category
selector - Tag management - Pin-to-top toggle - Favorite toggle - Save /
Cancel actions

The UI is designed to work across desktop and smaller screen sizes.

---

## 🏗️ Architecture

```text
Next.js / React
      │
      │ REST API
      ▼
   NestJS
      │
      ├── Auth & Users
      ├── Notes
      ├── Validation
      ├── Exception Handling
      └── Pino Logging
      │
      ▼
 PostgreSQL
```

---

## 🧰 Technology Stack

Area Technology

---

Frontend Next.js, React, TypeScript
Backend NestJS, Node.js, TypeScript
Database PostgreSQL
ORM TypeORM
Authentication JWT
Logging Pino Logger
Backend Testing Mocha / Chai
Frontend Testing Jest
Code Quality SonarQube
Version Control Git

---

## 🗄️ Database

The main entities are:

### User

Stores user account information and owns the user's notes.

### Note

Stores:

```text
id
title
content
category
tags
favorite
pinned
archived
user
createdAt
updatedAt
```

Relationship:

```text
User 1 ──────────── N Notes
```

Each note belongs to one user, ensuring private user-specific data.

---

## 🔐 Authentication Flow

```text
Register / Login
       ↓
 Validate credentials
       ↓
 Generate JWT
       ↓
 Authenticated user
       ↓
 Access protected APIs
```

All note operations are associated with the authenticated user's ID.

---

## 🌐 Main API Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/profile
```

### Notes

```http
POST   /notes
GET    /notes
GET    /notes/:id
PATCH  /notes/:id
DELETE /notes/:id
```

Additional note actions can include:

```http
PATCH /notes/:id/archive
PATCH /notes/:id/favorite
PATCH /notes/:id/pin
```

---

## 📋 Validation & Exception Handling

The backend uses DTO validation and centralized exception handling.

It handles common errors such as:

- Invalid input
- Unauthorized requests
- Forbidden access
- Missing notes
- Duplicate users
- Unexpected server errors

Errors are returned with meaningful HTTP status codes and messages.

---

## 📊 Pino Logging

**Pino Logger** is used for structured application logging.

Important events include:

- HTTP requests/responses
- User registration and login
- Authentication failures
- Note creation/update/deletion
- Note state changes
- Application exceptions

Sensitive information such as passwords and secrets should never be
logged.

---

## 🧪 Testing

Testing is included for important application functionality.

### Backend

**Jest**

Tests can cover: - Authentication - User services - Note CRUD -
Authorization - Ownership checks - Error handling

### Frontend

**Jest**

Tests can cover: - Login/register forms - Dashboard - Note editor - Note
actions - Form validation

---

## 🔍 SonarQube

The project is analyzed using **SonarQube** for code quality and
maintainability.

The captured SonarQube report shows:

```text
Quality Gate:     PASSED
Security:         A
Reliability:      A
Maintainability:  A
Open Issues:      0
Duplications:     1.5%
Coverage:         0.0%
Lines of Code:    ~8.6k
```

SonarQube helps identify:

- Bugs
- Vulnerabilities
- Code smells
- Maintainability issues
- Code duplication
- Test coverage

> The Quality Gate passed in the captured report, while the reported
> test coverage was 0.0%. Coverage reporting can be improved by
> configuring the test coverage report for SonarQube.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd notes-app
```

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. PostgreSQL

Create a PostgreSQL database and configure the backend environment
variables.

Example:

```env
PORT=3001

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=notes_app

JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📁 Project Structure

```text
notes-app/
├── frontend/          # Next.js application
│
├── backend/           # NestJS application
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── notes/
│       ├── common/
│       └── logger/
│
├── sonar-project.properties
├── .gitignore
└── README.md
```

---

## 🎯 Project Requirements

The application covers the main requirements:

- ✅ Next.js frontend
- ✅ NestJS backend
- ✅ PostgreSQL database
- ✅ Authentication & authorization
- ✅ Notes CRUD
- ✅ Rich-text editing
- ✅ Categories & tags
- ✅ Favorite, pin, and archive
- ✅ Pino logging
- ✅ Exception handling
- ✅ Jest testing
- ✅ SonarQube integration
- ✅ Git version control

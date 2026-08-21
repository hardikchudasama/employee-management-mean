# Employee Management System

A full-stack Employee Management System built with **Angular, Node.js, Express.js, and MongoDB**.

The application provides employee management, JWT authentication, role-based authorization, search, filtering, sorting, server-side pagination, and a dashboard with employee statistics and charts.

---

## 🚀 Features

### 🔐 Authentication

* User registration
* User login and logout
* JWT access token authentication
* Refresh token authentication
* Refresh token stored in an HTTP-only cookie
* Refresh token hashed before being stored in MongoDB
* Refresh token rotation
* Automatic access-token refresh
* Protected Angular routes
* Authentication HTTP interceptor
* Global HTTP error interceptor
* Account status validation

### 👥 Role-Based Authorization

The application supports:

* **Admin**
* **User**

Authorization is handled on the backend, while the Angular application protects routes and handles unauthorized API responses.

### 👨‍💼 Employee Management

* Create employees
* View employees
* Update employees
* Delete employees
* Search employees
* Search with RxJS debounce
* Filter by department
* Filter by status
* Sort employee records
* Server-side pagination
* Reactive Forms
* Frontend validation
* Backend validation
* Delete confirmation dialog

### 📊 Dashboard

The dashboard provides an overview of the employee management system.

* Total employees
* Active employees
* Inactive employees
* Total departments
* Employees by department
* Employee status chart
* Recent employees
* Loading state
* Error handling
* Retry functionality

### 🎨 UI & User Experience

* PrimeNG components
* Responsive layout
* Responsive employee table
* Toast notifications
* Confirmation dialogs
* Loading indicators
* Empty states
* Form validation

---

## 🛠️ Tech Stack

### Frontend

* Angular 20
* TypeScript
* RxJS
* PrimeNG
* Chart.js
* HTML5
* SCSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token
* bcryptjs
* cookie-parser
* CORS

### Tools

* Git
* GitHub
* Visual Studio Code
* Thunder Client
* MongoDB Atlas

---

## 🏗️ Application Architecture

```text
Employee Management System
│
├── Angular Frontend
│   ├── Components
│   ├── Services
│   ├── Guards
│   ├── HTTP Interceptors
│   ├── Reactive Forms
│   └── PrimeNG UI
│
├── Node.js / Express Backend
│   ├── Routes
│   ├── Controllers
│   ├── Models
│   ├── Middleware
│   └── Authentication
│
└── MongoDB
    ├── Users
    └── Employees
```

The Angular frontend communicates with the Node.js/Express backend through REST APIs.

---

## 🔐 Authentication Flow

The application uses an access-token and refresh-token authentication architecture.

```text
User
 │
 │ Login
 ▼
Angular Application
 │
 │ POST /api/auth/login
 ▼
Express.js Backend
 │
 │ Validate credentials
 ▼
MongoDB
 │
 │
 ▼
Access Token + Refresh Token
 │
 ├── Access Token → Angular Application
 │
 └── Refresh Token → HTTP-only Cookie
```

### Access Token

The access token contains:

* User ID
* User role

It is used to authorize API requests.

### Refresh Token

The refresh token:

* Is stored in an HTTP-only cookie
* Is not returned in the login response body
* Is hashed before being stored in MongoDB
* Is rotated when a new access token is generated
* Is removed from the database during logout

### Token Refresh

When the access token expires:

```text
API Request
    │
    ▼
401 Unauthorized
    │
    ▼
Refresh Token Request
    │
    ▼
New Access Token
    │
    ▼
Retry Original Request
```

---

## 🔑 Authentication API

The authentication endpoints are:

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register a new user         |
| POST   | `/api/auth/login`    | Login user                  |
| POST   | `/api/auth/refresh`  | Generate a new access token |
| POST   | `/api/auth/logout`   | Logout user                 |

---

## 👥 Role-Based Authorization

The application supports two roles:

| Role  | Description                          |
| ----- | ------------------------------------ |
| Admin | Full employee management access      |
| User  | Access to authorized employee operations |

The backend validates authentication and authorization for protected operations.

---

## 📊 Dashboard

The dashboard provides a quick overview of employee information.

### Statistics

* Total Employees
* Active Employees
* Inactive Employees
* Departments

### Charts

#### Employees by Department

A bar chart displays the number of employees in each department.

#### Employee Status

A doughnut chart displays the distribution of employee statuses.

### Recent Employees

The dashboard displays recent employees in a paginated table.

---

## 👨‍💼 Employee Management

The employee module provides complete CRUD functionality.

### Search

Employee search uses RxJS operators such as:

* `debounceTime`
* `distinctUntilChanged`

This reduces unnecessary API requests while the user is typing.

### Filtering

Employees can be filtered by:

* Department
* Status

### Sorting

Employee records can be sorted using table columns.

### Pagination

Employee pagination is handled on the server side so that only the required records are retrieved from the backend.

---

## 📁 Project Structure

```text
employee-management-mean/
│
├── frontend/
│   └── employee-management/
│       └── src/
│           └── app/
│               ├── dashboard/
│               ├── employees/
│               ├── services/
│               ├── guards/
│               ├── interceptors/
│               └── ...
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── ...
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Angular CLI
* MongoDB Atlas account or MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/hardikchudasama/employee-management-mean.git
cd employee-management-mean
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

### 3. Frontend Setup

Navigate to the Angular application:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
ng serve
```

Open the application:

```text
http://localhost:4200
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend project.

Example:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

### MongoDB

You should use your own MongoDB Atlas database when running this project locally.

Replace:

```env
MONGODB_URI=your_mongodb_connection_string
```

with your own MongoDB connection string.

### JWT Secrets

Generate your own secure values for:

```env
JWT_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Never use the example values in a production environment.

> **Important:** Never commit `.env` files or real credentials/secrets to GitHub.

Add `.env` to `.gitignore`:

```text
.env
```

---

## 🗄️ Database

The application uses **MongoDB** with **Mongoose**.

The database stores:

* User information
* Employee information
* Hashed refresh tokens

Each developer should configure their own MongoDB database when running the project locally.

---

## 🖼️ Screenshots

Screenshots can be added here to showcase the application.

### Register

![User Registration](./images/register.png)

### Login

![User Login](./images/login.png)

### Dashboard

![Admin Dashboard](./images/admin-dashboard.png)
![User Dashboard](./images/normal-user-screen.png)

### Employee Management

![Employee Management List](./images/admin-employees.png)

### Add / Edit Employee

![Employee Form](./images/admin-employee-form.png)

### View Employee

![Employee Details](./images/view-employee-details.png)

---

## 🌱 Development Workflow

The project was developed using Git feature branches for different areas of functionality.

Examples:

```text
feature/backend-setup
feature/employee-crud
feature/angular-employee-ui
feature/backend-employee-query
feature/authentication
```

Features were developed separately and merged into the main branch after completion.

---

## 🔮 Future Improvements

Potential future improvements include:

* Unit and integration tests
* API documentation
* Docker support
* CI/CD pipeline
* User management interface
* Advanced dashboard analytics
* Production deployment

---

## 👨‍💻 Author

**Hardik M. Chudasama**

Senior Angular Developer | Full-Stack Developer

### Skills Demonstrated

```text
Angular | TypeScript | JavaScript | RxJS
Node.js | Express.js | MongoDB | REST APIs
PrimeNG | JWT | Git | GitHub
```

---

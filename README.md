# Employee Management System

A full-stack Employee Management System built with **Angular, Node.js, Express.js, and MongoDB**.

The application provides employee management, JWT authentication, role-based authorization, search, filtering, sorting, server-side pagination, and a dashboard with employee statistics and charts.

---

## 🌐 Live Demo & Credentials

* **Frontend (Vercel):** [https://employee-management-mean-7gt1.vercel.app](https://employee-management-mean-7gt1.vercel.app)
* **Backend API (Render):** [https://employee-management-mean-backend.onrender.com](https://employee-management-mean-backend.onrender.com)

### 🧪 Demo User Credentials
You can register a new account directly on the app, or use the test credentials below:

* **Admin User:**
  * **Email:** `admin@example.com` *(or create one via register)*
  * **Password:** `password123`

* **Regular User:**
  * **Email:** `user@example.com` *(or register a new user)*
  * **Password:** `password123`

---

## 🚀 Features

### 🔐 Authentication

- User registration
- User login and logout
- JWT access token authentication
- Refresh token authentication
- Refresh token stored in an HTTP-only cookie
- Refresh token hashed before being stored in MongoDB
- Refresh token rotation
- Automatic access-token refresh
- Protected Angular routes
- Authentication HTTP interceptor
- Global HTTP error interceptor
- Account status validation

### 👥 Role-Based Authorization

The application supports:

- **Admin**
- **User**

Authorization is handled on the backend, while the Angular application protects routes and handles unauthorized API responses.

### 👨‍💼 Employee Management

- Create employees
- View employees
- Update employees
- Delete employees
- Search employees
- Search with RxJS debounce
- Filter by department
- Filter by status
- Sort employee records
- Server-side pagination
- Reactive Forms
- Frontend validation
- Backend validation
- Delete confirmation dialog

### 📊 Dashboard

The dashboard provides an overview of the employee management system.

- Total employees
- Active employees
- Inactive employees
- Total departments
- Employees by department
- Employee status chart
- Recent employees
- Loading state
- Error handling
- Retry functionality

### 🎨 UI & User Experience

- PrimeNG components
- Responsive layout
- Responsive employee table
- Toast notifications
- Confirmation dialogs
- Loading indicators
- Empty states
- Form validation

---

## 🛠️ Tech Stack

### Frontend

- Angular 20
- TypeScript
- RxJS
- PrimeNG
- Chart.js
- HTML5
- SCSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- cookie-parser
- CORS

### Tools

- Git
- GitHub
- Visual Studio Code
- Thunder Client
- MongoDB Atlas

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
The Angular frontend communicates with the Node.js/Express backend through REST APIs.

🔐 Authentication Flow
The application uses an access-token and refresh-token authentication architecture.PlaintextUser
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
Access TokenThe access token contains:User IDUser roleIt is used to authorize API requests.Refresh TokenThe refresh token:Is stored in an HTTP-only cookieIs not returned in the login response bodyIs hashed before being stored in MongoDBIs rotated when a new access token is generatedIs removed from the database during logoutToken RefreshWhen the access token expires:PlaintextAPI Request
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
🔑 Authentication APIThe authentication endpoints are:MethodEndpointDescriptionPOST/api/auth/registerRegister a new userPOST/api/auth/loginLogin userPOST/api/auth/refreshGenerate a new access tokenPOST/api/auth/logoutLogout user

👥 Role-Based Authorization
The application supports two roles:RoleDescriptionAdminFull employee management accessUserAccess to authorized employee operationsThe backend validates authentication and authorization for protected operations.

📊 Dashboard
The dashboard provides a quick overview of employee information.StatisticsTotal EmployeesActive EmployeesInactive EmployeesDepartmentsChartsEmployees by DepartmentA bar chart displays the number of employees in each department.Employee StatusA doughnut chart displays the distribution of employee statuses.Recent EmployeesThe dashboard displays recent employees in a paginated table.

👨‍💼 Employee Management
The employee module provides complete CRUD functionality.SearchEmployee search uses RxJS operators such as:debounceTimedistinctUntilChangedThis reduces unnecessary API requests while the user is typing.FilteringEmployees can be filtered by:DepartmentStatusSortingEmployee records can be sorted using table columns.PaginationEmployee pagination is handled on the server side so that only the required records are retrieved from the backend.

📁 Project StructurePlaintextemployee-management-mean/
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

⚙️ Installation & SetupPrerequisites
Make sure the following are installed:Node.jsnpmAngular CLIMongoDB Atlas account or MongoDB instance1. Clone the RepositoryBashgit clone [https://github.com/hardikchudasama/employee-management-mean.git](https://github.com/hardikchudasama/employee-management-mean.git)
cd employee-management-mean
2. Backend SetupNavigate to the backend directory:Bashcd backend
Install dependencies:Bashnpm install
Create a .env file and configure the required environment variables.Start the backend:Bashnpm run dev
The backend runs on:Plaintexthttp://localhost:3000
3. Frontend SetupNavigate to the Angular application:Bashcd frontend
Install dependencies:Bashnpm install
Start the Angular development server:Bashng serve
Open the application:Plaintexthttp://localhost:4200

🔑 Environment VariablesCreate a .env file in the backend project.Example:Code snippetPORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
MongoDBYou should use your own MongoDB Atlas database when running this project locally.Replace:Code snippetMONGODB_URI=your_mongodb_connection_string
with your own MongoDB connection string.JWT SecretsGenerate your own secure values for:Code snippetJWT_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
Never use the example values in a production environment.Important: Never commit .env files or real credentials/secrets to GitHub.Add .env to .gitignore:Plaintext.env

🗄️ DatabaseThe application uses MongoDB with Mongoose.The database stores:User informationEmployee informationHashed refresh tokensEach developer should configure their own MongoDB database when running the project locally.

🖼️ ScreenshotsRegisterLoginDashboardEmployee ManagementAdd / Edit EmployeeView Employee🌱 Development WorkflowThe project was developed using Git feature branches for different areas of functionality.Examples:Plaintextfeature/backend-setup
feature/employee-crud
feature/angular-employee-ui
feature/backend-employee-query
feature/authentication
Features were developed separately and merged into the main branch after completion.🔮 Future ImprovementsPotential future improvements include:Unit and integration testsAPI documentationDocker supportCI/CD pipelineUser management interfaceAdvanced dashboard analyticsProduction deployment

👨‍💻 Author
Hardik M. Chudasama
Senior Angular Developer | Full-Stack DeveloperSkills DemonstratedPlaintextAngular | TypeScript | JavaScript | RxJS
Node.js | Express.js | MongoDB | REST APIs
PrimeNG | JWT | Git | GitHub
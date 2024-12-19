# Graduation Project SEP490 - Agricultural Product Management System

This project is a web application designed for managing and trading agricultural products, primarily for small and medium-sized enterprises in the central region. It includes both backend APIs and a frontend user interface.

---

## Features

### Frontend (React)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the React project directory, you can run:

- **`npm start`**: Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page reloads on changes, and lint errors are displayed in the console.
- **`npm test`**: Launches the test runner in interactive watch mode.
- **`npm run build`**: Builds the app for production in the `build` folder.
- **`npm run eject`**: Ejects the React app configuration for customization.

### React Documentation

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)

---

### Backend (Spring Boot)

This backend provides APIs for user authentication, product management, and order processing. It is built using **Java 17** and **Spring Boot** framework.

---

## Prerequisites

### For Backend:

- **Java 17**
- **MySQL Database**
- **Spring Boot** (version 3.2.8)
- **Maven** for project management and dependencies
- **IDE**: IntelliJ IDEA or Eclipse

### For Frontend:

- **Node.js** (version 16 or later)
- **npm** (comes with Node.js)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Graduation-Project_SEP490_NongSan.git
```

### 2. Backend Setup

#### Database Configuration

1. Create a MySQL database named `tams`.
2. Update the `application.properties` file in `src/main/resources/`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/tams
spring.datasource.username=your-database-username
spring.datasource.password=your-database-password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

#### Build and Run the Backend

1. Navigate to the backend directory.
2. Use Maven to clean, build, and run the project:

```bash
mvn clean install
mvn spring-boot:run
```

3. Access the backend at `http://localhost:8080`.

---

### 3. Frontend Setup

1. Navigate to the frontend directory (React project).
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm start
```

4. Access the frontend at `http://localhost:3000`.

---

## Project Structure

### Backend

```plaintext
src/
 ├── main/
 │    ├── java/
 │    │    ├── com.fpt.Graduation_Project_SEP490_NongSan/
 │    │    │    ├── controller/   # API controllers
 │    │    │    ├── domain/       # Entity models
 │    │    │    ├── modal/        # Data models
 │    │    │    ├── payload/      # Request/Response payloads
 │    │    │    ├── service/      # Service layer
 │    │    │    └── utils/        # Utility classes
 │    ├── resources/
 │    │    └── application.properties  # Configuration file
 └── test/                          # Unit and Integration tests
```

### Frontend

The frontend follows the default structure of a Create React App project.

---

## Technologies Used

### Frontend:
- **React.js**
- **React Router**
- **Axios** for HTTP requests
- **Tailwind CSS** for styling (optional)

### Backend:
- **Spring Boot** 3.2.8
- **Spring Security** for authentication
- **Spring Data JPA** with MySQL
- **JWT** for secure token-based authentication
- **Lombok** to reduce boilerplate code
- **Cloudinary** for image hosting and management

---

## Deployment

### Frontend:
- Build the production version:

```bash
npm run build
```

- Deploy the `build/` folder to any static hosting platform like Vercel, Netlify, or AWS S3.

### Backend:
- Package the application as a `.jar` file:

```bash
mvn clean package
```

- Deploy the `.jar` file to a server or cloud platform like AWS EC2, Heroku, or Docker.

---

## Learn More

- [React Documentation](https://reactjs.org/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [MySQL Documentation](https://dev.mysql.com/doc/)

--- 

This README combines both the frontend and backend setup, making it easier for new developers to get started with the project.

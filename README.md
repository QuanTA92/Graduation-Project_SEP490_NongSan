# Graduation-Project_SEP490_NongSan

## Description
This project is a website for managing and trading agricultural products for small and medium-sized enterprises in the central region. It includes user authentication, two-factor authentication, password reset functionality, and an API for managing agricultural products.

## Prerequisites

- **Java 17**
- **MySQL Database**
- **Spring Boot** framework (version 3.2.8)
- **Maven** for project management and dependencies

### Required Tools:

- **IDE**: IntelliJ IDEA / Eclipse (or any IDE that supports Spring Boot)
- **MySQL**: Make sure MySQL is installed and running on your machine
- **Postman** (optional): For API testing and requests

## Setup

### 1. Clone the Repository

```bash
https://github.com/QuanTA92/Graduation-Project_SEP490_NongSan.git
```

### 2. Database Configuration

Before you run the application, ensure that MySQL is properly configured. You need to create a database and set the proper connection in the `application.properties` file.

#### Database Configuration in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/tams
spring.datasource.username=your-database-username
spring.datasource.password=your-database-password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

- **URL**: The MySQL server is running at `localhost:3307`, with the database named `tams`.
- **Username**: `your-database-username`
- **Password**: `your-database-password`

> Ensure that the MySQL server is up and running before you proceed.

### 3. Maven Configuration

The project uses **Maven** for managing dependencies and building the application. If you're using an IDE like IntelliJ IDEA, Maven is typically integrated automatically.

#### Build the project using Maven

```bash
mvn clean install
```

This command will clean the project, install dependencies, and create a runnable `.jar` file in the `target/` directory.

## Running the Application

You can run the project using the following steps:

### 1. From IDE:
- Right-click on the main class `GraduationProjectApplication.java` and select **Run**.

### 2. From the command line:
- Navigate to the project directory and use the following command to run the application:

```bash
mvn spring-boot:run
```

### 3. Access the Application

Once the application is running, you can access it via:

- **API Endpoints**: `http://localhost:8080/api/`
- The application runs on **port 8080** by default.

## Technologies Used

- **Spring Boot** 3.2.8
- **Spring Security** for authentication and authorization
- **Spring Data JPA** with MySQL for database interactions
- **MySQL** for data storage
- **JWT** for authentication tokens
- **Lombok** for reducing boilerplate code
- **Spring Boot DevTools** for easier development and hot reloading
- **Cloudinary** for image management

## Project Structure

```text
src/
 ├── main/
 │    ├── java/
 │    │    ├── com/
 │    │    │    └── fpt/
 │    │    │        └── Graduation_Project_SEP490_NongSan/
 │    │    │            ├── controller/     # API controllers
 │    │    │            ├── domain/         # Entity models
 │    │    │            ├── modal/          # Data models
 │    │    │            ├── payload/        # Request/Response payloads
 │    │    │            ├── service/        # Service layer
 │    │    │            └── utils/          # Utility classes
 │    ├── resources/
 │    │    └── application.properties  # Configuration file
 └── test/                          # Unit and Integration tests
```

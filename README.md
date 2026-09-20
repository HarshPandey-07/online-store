# About the project 🏪

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-ED8B00.svg?style=flat&logo=openjdk&logoColor=white)](https://java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F.svg?style=flat&logo=springboot&logoColor=white)](https://spring.io)
[![React](https://img.shields.io/badge/React-20232A.svg?style=flat&logo=react&logoColor=61DAFB)](https://react.dev)

A full-stack online store application built with React and Spring Boot, featuring user authentication, product management, and an admin dashboard.

## Screenshots 🖼️

### Landing Page
![Home Page](./frontend/public/Screenshot-Home_Page.png)
> *This page shows products available for users to purchase.*

### Dashboard Admin
![Dashboard Admin](./frontend/public/Screenshot-Dashboard_Admin.png)
> *The main control center showing system stats and last orders for admins.*

### Sidebar for Admin
![Sidebar for admin](./frontend/public/Screenshot-Sidebar_Admin.png)
> *This sidebar shows the admin navigation menu.*

### Product Management Page Admin
![Product page admin](./frontend/public/Screenshot-Product_Page_Admin.png)
> *This page shows product management for admins.*

## Features 💻

### User 👤
* User login & signup system
* Direct ordering system (no cart system)
* Search products

### Admin 🧑‍💻
* Admin panel
* Admin stats
* Add, edit, and delete products
* Refill stock
* Deliver and cancel orders
* Change user roles

## Frontend
- React
- Tailwind CSS
- Vite
- npm

## Backend
- Java 25
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- Maven

## To run the project 🚀

### Frontend 
```bash
cd frontend
npm install
npm run dev
```

### Backend
Windows
```bash
cd firstSpring
mvnw.cmd spring-boot:run
```

MacOS/Linux
```bash
cd firstSpring
./mvnw spring-boot:run
```


### TODO 📋
* Integrate the change role feature into the frontend

### Note ⚠️
* The edit feature of the user profile is not completed
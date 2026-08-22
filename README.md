# Gym & Fitness Class Booking API

A RESTful API for managing gym fitness classes, bookings, and trainer dashboards. Built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication** — user registration and login with JWT, role-based access (`member` / `trainer`)
- **Sessions** — trainers can create, update, delete, and list fitness class sessions (with search, filtering, and pagination)
- **Bookings** — members can book/cancel class sessions and view their booking history; trainers can view a session's roster
- **Dashboard** — trainers can view stats on their sessions (capacity, booked slots, attendance rate, busiest classes)
- **API Docs** — interactive Swagger UI documentation

## Tech Stack

- Node.js, Express 5, TypeScript
- MongoDB with Mongoose
- JWT authentication, bcrypt password hashing
- Zod for request validation
- Swagger (OpenAPI) for API documentation

## Project Structure

```
src/
├── config/          # DB connection and Swagger setup
├── controllers/     # Route handlers
├── middlewares/      # Auth, validation, error handling
├── models/          # Mongoose schemas (User, ClassSession, Booking)
├── routes/          # Express routers
├── services/        # Business logic
├── utils/           # Shared helpers (ApiError, ApiResponse, catchAsync)
├── validations/     # Zod validation schemas
└── server.ts         # App entry point
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB database (e.g. MongoDB Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_EXPIRES_IN=7d
```

### Run the app

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:<PORT>`.

## API Documentation

Once the server is running, view the interactive Swagger docs at:

```
http://localhost:<PORT>/api-docs
```

## Main Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in a user |
| POST | `/api/sessions` | Trainer | Create a class session |
| GET | `/api/sessions` | Trainer | List sessions (search/filter/paginate) |
| GET | `/api/sessions/:id` | Trainer | Get a session by ID |
| PATCH | `/api/sessions/:id` | Trainer | Update a session |
| DELETE | `/api/sessions/:id` | Trainer | Delete (soft-delete) a session |
| POST | `/api/bookings` | Member | Book a class session |
| PATCH | `/api/bookings/:bookingId/cancel` | Member | Cancel a booking |
| GET | `/api/bookings/my-bookings` | Member | View own booking history |
| GET | `/api/bookings/:sessionId/roster` | Trainer | View bookings for a session |
| GET | `/api/dashboard/trainer-stats` | Trainer | View booking statistics |

## Authentication

Protected routes require a JWT sent as a Bearer token:

```
Authorization: Bearer <token>
```

Team Members
**Abanob Adly Gad Gaballah (Team Leader)   
Anthony George Shaker Hanna  
Abram Ehab Milad** 

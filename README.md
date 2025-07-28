Task Management API

A RESTful API for managing tasks built with Node.js, Express, and MongoDB.
Supports user authentication, role-based access control, task filtering, pagination, and overdue task detection


Features:
User authentication with JWT

Role-based access control (admin, manager, etc.)

Full CRUD operations for tasks

Task filtering by status, due date, and search keyword

Pagination support for listing tasks

Overdue task detection (isOverdue virtual field)

User-specific task endpoints (/me/tasks)

Summary endpoint showing task statistics (/me/summary)

Technologies Used:

Node.js

Express.js

MongoDB & Mongoose

JSON Web Tokens (JWT)

Async middleware for error handling

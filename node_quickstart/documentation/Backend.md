# Backend

Documentation of the backend architecture, server behavior, database interactions, authentication, and third-party integrations powering the MuShoes Online Store.

## 1. Folder Architecutre

All backend logic lives inside the ```node_quickstart``` directory.
Frontend files inside ```public_frontend``` are served by the backend but are not backend logic.
```
> MUSHOES-ONLINE-STORE
  > node_quickstart
    > documentation
    > models
      - Shoe.js
    > mongodb-mongoose
    > node_modules
    > public_frontend        // Static frontend (served, not backend logic)
    > temp_image_uploads    // Temporary storage for image uploads
    - .env
    - cloudinary-connection.js
    - index.js
    - mongo_db_express_queries.js
    - schema-connection.js
    - seed.js               // Manual utility
    - testUpload.js         // Manual utility
```

## 2. Overview

The backend of the MuShoes Online Store is a Node.js + Express application responsible for orchestrating all server-side logic, enforcing business rules, and acting as the single source of truth for data, authentication, payments, and third-party integrations.

The backend performs four critical roles:
1. Web Server — Hosts and serves the frontend
2. API Layer — Handles all client requests
3. Business Logic Layer — Enforces validation, stock rules, and workflows
4. Persistence Layer — Manages MongoDB data storage

All backend runtime logic is centralized in a single entry point: ```index.js```.

This design emphasizes clarity, traceability, and correctness over premature modularization.

## 3. Backend Entry Point

```index.js```

index.js is the single executable file responsible for initializing and running the backend.

Responsibilities:
- Initialize the Express application
- Register global middleware
- Protect admin routes
- Define all API endpoints
- Configure file uploads
- Integrate Stripe Checkout
- Establish MongoDB connection
- Start the HTTP server

The backend is launched using:
``` 
npm run dev
```

which executes:
```
nodemon index.js
```

## 4. Middleware Configuration

### 4.1 Static Frontend Hosting

``` JavaScript
app.use(express.static('public_frontend'));
```

Purpose:
- Allows the backend to serve the frontend directly
- Eliminates the need for a separate frontend server
- Ensures consistent deployment

📎 Frontend Cross-Link:
All files documented in ```Frontend.md``` are delivered to the browser via this middleware.

### 4.2 Request Parsing

``` JavaScript
app.use(express.json());
```
Purpose:
- Enables parsing of JSON request bodies
- Required for POST-based API communication

### 4.3 Admin Authentication

Admin routes are protected using HTTP Basic Authentication:
``` JavaScript
app.use('/admin', basicAuth({...}));
```

Design Intent:
- Lightweight security suitable for a small admin panel
- No session storage required
- Credentials stored securely in environment variables

📎 Frontend Cross-Link:
Admin dashboard pages documented in Frontend.md require successful authentication before loading.

## 5. Enviornment Configuration

```.env```

All sensitive configuration values are stored as environment variables:
- MongoDB connection URI
- Admin credentials
- Stripe secret key
- Cloudinary credentials

This ensures:
- Secrets are never committed to source control
- The application can be safely deployed to different environments

## 6. Database Architecture

### 6.1 MongoDB + Mongoose

MongoDB is used as the primary data store.
Mongoose provides:
- Schema enforcement
- Field validation
- Lifecycle hooks
- Model-level business logic

### 6.2 Database Connection 


```schema-connection.js``` 

Responsible for establishing and maintaining the MongoDB connection.

Behavior:
- Connects Mongoose to MongoDB
- Prevents server startup if connection fails
- Ensures all routes operate on a valid database connection

## 7. Data Model Layer

### 7.1 Shoe Model

```models/Shoe.js```

Defines the schema for all product listings.

This file represents the core domain model of the application.

### 7.2 Shoe Schema Responsibilites

- Enforce data structure and validation
- Generate a unique, human-readable identifier
- Upload images to Cloudinary
- Store only hosted image URLs
- Centralize data-level business logic

### 7.3 Key Fields

| Field               | Purpose                  |
| ------------------- | ------------------------ |
| `name`              | Product name             |
| `brand`             | Manufacturer             |
| `size`              | Shoe size                |
| `gender`            | `'M'` or `'F'`           |
| `color`             | Array of color values    |
| `condition`         | Product condition        |
| `price`             | Price (cents)            |
| `stock`             | Inventory count          |
| `images`            | Cloudinary URLs          |
| `mushoes_custom_id` | Auto-generated unique ID |


### 7.4 Custom Identifier Generation

The mushoes_custom_id is automatically generated when a new document is created.

Composition:
- Brand
- Name (first 5 characters)
- Condition
- Sorted colors
- Size
- Gender

Rationale:

- Prevent duplicate listings
- Improve readability
- Maintain deterministic identifiers

### 7.5 Image Upload Lifecycle (Pre-Save Hook)

``` JavaScript
shoeSchema.pre('save', async function (next) { ... })
```

Execution Flow
```
Admin submits form
        |
Multer saves images locally
        |
new Shoe(listing)
        |
shoe.save()
        |
pre('save') hook executes
        |
Images uploaded to Cloudinary
        |
URLs stored in MongoDB

```
Key Benefit:

Image hosting logic is decoupled from route handlers and enforced at the data layer.

## 8. Database Query Utilites

```mongo_db_express_queries.js```

Provides reusable helper functions for MongoDB access.

Functions:
- readAllListings() — Fetch all listings
- findAListing(id) — Fetch single listing
- deleteAListing(id) — Remove listing

Purpose:
- Reduce duplication
- Centralize database access logic
- Improve maintainability

## 9. API Layer

### 9.1 Customer-Facing Endpoints

```GET /fetch_all_listings```

Returns all listings.

Frontend Cross-Link:

Used by the shop page to render inventory.

```POST /product```

Returns detailed data for a single listing.

Frontend Cross-Link:

Used by the product detail page.

```POST /create-checkout-session```

Creates a Stripe Checkout session.

Validation:
- Ensures product exists
- Confirms stock availability
- Prevents checkout for unavailable items, i.e if stock is <= 0

Frontend Cross-Link:

Used by the checkout button on the product page.

### 9.2 Admin Endpoints

```POST /admin/dashboard/upload_listing```

Creates a new product listing.

Flow Diagram:
```
Admin Form
   |
   v
Multer (local storage)
   |
   v
Shoe Model
   |
   v
Cloudinary Upload
   |
   v
MongoDB Save
```

```GET /admin/dashboard/view_deletable_listings```

Returns all listings

Used for admin deletion interface

```POST /admin/dashboard/delete_listing```

Deletes a listing permanently.

Frontend Cross-Link:

Used by the admin dashboard delete interface.

## 10. Stripe Integration

Stripe Checkout is used for secure payment processing.

Design Principles:
- All payment logic runs server-side
- Prices are never trusted from the frontend
- Checkout sessions are generated dynamically

This ensures:
- Fraud prevention
- Correct pricing
- Stock-aware purchasing

## 11.  Utility and & Legacy Files

These files are not part of runtime execution.

| File            | Purpose                       |
| --------------- | ----------------------------- |
| `seed.js`       | Manual database seeding       |
| `testUpload.js` | Cloudinary credential testing |

They are retained for development convenience.

## 12. Frontend <=> Backend Responsibility Split

| Concern              | Frontend | Backend |
| -------------------- | -------- | ------- |
| UI Rendering         | ✅        | ❌       |
| Form Validation (UX) | ✅        | ❌       |
| Authentication       | ❌        | ✅       |
| Pricing Logic        | ❌        | ✅       |
| Stock Validation     | ❌        | ✅       |
| Image Hosting        | ❌        | ✅       |
| Payments             | ❌        | ✅       |

Rule:
The frontend may assist, but the backend always enforces.

## 13. Design Decision & Reflection

### Centralized index.js

Rather than premature modularization, the backend intentionally uses a single entry file.

Rationale:
- Easier traceability
- Reduced abstraction overhead
- Clear execution flow for learning

### Buisness Logic in the Model Layer

Image uploads and identifier generation are handled in Shoe.js.

Why this matters:
- Prevents duplicated logic
- Guarantees consistency
- Aligns with MVC best practices

### Backend as the Source of Truth

All critical rules are enforced server-side.

Justification:
- Frontend can be bypassed
- Backend validation prevents manipulation
- Ensures data integrity

### Lightweight Authentication Choice

HTTP Basic Auth was chosen intentionally.

Reasoning:
- Simple admin-only use case
- No user accounts required
- Minimal security surface area

## 14. Future Improvements

- Replace basic auth with session or JWT-based authentication
- Add customer user accounts and order persistence
- Implement soft deletion for listings
- Add Cloudinary image cleanup on deletion
- Add inventory tracking and analytics
- Improve error handling and logging

## 15. Final Notes

- The backend is intentionally centralized in index.js
- Schema hooks handle complex logic cleanly
- Frontend validation is optional UX enhancement
- Backend validation is mandatory and enforced
- The system prioritizes simplicity, correctness, and data integrity

## 16. All Backend Files
- index.js
- Shoe.js
- cloudinary-connection.js
- mongo_db_express_queries.js
- schema-connection.js
- seed.js (needs to be manually run once to populate when DB empty or for deployment)
- db-connection.js (unused/legacy)
- testUpload.js (for dev utility)
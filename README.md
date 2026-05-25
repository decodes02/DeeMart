# DeeMart - Full Stack E-Commerce Platform

## Overview

DeeMart is an interview-ready full-stack e-commerce product-management platform built with React, Java, Spring Boot, and MySQL. It supports dynamic product listing, search, filtering, sorting, product detail pages, multipart product image uploads, MySQL persistence, and cart state managed with React Context API.

The application is designed as a polished catalog operations tool rather than a tutorial CRUD page. The backend exposes REST APIs for product lifecycle management, while the frontend provides a responsive catalog, product editor, product detail view, and cart workflow.

## Features

- Dynamic product catalog backed by Spring Boot REST APIs
- Search across product name, brand, category, and description
- Category filtering, availability filtering, and client-side sorting
- Product detail pages with backend-served image retrieval
- Add, edit, and delete products with multipart image upload
- MySQL persistence with product images stored as BLOB data
- React Context API cart with add, remove, quantity update, clear cart, totals, and localStorage persistence
- Responsive navigation, product cards, form states, skeleton loaders, empty states, error states, and toast notifications
- Demo product seeding through a Spring Boot `CommandLineRunner`

## Tech Stack

### Backend

- Java 21
- Spring Boot 3.4
- Spring Web
- Spring Data JPA
- Jakarta Validation
- MySQL Connector/J
- Lombok
- H2 for tests

### Frontend

- React 19
- Vite
- React Router
- React Context API
- Axios
- Lucide React icons
- Custom responsive CSS

## Architecture

```text
DeeMart/
  Backend/
    DeeMart_Backend/
      src/main/java/com/decodes/eCom/
        config/
        controller/
        dto/
        exception/
        model/
        repository/
        service/
      src/main/resources/application.properties
  Frontend/
    check/
      src/
        components/
        context/
        hooks/
        pages/
        services/
        utils/
        App.jsx
```

## Backend APIs

Base URL: `http://localhost:8080`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Returns all products without raw image bytes |
| `GET` | `/api/products/{id}` | Returns product details and image metadata |
| `POST` | `/api/products` | Creates a product using `multipart/form-data` |
| `PUT` | `/api/products/{id}` | Updates a product and optionally replaces its image |
| `DELETE` | `/api/products/{id}` | Deletes a product |
| `GET` | `/api/products/{id}/image` | Streams product image bytes with the stored MIME type |
| `GET` | `/api/products/search?keyword=` | Searches name, brand, category, and description |

### Multipart Request Shape

`POST` and `PUT` expect:

- `product`: JSON part containing product fields
- `image`: optional image file part

Example `product` JSON:

```json
{
  "name": "MacBook Pro 14",
  "brand": "Apple",
  "description": "Portable workstation for creative workflows.",
  "price": 1999.00,
  "category": "Laptops",
  "releaseDate": "2026-05-25",
  "available": true,
  "quantity": 9
}
```

## Database Design

The `products` table is managed by JPA and includes:

```text
id
name
brand
description
price
category
release_date
available
quantity
image_name
image_type
image_data
```

`image_data` is mapped as a `LONGBLOB`, while `image_type` stores the MIME type used by `/api/products/{id}/image` to return the correct `Content-Type`.

## React Context API State Management

The cart lives in `src/context/CartContext.jsx`. It provides:

- `items`
- `totalItems`
- `subtotal`
- `addToCart(product)`
- `removeFromCart(id)`
- `updateQuantity(id, quantity)`
- `clearCart()`

Cart changes are persisted to `localStorage` under `deemart-cart`, so the cart survives page refreshes.

## Image Upload & BLOB Handling

The frontend submits product metadata as a JSON `Blob` and the image as a file in the same `FormData` payload. The backend validates image MIME types, stores filename, MIME type, and bytes in MySQL, and exposes a separate image endpoint so list responses do not include raw BLOB data.

Request lifecycle:

1. React form builds `FormData` with `product` JSON and optional `image` file.
2. Spring controller receives the request with `@RequestPart`.
3. Service validates and maps product fields.
4. JPA persists product metadata and BLOB image data to MySQL.
5. React cards request `/api/products/{id}/image` only when rendering an image.

## Setup Instructions

### MySQL Setup

Create the database before starting the backend:

```sql
CREATE DATABASE IF NOT EXISTS deemart;
```

The backend reads credentials from environment variables:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/deemart?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USER="root"
$env:DB_PASSWORD="your_mysql_password"
```

Optional environment variables:

```powershell
$env:SERVER_PORT="8080"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
$env:SEED_DEMO_DATA="true"
$env:SEED_IMAGE_DIRECTORY="../../Images"
```

### Backend Setup

```powershell
cd Backend/DeeMart_Backend
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### Frontend Setup

```powershell
cd Frontend/check
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

To point the frontend at a different API base URL:

```powershell
$env:VITE_API_BASE_URL="http://localhost:8080"
npm run dev
```

## Screenshots

Add screenshots after running the app locally:

- Home dashboard
- Product listing with filters
- Product detail page
- Product add/edit form
- Cart page

<!-- ## Interview Talking Points

- Built a layered Spring Boot backend with controller, service, repository, DTO, config, model, and exception packages.
- Avoided returning raw image BLOB data in product list responses by exposing a dedicated image streaming endpoint.
- Used `multipart/form-data` with a JSON request part plus optional image replacement for product create/update.
- Used JPA validation and a global exception handler for predictable API errors and meaningful HTTP status codes.
- Configured MySQL with environment variables instead of hardcoded secrets.
- Implemented React Router pages and reusable product components for a real catalog workflow.
- Managed cart state with React Context API and persisted it to localStorage.
- Added client-side search debounce, filters, sorting, skeleton loaders, empty states, and toast notifications for a polished user experience. -->

## Future Enhancements

- Backend pagination and server-side sorting/filtering for large catalogs
- Authentication and role-based admin access
- Order checkout and payment workflow
- Cloud object storage option for images
- Integration tests with Testcontainers and MySQL
- Product audit history and inventory event tracking
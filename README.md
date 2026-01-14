# Order Management API - Node.js

A full-stack order management system built with Node.js and vanilla JavaScript, featuring a RESTful API and modern web interface for managing products, customers, and orders.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

![Application Interface](./docs/screenshot.png)

*Modern dark-themed interface for managing products, customers, and orders*

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Frontend Interface](#frontend-interface)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [License](#license)

## Overview

This project is a complete order management system that allows you to:
- Manage a product catalog with prices
- Register and maintain customer information
- Create and track orders with multiple items
- Search and filter orders by customer or product
- Interact through both API endpoints and a web interface

## Features

### Backend Features
- **RESTful API** with Express.js
- **CRUD operations** for Products, Customers, and Orders
- **Input validation** with detailed error messages
- **Advanced search** functionality for orders
- **CORS configuration** for security
- **In-memory data storage** (easily replaceable with a database)
- **Automatic ID generation** for all entities

### Frontend Features
- **Modern, dark-themed UI** with responsive design
- **Tabbed navigation** for different sections
- **Real-time form validation**
- **Dynamic order management** with multiple items
- **Product and customer selection** via dropdowns
- **Order search** by customer or product
- **Error handling** with user-friendly messages
- **Edit and delete** functionality for all entities

## Architecture

The project follows a **layered architecture** pattern:

```
┌─────────────────────────────────────┐
│         Frontend (Web UI)           │
│    HTML + CSS + Vanilla JS          │
└─────────────────┬───────────────────┘
                  │ HTTP Requests
┌─────────────────▼───────────────────┐
│         Routes Layer                │
│   (productRoutes, orderRoutes,      │
│    customerRoutes)                  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       Controllers Layer             │
│   (Business logic handlers)         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        Services Layer               │
│   (Core business logic &            │
│    data validation)                 │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Data Layer                  │
│   (In-memory storage)               │
└─────────────────────────────────────┘
```

### Layer Responsibilities

- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle HTTP requests/responses and call services
- **Services**: Implement business logic and data validation
- **Data**: Manage data storage and retrieval

## Getting Started

### Prerequisites

- Node.js (>= 14.0.0)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/williamalmeidadev/order-management-api-nodejs.git
   cd order-management-api-nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   
   Create a `.env` file in the root directory:
   ```env
   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

4. **Start the server**
   
   For development (with auto-reload):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Documentation

Base URL: `http://localhost:3000/api`

### Products

#### Get All Products
```http
GET /api/products
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "value": 29.99
  }
]
```

#### Get Product by ID
```http
GET /api/products/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Product Name",
  "value": 29.99
}
```

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "New Product",
  "value": 49.99
}
```

**Validation Rules:**
- `name`: required, non-empty string
- `value`: required, numeric, >= 0

**Success Response (201):**
```json
{
  "id": 2,
  "name": "New Product",
  "value": 49.99
}
```

**Error Response (400):**
```json
{
  "message": "'name' must be a non-empty string"
}
```

#### Update Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product",
  "value": 59.99
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Updated Product",
  "value": 59.99
}
```

#### Delete Product
```http
DELETE /api/products/:id
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Deleted Product",
  "value": 29.99
}
```

---

### Customers

#### Get All Customers
```http
GET /api/customers
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

#### Get Customer by ID
```http
GET /api/customers/:id
```

#### Create Customer
```http
POST /api/customers
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

**Validation Rules:**
- `name`: required, non-empty string
- `email`: required, valid email format, unique

**Success Response (201):**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

#### Update Customer
```http
PUT /api/customers/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com"
}
```

#### Delete Customer
```http
DELETE /api/customers/:id
```

---

### Orders

#### Get All Orders
```http
GET /api/orders
```

**Response:**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }
]
```

#### Get Order by ID
```http
GET /api/orders/:id
```

#### Search Orders
```http
GET /api/orders/search?customerId=1&productId=2
```

**Query Parameters:**
- `customerId` (optional): Filter by customer ID
- `productId` (optional): Filter by product ID

**Response:**
```json
[
  {
    "id": 1,
    "customerId": 1,
    "items": [
      {
        "productId": 2,
        "quantity": 3
      }
    ]
  }
]
```

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Validation Rules:**
- `customerId`: required, must exist
- `items`: required, non-empty array
- `items[].productId`: required, must exist
- `items[].quantity`: required, integer > 0

**Success Response (201):**
```json
{
  "id": 2,
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

#### Update Order
```http
PUT /api/orders/:id
Content-Type: application/json

{
  "customerId": 1,
  "items": [
    {
      "productId": 2,
      "quantity": 5
    }
  ]
}
```

#### Delete Order
```http
DELETE /api/orders/:id
```

---

## Frontend Interface

The web interface is built with vanilla JavaScript and features a modern, dark-themed design.

### Main Sections

1. **Products Tab**
   - Create and edit products
   - View product list with prices
   - Delete products
   - Real-time price formatting

2. **Customers Tab**
   - Register new customers
   - Edit customer information
   - View customer list
   - Email validation

3. **Orders Tab**
   - Create orders with multiple items
   - Select customer from dropdown
   - Add/remove product items dynamically
   - Automatic subtotal calculation
   - Edit existing orders

4. **Search Orders Tab**
   - Filter orders by customer
   - Filter orders by product
   - Combined filtering support
   - Display order details with calculated totals

### User Experience Features

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Validation**: Immediate feedback on form inputs
- **Error Messages**: Clear, actionable error messages from the backend
- **Smooth Transitions**: Tab switching with smooth animations
- **Visual Feedback**: Hover effects and button states
- **Data Persistence**: Orders update related selects automatically

## Project Structure

```
order-management-api-nodejs/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── customerController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── data/                 # In-memory data storage
│   │   ├── customers.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── public/               # Frontend files
│   │   ├── index.html        # Main HTML file
│   │   ├── script.js         # Frontend JavaScript
│   │   └── style.css         # Styling
│   ├── routes/               # API route definitions
│   │   ├── costumerRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── services/             # Business logic
│   │   ├── customerService.js
│   │   ├── orderService.js
│   │   └── productService.js
│   ├── app.js                # Express app configuration
│   └── server.js             # Server entry point
├── .env                      # Environment variables (create this)
├── .gitignore
├── package.json
├── LICENSE
└── README.md
```

## Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development auto-reload (dev dependency)

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - HTTP requests

### Architecture Patterns
- **MVC-inspired** layered architecture
- **RESTful** API design
- **Service layer** pattern for business logic
- **Separation of concerns**

## Development

### Running in Development Mode

The development mode uses `nodemon` to automatically restart the server when files change:

```bash
npm run dev
```

### Adding a Database

To replace in-memory storage with a database:

1. Install a database driver (e.g., `pg` for PostgreSQL, `mysql2` for MySQL)
2. Update the data layer files in `src/data/`
3. Implement database connection and queries
4. Update service layer to use async/await

### API Testing

You can test the API using:
- **curl**
- **Postman**
- **Thunder Client** (VS Code extension)
- **Insomnia**

Example curl command:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","value":19.99}'
```

## Security Features

- **CORS configuration** with allowed origins
- **Content Security Policy** header (frame-ancestors 'none')
- **Input validation** on all endpoints
- **Error handling** without exposing sensitive information

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**williamalmeidadev**

- GitHub: [@williamalmeidadev](https://github.com/williamalmeidadev)
- Repository: [order-management-api-nodejs](https://github.com/williamalmeidadev/order-management-api-nodejs)

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you have any questions or need help, please open an issue in the [GitHub repository](https://github.com/williamalmeidadev/order-management-api-nodejs/issues).

---

**If you find this project useful, please consider giving it a star on GitHub!**

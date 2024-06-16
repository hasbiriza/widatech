#This project implements the backend services for the Invoice Module feature of a Point of Sales System using Node.js and Express. The backend services include APIs for adding new invoices and retrieving a list of invoices. The project uses MySQL for the database.

Setup Instructions

##Prerequisites
Node.js (version 14.x or higher)
PostgreSQL



##Installation
Clone the repository

bash
Copy code
git clone [Repository URL]
cd [Repository Name]
Install the dependencies

bash
Copy code
npm install
Set up the PostgreSQL database

Create a database named invoice_db
Run the SQL script located in database/schema.sql to create the necessary tables
Configure the environment variables

Create a .env file in the root directory
Add the following configuration:
makefile
Copy code
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=invoice_db
Running the Application
Start the server

bash
Copy code
npm start
The server will run on http://localhost:8000

##API Documentation
###Add Invoice
Endpoint: POST /api/invoices
Description: Adds a new invoice to the database
Request Body:
json
Copy code
{
  "date": "2023-06-15",
  "customerName": "John Doe",
  "salespersonName": "Jane Smith",
  "notes": "First invoice",
  "products": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 100
    }
  ]
}
Response:
json
Copy code
{
  "message": "Invoice added successfully",
  "invoiceId": 1
}
###Get Invoices
Endpoint: GET /api/invoices
Description: Retrieves a list of invoices
Response:
json
Copy code
[
  {
    "invoiceId": 1,
    "date": "2023-06-15",
    "customerName": "John Doe",
    "salespersonName": "Jane Smith",
    "totalAmount": 200,
    "notes": "First invoice"
  }
]




##Project Structure

src/
controllers/ - Contains the controller functions for handling API requests
routes/ - Contains the route definitions
models/ - Contains the database models and queries
db.js
index.js
migration.js




##Future Work
Implement the frontend using React.js
Integrate Redux for state management
Add additional features like product autocomplete and pagination for invoices
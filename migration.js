const pool = require("./db");

async function createTables() {
  try {
    const createInvoicesTableQuery = `
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        salesperson_name VARCHAR(255) NOT NULL,
        notes TEXT
      );
    `;

    const createProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        picture VARCHAR(255) NOT NULL,
        stock INT NOT NULL,
        price INT NOT NULL
      );
    `;

    const createInvoiceItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        total_price INT NOT NULL,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `;

    await pool.query(createInvoicesTableQuery);
    await pool.query(createProductsTableQuery);
    await pool.query(createInvoiceItemsTableQuery);
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

async function seedData() {
  try {
    const createProductsQuery = `
      INSERT INTO products (name, picture, stock, price)
      VALUES
      ('Bluetooth speaker', '/images/1.png', 100, 250000),
      ('Headphone', '/images/1.png', 150, 150000),
      ('Laptop charger', '/images/1.png', 80, 300000),
      ('LCD Monitor', '/images/1.png', 50, 2000000),
      ('Mouse', '/images/1.png', 200, 50000),
      ('Keyboard', '/images/1.png', 180, 80000),
      ('Webcam', '/images/1.png', 70, 400000),
      ('USB Hub', '/images/1.png', 90, 100000),
      ('Printer', '/images/1.png', 40, 1200000),
      ('Desk Lamp', '/images/1.png', 110, 60000);
    `;

    await pool.query(createProductsQuery);
    console.log("Mock data inserted successfully");
  } catch (error) {
    console.error("Error inserting mock data:", error);
  }
}

async function migrate() {
  await createTables();
  await seedData();
}

module.exports = { migrate };

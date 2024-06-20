const pool = require("./db");

async function createTables() {
  try {
    const createInvoicesTableQuery = `
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        salesperson_name VARCHAR(255) NOT NULL,
        notes TEXT,
        total_amount INTEGER NOT NULL
      );
    `;

    const createProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INTEGER NOT NULL,
        stock INT NOT NULL,
        image VARCHAR(255)
      );
    `;

    const createInvoiceItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS invoice_items (
        id SERIAL PRIMARY KEY,
        invoice_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price INTEGER NOT NULL,
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
    await pool.query("DELETE FROM invoice_items;");
    await pool.query("DELETE FROM products;");
    await pool.query("DELETE FROM invoices;");
    await pool.query("ALTER SEQUENCE invoices_id_seq RESTART WITH 1;");
    await pool.query("ALTER SEQUENCE products_id_seq RESTART WITH 1;");
    await pool.query("ALTER SEQUENCE invoice_items_id_seq RESTART WITH 1;");

    const createProductsQuery = `
      INSERT INTO products (name, price, stock, image)
      VALUES
      ('Bluetooth speaker', 250000, 100, '/images/1.png'),
      ('Headphone', 150000, 150, '/images/1.png'),
      ('Laptop charger', 300000, 80, '/images/1.png'),
      ('LCD Monitor', 2000000, 50, '/images/1.png'),
      ('Mouse', 50000, 200, '/images/1.png'),
      ('Keyboard', 80000, 180, '/images/1.png'),
      ('Webcam', 400000, 70, '/images/1.png'),
      ('USB Hub', 100000, 90, '/images/1.png'),
      ('Printer', 1200000, 40, '/images/1.png'),
      ('Desk Lamp', 60000, 110, '/images/1.png');
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
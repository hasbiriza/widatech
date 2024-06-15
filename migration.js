const pool = require("./db");
const fs = require("fs");

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

    const createInvoiceItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL,
    item VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    total_cogs INT NOT NULL,
    total_price INT NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    );
`;

    await pool.query(createInvoicesTableQuery);
    await pool.query(createInvoiceItemsTableQuery);
    console.log("Tabel berhasil dibuat");
  } catch (error) {
    console.log("Error creating tables:", error);
  }
}

async function seedData() {
  try {

    await pool.query('DELETE FROM invoice_items');
    await pool.query('DELETE FROM invoices');

    const invoicesQuery = fs.readFileSync("./invoices.sql", "utf-8");
    const invoiceItemsQuery = fs.readFileSync("./invoice_items.sql", "utf8");

    await pool.query(invoicesQuery);
    await pool.query(invoiceItemsQuery);
    console.log("Data berhasil dimasukkan");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}


async function migrate() {
    await createTables();
    await seedData();
}

module.exports = {migrate};

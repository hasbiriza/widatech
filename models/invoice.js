// models/invoice.js
const pool = require("../db");

class Invoice {
  static async create(data) {
    const { date, customer_name, salesperson_name, notes, total_amount, items } = data;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertInvoiceQuery = `
        INSERT INTO invoices (date, customer_name, salesperson_name, notes, total_amount)
        VALUES ($1, $2, $3, $4, $5) RETURNING id;
      `;
      const res = await client.query(insertInvoiceQuery, [date, customer_name, salesperson_name, notes, total_amount]);
      const invoiceId = res.rows[0].id;

      for (const item of items) {
        const { product_id, quantity, price } = item;

        const insertInvoiceItemQuery = `
          INSERT INTO invoice_items (invoice_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4);
        `;
        await client.query(insertInvoiceItemQuery, [invoiceId, product_id, quantity, price]);
      }

      await client.query('COMMIT');
      return invoiceId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAll() {
    const result = await pool.query("SELECT * FROM invoices");
    return result.rows;
  }

  static async getById(id){
    const result = await pool.query("SELECT * FROM invoices WHERE id = $1",[id]);
    return result.rows[0];
  }

  static async getInvoiceWithItems(id) {
    const invoiceResult = await pool.query("SELECT * FROM invoices WHERE id = $1", [id]);
    const itemsResult= await pool.query("SELECT * FROM invoice_items WHERE invoice_id = $1",[id]);
    return {...invoiceResult.rows[0],items: itemsResult.rows};
  }
}

module.exports = { Invoice };

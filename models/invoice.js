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

  static async getPaginated(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const result = await pool.query("SELECT * FROM invoices ORDER BY date DESC LIMIT $1 OFFSET $2", [pageSize, offset]);
    return result.rows;
  }

  static async getByDateRange(startDate, endDate) {
    const result = await pool.query("SELECT * FROM invoices WHERE date BETWEEN $1 AND $2 ORDER BY date DESC", [startDate, endDate]);
    return result.rows;
  }

  static async getRevenueByPeriod(period) {
    let interval;
    switch (period) {
      case 'daily':
        interval = '1 day';
        break;
      case 'weekly':
        interval = '1 week';
        break;
      case 'monthly':
        interval = '1 month';
        break;
      default:
        throw new Error('Invalid period');
    }

    const query = `
      SELECT 
        date_trunc($1, date) AS period,
        SUM(total_amount) AS revenue
      FROM invoices
      GROUP BY period
      ORDER BY period;
    `;
    const result = await pool.query(query, [interval]);
    return result.rows;
  }
}

module.exports = { Invoice };

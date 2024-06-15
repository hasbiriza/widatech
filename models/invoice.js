const pool = require("../db");

class Invoice {
  static async create(invoice, items) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertInvoiceQuery = `
        INSERT INTO invoices (date, customer_name, salesperson_name, notes)
        VALUES ($1, $2, $3, $4) RETURNING id
      `;
      const result = await client.query(insertInvoiceQuery, [
        invoice.date,
        invoice.customer_name,
        invoice.salesperson_name,
        invoice.notes
      ]);
      const invoiceId = result.rows[0].id;

      const insertInvoiceItemsQuery = `
        INSERT INTO invoice_items (invoice_id, item, quantity, total_cogs, total_price)
        VALUES ($1, $2, $3, $4, $5)
      `;

      for (const item of items) {
        await client.query(insertInvoiceItemsQuery, [
          invoiceId,
          item.item,
          item.quantity,
          item.total_cogs,
          item.total_price
        ]);
      }

      await client.query("COMMIT");
      return invoiceId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }


  static async findAll(limit, offset) {
    const query = `
      SELECT invoices.id, date, customer_name, salesperson_name, notes,
      SUM(invoice_items.total_price) as total_amount_paid
      FROM invoices
      LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
      GROUP BY invoices.id
      ORDER BY date DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async count() {
    const query = "SELECT COUNT(*) FROM invoices";
    const result = await pool.query(query);
    return result.rows[0].count;
  }
}






module.exports = Invoice;

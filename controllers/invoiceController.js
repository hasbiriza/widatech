const Invoice = require("../models/invoice");
const pool = require("../db");

exports.createInvoice = async (req, res) => {
    const client = await pool.connect();
    try {
      const { invoice, items } = req.body;
  
      if (!invoice.date || !invoice.customer_name || !invoice.salesperson_name || !items || items.length === 0) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      await client.query('BEGIN');
  
      const insertInvoiceQuery = `
        INSERT INTO invoices (date, customer_name, salesperson_name, notes)
        VALUES ($1, $2, $3, $4) RETURNING id;
      `;
      const invoiceResult = await client.query(insertInvoiceQuery, [invoice.date, invoice.customer_name, invoice.salesperson_name, invoice.notes]);
      const invoiceId = invoiceResult.rows[0].id;
  
      for (const item of items) {
        const { product_id, quantity, total_price } = item;
  
        const insertInvoiceItemQuery = `
          INSERT INTO invoice_items (invoice_id, product_id, quantity, total_price)
          VALUES ($1, $2, $3, $4);
        `;
        await client.query(insertInvoiceItemQuery, [invoiceId, product_id, quantity, total_price]);
  
        const updateProductStockQuery = `
          UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1;
        `;
        const updateResult = await client.query(updateProductStockQuery, [quantity, product_id]);
  
        if (updateResult.rowCount === 0) {
          throw new Error(`Product with id ${product_id} does not have enough stock`);
        }
      }
  
      await client.query('COMMIT');
      res.status(201).json({ message: "Invoice created successfully", invoiceId });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Error creating invoice", error });
    } finally {
      client.release();
    }
  };


exports.getInvoices = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
  
      const invoices = await Invoice.findAll(limit, offset);
      const total = await Invoice.count();
  
      res.status(200).json({
        total,
        page,
        limit,
        invoices
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching invoices", error });
    }
  };

  exports.getInvoiceRevenue = async (req, res) => {
    try {
      const { period } = req.query;
  
      let interval = "day";
      if (period === "weekly") {
        interval = "week";
      } else if (period === "monthly") {
        interval = "month";
      }
  
      const query = `
        SELECT
          date_trunc($1, date) AS period,
          SUM(invoice_items.total_price) AS revenue
        FROM invoices
        LEFT JOIN invoice_items ON invoices.id = invoice_items.invoice_id
        GROUP BY period
        ORDER BY period
      `;
  
      const result = await pool.query(query, [interval]);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invoice revenue", error });
    }
  };
  
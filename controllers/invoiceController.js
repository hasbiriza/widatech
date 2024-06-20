const { Invoice } = require("../models/invoice");

class InvoiceController {
  static async createInvoice(req, res) {
    try {
      const { date, customer_name, salesperson_name, notes, total_amount, items } = req.body;

      if (!date || !customer_name || !salesperson_name || total_amount == null || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const invoiceId = await Invoice.create({ date, customer_name, salesperson_name, notes, total_amount, items });
      res.status(201).json({ message: 'Invoice created successfully', invoiceId });
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAllInvoices(req, res) {
    try {
      const invoices = await Invoice.getAll();
      res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getInvoiceById(req, res) {
    try {
      const id = req.params.id;
      const invoice = await Invoice.getById(id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.status(200).json(invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getInvoiceWithItems(req, res) {
    try {
      const id = req.params.id;
      const invoice = await Invoice.getInvoiceWithItems(id);
      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.status(200).json(invoice);
    } catch (error) {
      console.error("Error fetching invoice with items:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getPaginatedInvoices(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const invoices = await Invoice.getPaginated(page, pageSize);
      res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching paginated invoices:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getInvoicesByDateRange(req, res) {
    try {
      const { start_date, end_date } = req.query;
      const invoices = await Invoice.getByDateRange(start_date, end_date);
      res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching invoices by date range:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getRevenueByPeriod(req, res) {
    try {
      const { period } = req.query;
      if (!period) {
        return res.status(400).json({ error: 'Period is required' });
      }
      const revenueData = await Invoice.getRevenueByPeriod(period);
      res.status(200).json(revenueData);
    } catch (error) {
      console.error("Error fetching revenue by period:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }




}

module.exports = { InvoiceController };

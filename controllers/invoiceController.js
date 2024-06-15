const Invoice = require('../models/invoice');
const InvoiceItem = require('../models/invoiceitem');

const createInvoice = async (req, res) => {
    try {
        const invoiceData = req.body.invoice;
        const items = req.body.items;

        const invoice = await Invoice.create(invoiceData);

        for (let item of items) {
            await InvoiceItem.create({ ...item, invoice_id: invoice.id });
        }

        res.status(201).json({ message: 'Invoice created successfully', invoice });
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error });
    }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const id = req.params.id;
        const invoice = await Invoice.findById(id);
        const items = await InvoiceItem.findAllByInvoiceId(id);
        res.status(200).json({ ...invoice, items });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error });
    }
};

module.exports = { createInvoice, getInvoices, getInvoiceById };

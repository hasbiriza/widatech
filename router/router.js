const express = require('express');
const { ProductController } = require('../controllers/productController');
const { InvoiceController } = require('../controllers/invoiceController');

const router = express.Router();

// Product routes
router.get('/products', ProductController.getAllProducts);
router.get('/products/:id', ProductController.getProductById);

// Invoice routes
router.post('/invoices', InvoiceController.createInvoice);
router.get('/invoices', InvoiceController.getAllInvoices);
router.get('/invoices/:id', InvoiceController.getInvoiceById);
router.get('/invoices/:id/items', InvoiceController.getInvoiceWithItems);

module.exports = router;

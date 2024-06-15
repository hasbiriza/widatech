const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const productController = require("../controllers/productController");

// invoices
router.post("/invoices", invoiceController.createInvoice);
router.get("/invoices", invoiceController.getInvoices);
router.get("/invoices/revenue", invoiceController.getInvoiceRevenue);

// product
router.get("/products", productController.getProducts);
router.get("/products/search", productController.searchProducts);
module.exports = router;

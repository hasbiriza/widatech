const pool = require('../db');

const InvoiceItem = {
    async create(data) {
        const { invoice_id, item, quantity, total_cogs, total_price } = data;
        const result = await pool.query(
            'INSERT INTO invoice_items (invoice_id, item, quantity, total_cogs, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [invoice_id, item, quantity, total_cogs, total_price]
        );
        return result.rows[0];
    },

    async findAllByInvoiceId(invoice_id) {
        const result = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [invoice_id]);
        return result.rows;
    },
};

module.exports = InvoiceItem;

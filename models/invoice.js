const pool = require('../db');

const Invoice = {
    async create(data) {
        const { date, customer_name, salesperson_name, notes } = data;
        const result = await pool.query(
            'INSERT INTO invoices (date, customer_name, salesperson_name, notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [date, customer_name, salesperson_name, notes]
        );
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query('SELECT * FROM invoices');
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);
        return result.rows[0];
    },
};

module.exports = Invoice;

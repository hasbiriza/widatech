const pool = require("../db");

class Product {
  static async findAll() {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
  }

  static async findByName(name) {
    const result = await pool.query("SELECT * FROM products WHERE name ILIKE $1", [`%${name}%`]);
    return result.rows;
  }
}

module.exports = Product;

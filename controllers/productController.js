const { Product } = require("../models/product");

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await Product.getAll();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProductById(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.getById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = { ProductController };

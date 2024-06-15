const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.findByName(name);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching products", error });
  }
};

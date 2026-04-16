import db from "../config/db.js";


// ✅ GET ALL PRODUCTS (with optional search + category filter)
export const getAllProducts = (req, res) => {
  const { search, category } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  let params = [];

  // 🔍 Search filter
  if (search) {
    query += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  // 🧩 Category filter
  if (category && category !== "All") {
    query += " AND category = ?";
    params.push(category);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("❌ Error fetching products:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};


// ✅ GET SINGLE PRODUCT BY ID
export const getProductById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching product:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results[0]);
  });
};


// ✅ ADD NEW PRODUCT (for admin/testing)
export const createProduct = (req, res) => {
  const { name, price, description, category, image, stock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const query = `
    INSERT INTO products (name, price, description, category, image, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, price, description, category, image, stock || 0],
    (err, result) => {
      if (err) {
        console.error("❌ Error creating product:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        message: "✅ Product created",
        productId: result.insertId,
      });
    }
  );
};


// ✅ UPDATE PRODUCT
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, image, stock } = req.body;

  const query = `
    UPDATE products 
    SET name=?, price=?, description=?, category=?, image=?, stock=?
    WHERE id=?
  `;

  db.query(
    query,
    [name, price, description, category, image, stock, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error updating product:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "✅ Product updated" });
    }
  );
};


// ✅ DELETE PRODUCT
export const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting product:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "🗑️ Product deleted" });
  });
};
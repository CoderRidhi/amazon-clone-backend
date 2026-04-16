import db from "../config/db.js";

const USER_ID = 1; // default user


// ✅ GET CART ITEMS
export const getCart = (req, res) => {
  const query = `
    SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(query, [USER_ID], (err, results) => {
    if (err) {
      console.error("❌ Error fetching cart:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};



// ✅ ADD TO CART
export const addToCart = (req, res) => {
  const { product_id } = req.body;

  // check if already exists
  const checkQuery = `
    SELECT * FROM cart WHERE user_id = ? AND product_id = ?
  `;

  db.query(checkQuery, [USER_ID, product_id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      // update quantity
      const updateQuery = `
        UPDATE cart SET quantity = quantity + 1
        WHERE user_id = ? AND product_id = ?
      `;

      db.query(updateQuery, [USER_ID, product_id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Quantity increased" });
      });
    } else {
      // insert new item
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, 1)
      `;

      db.query(insertQuery, [USER_ID, product_id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Item added to cart" });
      });
    }
  });
};



// ✅ UPDATE QUANTITY
export const updateCartItem = (req, res) => {
  const { product_id, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  const query = `
    UPDATE cart SET quantity = ?
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [quantity, USER_ID, product_id], (err) => {
    if (err) {
      console.error("❌ Error updating cart:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Cart updated" });
  });
};



// ✅ REMOVE ITEM FROM CART
export const removeFromCart = (req, res) => {
  const { product_id } = req.params;

  const query = `
    DELETE FROM cart WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [USER_ID, product_id], (err) => {
    if (err) {
      console.error("❌ Error removing item:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Item removed from cart" });
  });
};



// ✅ CLEAR CART (after order)
export const clearCart = (req, res) => {
  const query = `DELETE FROM cart WHERE user_id = ?`;

  db.query(query, [USER_ID], (err) => {
    if (err) {
      console.error("❌ Error clearing cart:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Cart cleared" });
  });
};
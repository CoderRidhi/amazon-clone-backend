import db from "../config/db.js";
import { sendOrderConfirmation } from "../emailService.js";


// ===============================
// ✅ PLACE ORDER (Checkout)
// ===============================
export const placeOrder = (req, res) => {
  const { user_id, items, total_amount, address } = req.body;

  console.log("📦 ORDER REQUEST:", req.body);

  // 🔒 VALIDATION
  if (!user_id) {
    return res.status(400).json({ error: "User not logged in" });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  if (!total_amount) {
    return res.status(400).json({ error: "Total amount missing" });
  }

  // ===============================
  // ✅ INSERT ORDER
  // ===============================
  const orderQuery = `
    INSERT INTO orders (user_id, total_amount, address)
    VALUES (?, ?, ?)
  `;

  db.query(orderQuery, [user_id, total_amount, address], (err, orderResult) => {
    if (err) {
      console.error("❌ Error creating order:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const orderId = orderResult.insertId;

    // ===============================
    // ✅ INSERT ORDER ITEMS
    // ===============================
    const itemQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ?
    `;

    const values = items.map((item) => [
      orderId,
      item.id,
      item.quantity || 1,
      item.price
    ]);

    db.query(itemQuery, [values], (err2) => {
      if (err2) {
        console.error("❌ Error inserting order items:", err2);
        return res.status(500).json({ error: "Database error" });
      }

      // ===============================
      // ✅ FETCH USER EMAIL
      // ===============================
      const userQuery = "SELECT email FROM users WHERE id = ?";

      db.query(userQuery, [user_id], async (err3, userResult) => {
        if (err3) {
          console.log("❌ Error fetching user email:", err3);
        }

        const userEmail = userResult?.[0]?.email;

        // ===============================
        // 📧 SEND EMAIL (NON-BLOCKING)
        // ===============================
        if (userEmail) {
          try {
            await sendOrderConfirmation(userEmail, {
              orderId,
              total_amount,
              address,
              items
            });
          } catch (emailErr) {
            console.log("❌ Email sending failed:", emailErr);
          }
        }

        // ===============================
        // ✅ RESPONSE
        // ===============================
        return res.status(201).json({
          message: "✅ Order placed successfully",
          orderId: orderId
        });
      });
    });
  });
};


// ===============================
// ✅ GET ALL ORDERS
// ===============================
export const getAllOrders = (req, res) => {
  const query = "SELECT * FROM orders ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};


// ===============================
// ✅ GET ORDER BY ID (WITH ITEMS)
// ===============================
export const getOrderById = (req, res) => {
  const { id } = req.params;

  const orderQuery = "SELECT * FROM orders WHERE id = ?";

  db.query(orderQuery, [id], (err, orderResults) => {
    if (err) {
      console.error("❌ Error fetching order:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (orderResults.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResults[0];

    const itemsQuery = `
      SELECT oi.*, p.name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.query(itemsQuery, [id], (err2, itemsResults) => {
      if (err2) {
        console.error("❌ Error fetching order items:", err2);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        order,
        items: itemsResults
      });
    });
  });
};


// ===============================
// ✅ DELETE ORDER
// ===============================
export const deleteOrder = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM orders WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Error deleting order:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "🗑️ Order deleted successfully" });
  });
};

export const getUserOrders = (req, res) => {
  const { userId } = req.params;

  // 1️⃣ Get all orders of user
  const orderQuery = `
    SELECT * 
    FROM orders 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;

  db.query(orderQuery, [userId], (err, orders) => {
    if (err) {
      console.error("❌ Error fetching user orders:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!orders || orders.length === 0) {
      return res.json([]); // no orders
    }

    // 2️⃣ Get order IDs
    const orderIds = orders.map(o => o.id);

    // 3️⃣ Fetch all items for those orders
    const itemsQuery = `
      SELECT oi.*, p.name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (?)
    `;

    db.query(itemsQuery, [orderIds], (err2, items) => {
      if (err2) {
        console.error("❌ Error fetching order items:", err2);
        return res.status(500).json({ error: "Database error" });
      }

      // 4️⃣ Attach items to respective orders
      const ordersWithItems = orders.map(order => {
        return {
          ...order,
          items: items.filter(i => i.order_id === order.id)
        };
      });

      // 5️⃣ RESPONSE
      res.json(ordersWithItems);
    });
  });
};
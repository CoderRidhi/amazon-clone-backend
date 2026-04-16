import nodemailer from "nodemailer";

export const sendOrderConfirmation = async (toEmail, orderDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 🧾 build items HTML
  const itemsHTML = orderDetails.items
    .map(
      (item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `
    )
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `🛒 Order Confirmed #${orderDetails.orderId}`,
    html: `
      <h2>🎉 Order Placed Successfully</h2>

      <p><b>Order ID:</b> ${orderDetails.orderId}</p>
      <p><b>Total Amount:</b> ₹${orderDetails.total_amount}</p>
      <p><b>Delivery Address:</b> ${orderDetails.address}</p>

      <h3>Items:</h3>
      <table border="1" cellpadding="5">
        <tr>
          <th>Product ID</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        ${itemsHTML}
      </table>

      <br/>
      <p>We will notify you when your order is shipped 🚚</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
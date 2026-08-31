import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });
}

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Returns true when a message was actually handed to SMTP.
 *
 * It used to return undefined both when it sent and when it was unconfigured,
 * which made a missing EMAIL_USER indistinguishable from a successful send. A
 * warning is logged instead, so an unconfigured deployment says so in the logs
 * rather than looking like everything worked.
 */
async function send({ to, subject, html }: EmailPayload): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[email] EMAIL_USER / EMAIL_APP_PASSWORD not set. Nothing was sent to " + to
    );
    return false;
  }

  const from = process.env.EMAIL_USER;
  await transporter.sendMail({ from: `El Hilo Co <${from}>`, to, subject, html });
  return true;
}

// ─── Customer: order confirmation ────────────────────────────────────────────

export function sendOrderConfirmation({
  to,
  name,
  orderId,
  items,
  total,
}: {
  to: string;
  name: string;
  orderId: string;
  items: { productType: string; quantity: number; price: number }[];
  total: number;
}) {
  const ref = orderId.slice(0, 8).toUpperCase();
  const rows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee">${i.productType} × ${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return send({
    to,
    subject: `Order Confirmed — El Hilo Co #${ref}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
        <div style="background:#13294b;padding:24px 32px;border-radius:16px 16px 0 0">
          <p style="color:#ffd84d;font-weight:900;font-size:20px;margin:0">EL HILO CO</p>
        </div>
        <div style="background:#fff;padding:32px;border-radius:0 0 16px 16px;border:1px solid #eee">
          <h1 style="font-size:24px;margin:0 0 8px">Order Confirmed!</h1>
          <p style="color:#555;margin:0 0 24px">Hi ${name}, your order has been received. We'll send you a design proof by email shortly.</p>

          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <thead>
              <tr style="background:#f6f6f4">
                <th style="padding:8px;text-align:left">Item</th>
                <th style="padding:8px;text-align:right">Price</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
              <tr>
                <td style="padding:12px 0;font-weight:700;font-size:16px">Total</td>
                <td style="padding:12px 0;font-weight:700;font-size:16px;text-align:right">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top:24px;background:#fff8e7;border-radius:12px;padding:16px;font-size:13px;color:#555">
            <p style="margin:0 0 8px"><strong>What happens next?</strong></p>
            <p style="margin:0 0 4px">✓ Our team will prepare your design proof and email it to you.</p>
            <p style="margin:0 0 4px">✓ Review and approve your proof — or request changes.</p>
            <p style="margin:0">✓ Production begins only after you approve.</p>
          </div>

          <p style="margin-top:24px;font-size:13px;color:#888">
            Questions? Reply to this email or contact us at orders@elhiloco.com
          </p>
        </div>
      </div>
    `,
  });
}

// ─── Admin: new order notification ───────────────────────────────────────────

export function sendAdminNewOrderAlert({
  orderId,
  customerName,
  customerEmail,
  items,
  total,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: { productType: string; quantity: number }[];
  total: number;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return Promise.resolve();

  const ref = orderId.slice(0, 8).toUpperCase();
  const itemList = items.map((i) => `${i.productType} × ${i.quantity}`).join(", ");

  return send({
    to: adminEmail,
    subject: `New Order #${ref} — ${customerName} — $${total.toFixed(2)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto">
        <h2 style="margin:0 0 16px">New Order Received</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#555">Order</td><td style="font-weight:700">#${ref}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Customer</td><td>${customerName}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Email</td><td>${customerEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Items</td><td>${itemList}</td></tr>
          <tr><td style="padding:6px 0;color:#555">Total</td><td style="font-weight:700">$${total.toFixed(2)}</td></tr>
        </table>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/orders/${orderId}"
           style="display:inline-block;margin-top:20px;background:#13294b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">
          View Order in Admin
        </a>
      </div>
    `,
  });
}

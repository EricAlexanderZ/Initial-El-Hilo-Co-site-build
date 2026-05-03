import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { name, email, subject, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (user && pass) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `El Hilo Co Contact Form <${user}>`,
      to: user,
      replyTo: `${name} <${email}>`,
      subject: `Contact Form — ${subject || "New Message"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
          <h2 style="margin:0 0 16px">New Contact Form Submission</h2>
          <table style="width:100%;font-size:14px;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#555;width:80px">Name</td><td style="font-weight:700">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#555">Email</td><td>${email}</td></tr>
            <tr><td style="padding:6px 0;color:#555">Subject</td><td>${subject || "—"}</td></tr>
          </table>
          <div style="margin-top:16px;background:#f6f6f4;border-radius:8px;padding:16px;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</div>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true });
}

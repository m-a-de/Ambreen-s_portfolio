import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENQUIRY_LABELS = {
  general: "General Enquiry",
  individual: "Individual Therapy",
  couples: "Couples Therapy",
  assessment: "Assessment & Consultation",
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeaderValue(value) {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function isTruthyPrivacy(value) {
  return value === true || value === "true" || value === "on" || value === "1";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const enquiryType =
      typeof body.enquiryType === "string" ? body.enquiryType.trim() : "general";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const honeypot =
      typeof body.website === "string" ? body.website.trim() : "";
    const turnstileToken =
      typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileToken || !turnstileSecret) {
      return NextResponse.json(
        { error: "Human verification failed. Please try again." },
        { status: 400 }
      );
    }

    const turnstileVerifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      }
    );
    const turnstileResult = await turnstileVerifyResponse.json().catch(() => ({}));

    if (turnstileResult.success !== true) {
      return NextResponse.json(
        { error: "Human verification failed. Please try again." },
        { status: 400 }
      );
    }

    if (!name || !email || !message || !isTruthyPrivacy(body.privacy)) {
      return NextResponse.json(
        {
          error:
            "Please fill out all required fields and agree to the privacy statement.",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } =
      process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
      console.error("Contact API is missing SMTP environment variables.");
      return NextResponse.json(
        { error: "Email is not configured. Please try again later." },
        { status: 500 }
      );
    }

    const port = Number(SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const enquiryLabel = ENQUIRY_LABELS[enquiryType] || enquiryType;
    const safeName = sanitizeHeaderValue(name);
    const safeEmail = sanitizeHeaderValue(email);
    const phoneDisplay = phone || "Not provided";

    await transporter.sendMail({
      from: SMTP_USER,
      to: CONTACT_TO,
      replyTo: safeEmail,
      subject: `New website enquiry from ${safeName} (${enquiryLabel})`,
      text: [
        `Name: ${safeName}`,
        `Email: ${safeEmail}`,
        `Phone: ${phoneDisplay}`,
        `Enquiry type: ${enquiryLabel}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phoneDisplay)}</p>
        <p><strong>Enquiry type:</strong> ${escapeHtml(enquiryLabel)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again later." },
      { status: 500 }
    );
  }
}

// app/api/auth/send-verification/route.ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import nodemailer from "nodemailer";
import validator from "validator";

export async function POST(request: Request) {
  try {
    const { email, walletAddress } = await request.json();

    // Validate email
    if (!email || !validator.isEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const { rows: existingUsers } = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0 && existingUsers[0].email_verified) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Delete any existing codes for this email
    await sql`
      DELETE FROM verification_codes WHERE email = ${email}
    `;

    // Store the code in the database
    await sql`
      INSERT INTO verification_codes (email, code, expires_at)
      VALUES (${email}, ${verificationCode}, ${expiresAt.toISOString()})
    `;

    // Send the verification email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: process.env.EMAIL_SERVER_PORT === "465",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email address",
      text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email address</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f0f0f0; padding: 10px; text-align: center;">${verificationCode}</h1>
          <p>This code will expire in 15 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { message: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
// app/api/auth/verify-code/route.ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const { email, code, walletAddress, embeddedWallet } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Check if the code exists and is valid
    const { rows: codes } = await sql`
      SELECT * FROM verification_codes 
      WHERE email = ${email} 
      AND code = ${code} 
      AND expires_at > NOW() 
      AND used = FALSE
    `;

    if (codes.length === 0) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Mark the code as used
    await sql`
      UPDATE verification_codes 
      SET used = TRUE 
      WHERE email = ${email} AND code = ${code}
    `;

    // Check if the user already exists
    const { rows: existingUsers } = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      // Update existing user
      await sql`
        UPDATE users 
        SET email_verified = TRUE, 
            wallet_address = COALESCE(${walletAddress}, wallet_address)
        WHERE email = ${email}
      `;
    } else {
      // Create new user
      await sql`
        INSERT INTO users (
          email, 
          wallet_address, 
          email_verified, 
          is_testator, 
          is_beneficiary
        ) VALUES (
          ${email}, 
          ${walletAddress}, 
          TRUE, 
          FALSE, 
          TRUE
        )
      `;
    }

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { message: "Failed to verify email" },
      { status: 500 }
    );
  }
}
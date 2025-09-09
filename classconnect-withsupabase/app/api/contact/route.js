/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/contact/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    const data = await resend.emails.send({
      from: "Contact Form <team@contact.classconnectla.com>",
      to: "team@traunico.com",
      subject: "New Contact Form Submission",
      replyTo: email,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    // console.log("Resend response:", data); // <--- Log what Resend says

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

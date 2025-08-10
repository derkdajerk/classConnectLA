import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.search; // includes leading ? if present
  return NextResponse.redirect(new URL(`/confirm${search}`, request.url));
}

"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function ContactForm() {
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent!");
        form.reset();
      } else {
        setStatus("Something went wrong. Try again.");
      }
    } catch {
      setStatus("Network error. Try again.");
    }
  };

  const handleClear = () => {
    const nameInput = document.getElementById(
      "name"
    ) as HTMLInputElement | null;
    if (nameInput) nameInput.value = "";

    const emailInput = document.getElementById(
      "email"
    ) as HTMLInputElement | null;
    if (emailInput) emailInput.value = "";

    const messageInput = document.getElementById(
      "message"
    ) as HTMLTextAreaElement | null;
    if (messageInput) messageInput.value = "";
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 via-white to-pink-100 px-6 py-12">
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold text-2xl text-gray-800 hover:text-purple-600 transition-all duration-200 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/30"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            ClassConnectLA
          </Link>
        </div>
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">
            Contact Us
          </h1>

          <p className="text-center mb-8 text-gray-700">
            Reach us anytime at{" "}
            <a
              href="mailto:team@classconnectla.com"
              className="text-purple-600 underline"
            >
              team@classconnectla.com
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Adam Sandler"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="adam@sandler.com"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {/* Message */}
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                id="message"
                placeholder="Hello!"
                required
                rows={5}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {status === "sending" ? "Sending..." : "Send"}
              </Button>
              <Button
                type="button"
                onClick={() => handleClear()}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-black"
              >
                Clear
              </Button>
            </div>
            <p>{status}</p>
          </form>
        </div>
      </main>
      <footer className="w-full hidden md:flex items-center justify-center border-t mx-auto text-center text-muted-foreground text-sm gap-8 py-4 mt-auto">
        <p>
          Contact:{" "}
          <a href="mailto:derek@derektrauner.com" className="">
            derek@derektrauner.com
          </a>
          <br />© 2025 Traunico, LLC. All rights reserved.
        </p>
        <ThemeSwitcher />
      </footer>
    </>
  );
}

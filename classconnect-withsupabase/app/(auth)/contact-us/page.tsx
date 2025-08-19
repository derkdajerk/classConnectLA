"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    captcha: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    // Type guard: check if target has 'checked' property (it's an input)
    const isCheckbox = "checked" in target && type === "checkbox";

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.captcha) {
      alert("Please verify the captcha.");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
          captcha: false,
        });
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const handleClear = () => {
    setForm({ name: "", email: "", subject: "", message: "", captcha: false });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 via-white to-pink-100 px-6 py-12">
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
              value={form.name}
              onChange={handleChange}
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
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-gray-700 mb-2">
              Subject (optional)
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Captcha */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="captcha"
              checked={form.captcha}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-gray-700">I’m not a robot</label>
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
              onClick={handleClear}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black"
            >
              Clear
            </Button>
          </div>

          {status === "sent" && (
            <p className="text-green-600 mt-4 text-center">
              Message sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 mt-4 text-center">
              Something went wrong. Try again.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

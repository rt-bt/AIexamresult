"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Contact Us</h1>
              <p className="mt-2 text-gray-500">Have a question or feedback? We&apos;d love to hear from you.</p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid gap-4 mb-8">
              <div className="rounded-2xl bg-white p-5 shadow-lg border border-gray-100 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100">
                  <Phone className="h-5 w-5 text-teal-600" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Phone</p>
                  <a href="tel:+918969799697" className="text-base font-bold text-gray-800 hover:text-teal-600 transition">
                    +91 89697 99697
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-lg border border-gray-100 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  <Mail className="h-5 w-5 text-orange-600" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Email</p>
                  <a href="mailto:info@aiexamresult.com" className="text-base font-bold text-gray-800 hover:text-orange-600 transition break-all">
                    info@aiexamresult.com
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-lg border border-gray-100 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Location</p>
                  <p className="text-base font-bold text-gray-800">India</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Send us a Message</h2>
              <p className="text-sm text-gray-400 mb-6">Fill the form below and we&apos;ll get back to you.</p>

              {status === "sent" ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-emerald-700">Message Sent!</p>
                  <p className="text-sm text-emerald-600 mt-1">We&apos;ll reply within 24-48 hours.</p>
                  <button onClick={() => setStatus("idle")} className="mt-3 text-sm font-semibold text-emerald-700 hover:underline">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                        placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                        placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                      placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition resize-none"
                      placeholder="Write your message here..." />
                  </div>

                  {status === "error" && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Failed to send. Please email directly at info@aiexamresult.com
                    </div>
                  )}

                  <button type="submit" disabled={status === "sending"}
                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-teal-500 hover:to-teal-400 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
                    {status === "sending" ? "Sending..." : <>Send Message <Send className="h-4 w-4" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
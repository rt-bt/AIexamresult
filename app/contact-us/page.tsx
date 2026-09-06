"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Mail, Phone, Clock, Send, CheckCircle2, AlertCircle, MapPin, Headphones, HelpCircle } from "lucide-react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "General Query", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setStatusMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");

      setStatus("success");
      setStatusMsg("Thank you! Your message has been sent successfully. Our support team will get back to you within 24-48 hours.");
      setFormData({ name: "", email: "", phone: "", subject: "General Query", message: "" });
    } catch (err: any) {
      setStatus("error");
      setStatusMsg(err.message || "An error occurred. Please try again or email us directly at contact@aiexamresult.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pb-16">
        {/* Header Banner */}
        <section className="bg-slate-900 text-white py-14 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" /> Support & Help Desk
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Contact Us</h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Have questions regarding an exam notification, result update, or feedback? We are here to help.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 -mt-8 grid md:grid-cols-[1fr_360px] gap-8">
          {/* Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Send Us a Message</h2>
              <p className="text-xs text-slate-500 mt-1">Fill out the form below and our helpdesk team will respond promptly.</p>
            </div>

            {status === "success" && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{statusMsg}</p>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{statusMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Your Full Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Topic / Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Exam Result Enquiry">Exam Result Enquiry</option>
                    <option value="Admit Card / Job Update Notice">Admit Card / Job Update Notice</option>
                    <option value="Correction Request">Correction Request</option>
                    <option value="Advertising & Partnership">Advertising & Partnership</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Your Message <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message or enquiry here..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-700 transition shadow-lg shadow-teal-600/20 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending Message..." : "Submit Message"}
              </button>
            </form>
          </div>

          {/* Sidebar Contact Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-teal-600">Official Contact Details</h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">General Enquiries</p>
                    <a href="mailto:contact@aiexamresult.com" className="text-teal-600 font-mono font-bold hover:underline">contact@aiexamresult.com</a>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Student Helpdesk</p>
                    <a href="mailto:help@aiexamresult.com" className="text-teal-600 font-mono font-bold hover:underline">help@aiexamresult.com</a>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Helpline Phone</p>
                    <a href="tel:+918969799697" className="text-teal-600 font-mono font-bold hover:underline">+91 8969799697</a>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Support Hours</p>
                    <p className="text-slate-600 mt-0.5">Monday - Saturday (9:00 AM - 7:00 PM IST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Important Note for Candidates</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                All India Exam Result is an independent recruitment news portal. We do not issue hall tickets, admit cards, or conduct examinations. For official document issues, please contact the respective board or commission directly.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { setError("Invalid credentials"); setLoading(false); return; }
      router.push("/admin/dashboard");
    } catch { setError("Something went wrong"); setLoading(false); }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-6 shadow-glow">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0D9488] text-white">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-3xl font-black text-ink">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">Secure dashboard for editorial, SEO and AI publishing workflows.</p>
        {error && <p className="mt-3 text-sm font-bold text-red-500">{error}</p>}
        <label className="mt-6 block text-sm font-bold">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0D9488]" placeholder="admin@aiexamresult.com" required />
        <label className="mt-4 block text-sm font-bold">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0D9488]" placeholder="••••••••" required />
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-[#0D9488] px-4 py-3 font-black text-white transition hover:bg-[#0F766E] disabled:opacity-50">
          {loading ? "Signing in..." : "Sign in securely"}
        </button>
      </form>
    </main>
  );
}

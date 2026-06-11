import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="text-8xl font-black text-slate-200">404</p>
          <h1 className="mt-4 text-3xl font-black text-slate-800">Page not found</h1>
          <p className="mx-auto mt-2 max-w-md text-slate-500">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0F766E]">
              <Home className="h-4 w-4" /> Go Home
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-brand hover:text-brand">
              <Search className="h-4 w-4" /> Search Site
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { StateGrid } from "@/components/site/state-grid";

export default function StateIndexPage() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-gradient-to-br from-[#4F46E5] via-[#0D9488] to-[#115E59] py-12">
          <div className="container-page">
            <h1 className="text-3xl font-black text-white sm:text-4xl">State-wise Exam Results & Jobs</h1>
            <p className="mt-2 text-white/70">Find government jobs, results and admit cards by state</p>
          </div>
        </div>
        <StateGrid />
      </main>
      <Footer />
    </>
  );
}

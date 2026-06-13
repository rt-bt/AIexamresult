import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-2 text-gray-500">Have a question or feedback? We&apos;d love to hear from you.</p>
            <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg border border-gray-100 text-left space-y-5">
              <p className="text-sm text-gray-600">
                For queries related to exam results, technical issues, or content corrections, please email us.
              </p>
              <div className="rounded-xl bg-teal-50 border border-teal-200 p-4">
                <p className="text-sm font-medium text-teal-800">Email:</p>
                <a href="mailto:support@aiexamresult.com" className="text-sm text-teal-600 hover:underline">support@aiexamresult.com</a>
              </div>
              <p className="text-xs text-gray-400">
                We reply within 24-48 hours. For official exam queries, please contact the respective government department directly.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

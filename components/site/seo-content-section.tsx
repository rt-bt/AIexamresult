import Link from "next/link";
import { Award, BookOpen, CheckCircle2, FileText, Globe, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

export function SeoContentSection() {
  return (
    <section className="border-t border-slate-200/80 bg-slate-50/60 py-14 text-slate-700">
      <div className="container-page">
        {/* Main Section Header */}
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0D9488] ring-1 ring-[#0D9488]/20">
            <Sparkles className="h-3.5 w-3.5" /> India's No. 1 Sarkari Result &amp; Job Alert Portal
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Sarkari Result 2026 : Sarkari Exam, Sarkari Naukri &amp; Rojgar Result
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
            Welcome to <strong>All India Exam Result (AIExamResult.com)</strong>, your fastest and most reliable portal for 
            <strong> Sarkari Result 2026</strong>, <strong>Sarkari Exam</strong> notifications, <strong>Sarkari Naukri (Government Jobs)</strong> online forms, 
            <strong> Admit Cards</strong>, <strong>Answer Keys</strong>, and <strong>Board Exam Results</strong>. We aggregate and verify notifications directly from official 
            government departments such as SSC, UPSC, Railway Recruitment Board (RRB), IBPS, State PSCs, Police Recruitment Boards, and Education Boards across India.
          </p>
        </div>

        {/* 4 Feature Badges */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: ShieldCheck, title: "100% Verified", desc: "Direct official website links & PDFs" },
            { icon: Sparkles, title: "Real-time Sync", desc: "Updated every 30 minutes" },
            { icon: Globe, title: "All India Coverage", desc: "Central & all 28 State Govt jobs" },
            { icon: Award, title: "Free Alerts", desc: "Instant push & email notifications" },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <item.icon className="h-5 w-5 text-[#0D9488]" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h3>
              </div>
              <p className="mt-1 text-[11px] sm:text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Category Breakdown Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Latest Jobs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#4F46E5]">
              <Award className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">Latest Sarkari Naukri (Online Form) 2026</h3>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
              Find the newest <Link href="/latest-jobs" className="font-semibold text-[#4F46E5] hover:underline">Sarkari Naukri 2026</Link> notifications for 
              10th Pass, 12th Pass, ITI, Diploma, Graduate, and Post Graduate candidates. Access online application forms, eligibility criteria, age limits, 
              application fees, and last dates to apply for SSC, Railway RRB, Banking, Defence, Teaching, and State Police vacancies.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
              {["SSC CGL", "Railway RRB NTPC", "UPSC IAS", "IBPS PO", "UP Police", "Bihar Police"].map((tag) => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Admit Cards */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#EA580C]">
              <FileText className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">Sarkari Admit Card &amp; Hall Ticket 2026</h3>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
              Download your <Link href="/admit-card" className="font-semibold text-[#EA580C] hover:underline">Sarkari Admit Card 2026</Link> with direct 
              official login links. Check exam dates, exam city intimation slips, roll numbers, and exam center reporting instructions for Tier 1, Tier 2, Mains, 
              and interview stages of competitive exams across India.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
              {["SSC GD Admit Card", "RRB Group D Hall Ticket", "CTET Admit Card", "NEET Hall Ticket", "UPTET Admit Card"].map((tag) => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition">
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#0D9488]">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">Sarkari Exam Result &amp; Scorecard 2026</h3>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
              Check all official <Link href="/results" className="font-semibold text-[#0D9488] hover:underline">Sarkari Results 2026</Link> instantly. 
              View roll-number-wise merit lists, qualifying cut-off marks, candidate scorecards, and final selection lists for central recruitment, 
              state government exams, and board examinations like CBSE, BSEB Bihar Board, and UP Board.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
              {["SSC CHSL Result", "RRB NTPC Result", "Bihar Board 10th", "UP Board 12th", "BPSC Result"].map((tag) => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-600 transition">
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Answer Key */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#7C3AED]">
              <BookOpen className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">Official Answer Key &amp; Objections 2026</h3>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
              Download official provisional and final <Link href="/answer-key" className="font-semibold text-[#7C3AED] hover:underline">Sarkari Answer Keys 2026</Link>. 
              Calculate your raw marks, check candidate response sheets, and find direct links to raise official answer key objections before the deadline.
            </p>
          </div>

          {/* Syllabus & Exam Pattern */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#D97706]">
              <FileText className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">Syllabus &amp; Exam Pattern PDF</h3>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
              Download complete, updated <Link href="/syllabus" className="font-semibold text-[#D97706] hover:underline">Sarkari Exam Syllabus 2026</Link> in PDF format. 
              Understand subject-wise mark weightage, negative marking rules, physical fitness tests (PET/PST), and selection stages to maximize your score.
            </p>
          </div>

          {/* Admissions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#E11D48]">
              <GraduationCap className="h-5 w-5" />
              <h3 className="text-base font-bold text-slate-900">University Admissions &amp; Entrance 2026</h3>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
              Get timely notifications on <Link href="/admissions" className="font-semibold text-[#E11D48] hover:underline">Sarkari Admissions 2026</Link> including 
              CUET UG/PG, NTA NEET, JEE Main, ITI, Polytechnic, B.Ed counseling, and state university admission application forms.
            </p>
          </div>
        </div>

        {/* State-wise Sarkari Result Quick Matrix */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            State-Wise Sarkari Result &amp; Sarkari Naukri 2026
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Quickly navigate to state-specific government recruitment portals and exam results:
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-semibold">
            {[
              { name: "UP Sarkari Result", slug: "uttar-pradesh" },
              { name: "Bihar Sarkari Result", slug: "bihar" },
              { name: "Rajasthan Jobs", slug: "rajasthan" },
              { name: "MP Sarkari Result", slug: "madhya-pradesh" },
              { name: "Delhi DSSSB Jobs", slug: "delhi" },
              { name: "Haryana SSC Jobs", slug: "haryana" },
              { name: "Jharkhand JSSC", slug: "jharkhand" },
              { name: "West Bengal Jobs", slug: "west-bengal" },
              { name: "Maharashtra MPSC", slug: "maharashtra" },
              { name: "Punjab PPSC Jobs", slug: "punjab" },
              { name: "Uttarakhand UKSSSC", slug: "uttarakhand" },
              { name: "Chhattisgarh CGPSC", slug: "chhattisgarh" },
            ].map((st) => (
              <Link
                key={st.slug}
                href={`/state/${st.slug}`}
                className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-center text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition"
              >
                {st.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Sarkari Recruitment Boards */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Popular Recruitment Boards in India
          </h3>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            {[
              { name: "SSC (Staff Selection Commission)", slug: "ssc" },
              { name: "UPSC (Union Public Service Commission)", slug: "upsc" },
              { name: "RRB (Railway Recruitment Board)", slug: "railway" },
              { name: "IBPS (Institute of Banking Personnel Selection)", slug: "banking" },
              { name: "State Police Recruitment", slug: "state-govt-jobs" },
              { name: "Defence & Armed Forces (Army, Navy, Air Force)", slug: "defence-exams" },
              { name: "Teaching Eligibility (CTET, State TET)", slug: "teaching-exams" },
              { name: "Board Exam Results (CBSE, UPMSP, BSEB)", slug: "board-exams" },
            ].map((board) => (
              <Link
                key={board.slug}
                href={`/exam/${board.slug}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition"
              >
                {board.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

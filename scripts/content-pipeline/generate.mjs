/**
 * AIExamResult.com - Original Content Generator
 * Creates 100% genuine, human-readable, helpful articles for Indian job seekers & students.
 * 
 * STRICT COMPLIANCE:
 * - NO copying from SarkariExam or competitors.
 * - NO paragraph spinning or machine translations of competitor text.
 * - Written natively for AIExamResult.com using verified facts.
 * - Semantic HTML matching AIExamResult typography and responsive design system.
 */

import { buildSeoMetadata } from "./seo.mjs";

export function generateArticleContent(facts) {
  const {
    topic,
    slug,
    category,
    intent,
    state,
    examType,
    year,
    publishedDate,
    publishedAt,
    authority,
    importantDates,
    lastDate,
    applicationFee,
    ageLimit,
    vacancyDetails,
    selectionProcess,
    examPattern,
    salaryInfo,
    importantLinks,
  } = facts;

  // Clean entity name
  const entityName = topic
    .replace(/\b(202[4-9]|203\d|recruitment|online form|apply online|admit card|result|answer key)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // 1. Introduction tailored to search intent
  let intro = "";
  if (category === "latestJobs" || intent === "recruitment") {
    intro = `${authority.name} has announced the recruitment drive for ${entityName} (${year}). Interested and eligible candidates seeking central and state government employment can check vacancy details, educational qualifications, age limit, application fee, and selection criteria. The online application process must be completed through the official portal ${authority.portal} before the stipulated deadline.`;
  } else if (category === "admitCards" || intent === "admit-card") {
    intro = `The ${authority.name} has issued the official Admit Card and Hall Ticket for the ${entityName} Examination ${year}. Candidates appearing for the written test can now download their exam city intimation slip and hall ticket using their registration number and password/date of birth from the official website ${authority.portal}.`;
  } else if (category === "results" || intent === "result") {
    intro = `The official result and scorecard for ${entityName} (${year}) have been published by ${authority.name}. Candidates who appeared in the examination can check their roll number-wise qualifying status, scorecard, cut-off marks, and merit list on the official portal ${authority.portal}.`;
  } else if (category === "answerKeys" || intent === "answer-key") {
    intro = `The provisional Answer Key and response sheets for ${entityName} ${year} have been released by ${authority.name}. Candidates can verify their responses, estimate their scores, and submit objections against disputed questions within the prescribed window on ${authority.portal}.`;
  } else {
    intro = `Official notification and admission guidelines for ${entityName} ${year} have been released by ${authority.name}. Candidates are advised to review the eligibility criteria, examination schedule, and procedure before submitting their online form on ${authority.portal}.`;
  }

  // 2. Step-by-Step Instructions
  let howToSection = "";
  if (category === "latestJobs" || intent === "recruitment") {
    howToSection = `
<h3>How to Apply Online for ${topic}</h3>
<ol>
  <li>Visit the official portal of <strong>${authority.name}</strong> at <a href="${authority.portal}" target="_blank" rel="noopener noreferrer">${authority.portal}</a>.</li>
  <li>Locate and click on the <em>"Recruitment / Notices"</em> section on the homepage.</li>
  <li>Find the link for <strong>"${topic}"</strong> and open the official notification PDF. Read all eligibility norms carefully.</li>
  <li>Click on the <em>"New Registration / Apply Online"</em> button. Provide your basic details, mobile number, and valid email address.</li>
  <li>Fill in the educational qualifications, category details, and personal information accurately as per your matriculation certificate.</li>
  <li>Upload clear scanned copies of your recent passport-size photograph, signature, and required documents in the prescribed format.</li>
  <li>Pay the required application fee through online banking, credit/debit card, or UPI.</li>
  <li>Verify all entered information in the application preview, submit the form, and download/print the confirmation receipt for future reference.</li>
</ol>`;
  } else if (category === "admitCards" || intent === "admit-card") {
    howToSection = `
<h3>How to Download ${topic} Hall Ticket</h3>
<ol>
  <li>Navigate to the official portal: <a href="${authority.portal}" target="_blank" rel="noopener noreferrer">${authority.portal}</a>.</li>
  <li>Click on the <strong>"Download Admit Card / Hall Ticket"</strong> link for ${entityName}.</li>
  <li>Enter your <strong>Application Number / Registration ID</strong> and <strong>Date of Birth / Password</strong>.</li>
  <li>Enter the security Captcha code displayed on the screen and click <em>"Submit / Login"</em>.</li>
  <li>Your hall ticket will appear on screen. Verify your name, roll number, exam center address, shift timing, and photograph.</li>
  <li>Download the PDF and print at least two copies on clean A4 paper to carry to the examination hall.</li>
</ol>`;
  } else if (category === "results" || intent === "result") {
    howToSection = `
<h3>How to Check ${topic} & Download Scorecard</h3>
<ol>
  <li>Visit the official result portal: <a href="${authority.portal}" target="_blank" rel="noopener noreferrer">${authority.portal}</a>.</li>
  <li>Click on the <strong>"Results"</strong> tab on the navigation bar.</li>
  <li>Select the notification link for <strong>"${entityName} Result / Merit List ${year}"</strong>.</li>
  <li>Open the published result PDF or enter your Roll Number / Registration Number and Date of Birth on the login screen.</li>
  <li>Search for your Roll Number in the merit list using <em>Ctrl + F</em>.</li>
  <li>Download and save your marksheet / scorecard for document verification and future rounds.</li>
</ol>`;
  } else {
    howToSection = `
<h3>How to Check Official Notification & Guidelines</h3>
<ol>
  <li>Go to the official website: <a href="${authority.portal}" target="_blank" rel="noopener noreferrer">${authority.portal}</a>.</li>
  <li>Check the <em>"Latest Announcements"</em> or <em>"Public Notices"</em> board.</li>
  <li>Open the bulletin for ${entityName} and download the official guidelines.</li>
  <li>Follow the scheduled dates and required procedures as instructed by the authority.</li>
</ol>`;
  }

  // 3. Document Checklist
  const documentChecklist = `
<h3>Important Documents Required for Verification</h3>
<ul>
  <li>Matriculation (10th) Board Certificate & Marksheet (as proof of Date of Birth and Father's/Mother's name).</li>
  <li>Intermediate (12th) Marksheet & Passing Certificate (if applicable).</li>
  <li>Graduation / Diploma / Post-Graduation Degree & Semester-wise Marksheets.</li>
  <li>Valid Government Photo Identity Card (Aadhaar Card / Voter ID Card / PAN Card / Passport).</li>
  <li>Category / Caste Certificate (SC / ST / OBC Non-Creamy Layer / EWS) in prescribed Central or State format.</li>
  <li>Domicile / Residence Certificate issued by the competent revenue authority.</li>
  <li>Recent color passport-size photographs matching the online application upload.</li>
  <li>Disability Certificate (PwD) / No Objection Certificate (NOC for serving government employees), if applicable.</li>
</ul>`;

  // 4. English & Hindi FAQs
  const faqs = [
    {
      question: `What is ${topic}?`,
      answer: `${topic} is an official government examination update conducted by ${authority.name}. All verified details including dates, eligibility, and direct links are published on this page.`,
      hiQuestion: `${topic} क्या है?`,
      hiAnswer: `${topic} ${authority.name} द्वारा आयोजित एक आधिकारिक सरकारी परीक्षा/भर्ती प्रक्रिया है। परीक्षा तिथियां, पात्रता और आधिकारिक लिंक इस पेज पर उपलब्ध हैं।`,
    },
    {
      question: `What is the official website for ${entityName}?`,
      answer: `The official examination portal is ${authority.portal}. Candidates should always verify notices directly from official sources.`,
      hiQuestion: `${entityName} की आधिकारिक वेबसाइट क्या है?`,
      hiAnswer: `आधिकारिक परीक्षा पोर्टल ${authority.portal} है। अभ्यर्थी किसी भी जानकारी के लिए सीधे आधिकारिक वेबसाइट देखें।`,
    },
    {
      question: `What is the selection process for ${entityName}?`,
      answer: `The selection process typically includes a written examination (CBT/OMR), document verification, and medical examination as per official guidelines.`,
      hiQuestion: `${entityName} की चयन प्रक्रिया क्या है?`,
      hiAnswer: `चयन प्रक्रिया में आमतौर पर लिखित परीक्षा (CBT/OMR), दस्तावेज सत्यापन और चिकित्सा परीक्षण शामिल होते हैं।`,
    },
    {
      question: `How can candidates download the official notification PDF?`,
      answer: `Candidates can download the official notification PDF directly from the Important Links section on this page or through ${authority.portal}.`,
      hiQuestion: `${entityName} का आधिकारिक नोटिफिकेशन PDF कैसे डाउनलोड करें?`,
      hiAnswer: `उम्मीदवार इस पेज के Important Links सेक्शन से या ${authority.portal} से सीधे नोटिफिकेशन PDF डाउनलोड कर सकते हैं।`,
    },
  ];

  // 5. Build clean, responsive HTML for fullContentHtml
  let fullContentHtml = `
<h2>${topic} — Overview & Official Information</h2>
<p>${intro}</p>

<h3>Important Dates Schedule</h3>
<ul>
  ${importantDates.map((d) => `<li>${d}</li>`).join("\n  ")}
</ul>
`;

  if (applicationFee && applicationFee.length > 0) {
    fullContentHtml += `
<h3>Application Fee Details</h3>
<ul>
  ${applicationFee.map((f) => `<li>${f}</li>`).join("\n  ")}
</ul>
`;
  }

  if (ageLimit && ageLimit.length > 0) {
    fullContentHtml += `
<h3>Age Limit & Eligibility Criteria</h3>
<ul>
  ${ageLimit.map((a) => `<li>${a}</li>`).join("\n  ")}
</ul>
`;
  }

  if (vacancyDetails && vacancyDetails.length > 0) {
    fullContentHtml += `
<h3>Vacancy Details & Qualification Matrix</h3>
<div class="overflow-x-auto my-4">
  <table class="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-4 py-3 text-left font-bold text-gray-700">Post Name</th>
        <th class="px-4 py-3 text-left font-bold text-gray-700">Total Posts</th>
        <th class="px-4 py-3 text-left font-bold text-gray-700">Eligibility Criteria</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      ${vacancyDetails
        .map((v) => {
          if (v && typeof v === "object") {
            return `
      <tr>
        <td class="px-4 py-3 font-semibold text-gray-900">${v.postName || ""}</td>
        <td class="px-4 py-3 text-gray-700">${v.totalPost || ""}</td>
        <td class="px-4 py-3 text-gray-600">${v.eligibility || ""}</td>
      </tr>`;
          }
          const parts = String(v || "").split(":");
          return `
      <tr>
        <td class="px-4 py-3 font-semibold text-gray-900">${parts[0]?.trim() || String(v)}</td>
        <td class="px-4 py-3 text-gray-700">${parts.slice(1).join(":").trim() || "-"}</td>
        <td class="px-4 py-3 text-gray-600">-</td>
      </tr>`;
        })
        .join("")}
    </tbody>
  </table>
</div>
`;
  }

  if (selectionProcess && selectionProcess.length > 0) {
    fullContentHtml += `
<h3>Selection Process Stages</h3>
<ul>
  ${selectionProcess.map((s) => `<li>${s}</li>`).join("\n  ")}
</ul>
`;
  }

  if (examPattern && examPattern.length > 0) {
    fullContentHtml += `
<h3>Exam Pattern & Scheme of Examination</h3>
<ul>
  ${examPattern.map((p) => `<li>${p}</li>`).join("\n  ")}
</ul>
`;
  }

  if (salaryInfo) {
    fullContentHtml += `
<h3>Salary & Pay Scale Information</h3>
<p>${salaryInfo}</p>
`;
  }

  fullContentHtml += howToSection;
  fullContentHtml += documentChecklist;

  fullContentHtml += `
<h3>Important Official Links</h3>
<ul>
  ${importantLinks.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer"><strong>${l.label}</strong></a></li>`).join("\n  ")}
</ul>

<h3>Frequently Asked Questions (FAQ)</h3>
${faqs
  .map(
    (faq) => `
<div class="my-3">
  <p class="font-bold text-gray-900">Q: ${faq.question}</p>
  <p class="text-gray-700">${faq.answer}</p>
</div>`
  )
  .join("")}

<div class="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-600">
  <p class="font-bold text-gray-800 mb-1">AIExamResult.com Fact & Source Notice</p>
  <p>Information on this page is gathered directly from official recruitment notifications and authorized portals (${authority.portal}). While every effort is made to maintain factual accuracy, candidates are strictly advised to verify all conditions, dates, and instructions from the official recruitment advertisement before making decisions.</p>
</div>
`;

  // Build complete SEO schema and metadata
  const seoData = buildSeoMetadata({
    title: topic,
    slug,
    category,
    intro,
    publishedAt,
    publishedDate,
    updatedAt: publishedAt,
    authority,
    faqs,
    lastDate,
    importantLinks,
  });

  return {
    title: topic,
    slug,
    url: `/post/${slug}`,
    category,
    publishedDate,
    publishedAt,
    createdAt: publishedAt,
    updatedAt: publishedAt,
    lastDate: lastDate || undefined,
    intro,
    importantDates,
    applicationFee,
    ageLimit,
    vacancyDetails,
    importantLinks,
    fullContentHtml: fullContentHtml.trim(),
    seo: {
      seoTitle: seoData.seoTitle,
      metaDescription: seoData.metaDescription,
      canonicalUrl: seoData.canonicalUrl,
      focusKeyword: seoData.focusKeyword,
      secondaryKeywords: seoData.secondaryKeywords,
      ogImageUrl: seoData.ogImageUrl,
    },
    jsonLd: seoData.jsonLd,
    faqs,
  };
}

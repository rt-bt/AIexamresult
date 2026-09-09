import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "All India Exam Result 2026";
    const category = searchParams.get("cat") || "Sarkari Result";
    const date = searchParams.get("date") || "Latest Update";

    // Category badge colors
    let badgeBg = "#0D9488";
    const catLower = category.toLowerCase();
    if (catLower.includes("job") || catLower.includes("vacancy")) {
      badgeBg = "#4F46E5";
    } else if (catLower.includes("admit")) {
      badgeBg = "#EA580C";
    } else if (catLower.includes("answer")) {
      badgeBg = "#7C3AED";
    } else if (catLower.includes("result")) {
      badgeBg = "#0D9488";
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0B132B",
            backgroundImage: "radial-gradient(circle at 25px 25px, #1C2541 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1C2541 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "50px 60px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "#0D9488",
                  fontSize: "24px",
                  fontWeight: 900,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                AI
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "24px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
                  All India Exam Result
                </span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#5EEAD4", letterSpacing: "1px" }}>
                  SARKARI RESULT · SARKARI EXAM 2026
                </span>
              </div>
            </div>

            {/* Category Tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 24px",
                borderRadius: "30px",
                backgroundColor: badgeBg,
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
            >
              {category}
            </div>
          </div>

          {/* Center: Big Bold Title for Google Discover */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "20px 0" }}>
            <div
              style={{
                fontSize: title.length > 70 ? "46px" : "56px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.18,
                letterSpacing: "-1px",
                maxHeight: "220px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }} />
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#FBBF24" }}>
                Live Verification Link &amp; Complete Details Inside
              </span>
            </div>
          </div>

          {/* Bottom Bar: Badges & URL */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px solid rgba(255,255,255,0.12)",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                📅 {date}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(16,185,129,0.15)",
                  color: "#34D399",
                  fontSize: "15px",
                  fontWeight: 700,
                  border: "1px solid rgba(16,185,129,0.3)",
                }}
              >
                ✓ Official Notification PDF
              </div>
            </div>

            <div style={{ fontSize: "20px", fontWeight: 800, color: "#5EEAD4" }}>
              aiexamresult.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}

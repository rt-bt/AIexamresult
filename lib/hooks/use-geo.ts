"use client";

import { useState, useEffect } from "react";

export interface GeoInfo {
  state: string;
  stateSlug: string;
  city: string;
  country: string;
}

function stateToSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function useGeo() {
  const [geo, setGeo] = useState<GeoInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem("aier_geo");
    if (cached) {
      try { setGeo(JSON.parse(cached)); setLoading(false); return; } catch {}
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => { controller.abort(); setLoading(false); }, 5000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.region && data.country === "IN") {
          const info: GeoInfo = {
            state: data.region,
            stateSlug: stateToSlug(data.region),
            city: data.city || "",
            country: data.country,
          };
          setGeo(info);
          try { sessionStorage.setItem("aier_geo", JSON.stringify(info)); } catch {}
        }
        setLoading(false);
      })
      .catch(() => setLoading(false))
      .finally(() => clearTimeout(timeout));

    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  return { geo, loading };
}

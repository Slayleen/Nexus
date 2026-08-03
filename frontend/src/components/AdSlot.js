import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = "ca-pub-8730099417422285";

// Real Google AdSense unit for the free 4-week trial ("with ads", per the
// business model). Falls back to a labeled placeholder if the script hasn't
// loaded (e.g. blocked, or before Google approves the site).
export default function AdSlot({ className = "" }) {
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle.js not loaded yet (or blocked) — the placeholder background stays visible.
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`nb-card border-dashed bg-white/60 flex items-center justify-center py-4 px-4 min-h-[90px] overflow-hidden ${className}`}
      data-testid="ad-slot"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

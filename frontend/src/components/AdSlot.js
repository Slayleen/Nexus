// Placeholder ad unit for the free 4-week trial ("with ads", per the business
// model). Swap the inner content for the real AdSense embed once the account
// is approved — everywhere this component is used stays a one-line change.
export default function AdSlot({ className = "" }) {
  return (
    <div
      className={`nb-card border-dashed bg-white/60 flex items-center justify-center py-4 px-4 text-xs font-bold text-[#4A4A4A] uppercase tracking-[0.14em] ${className}`}
      data-testid="ad-slot-placeholder"
    >
      Advertisement — placeholder
    </div>
  );
}

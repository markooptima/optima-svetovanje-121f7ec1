import logoAsset from "@/assets/optima-logo.jpg.asset.json";
const logo = `https://id-preview--51518e50-5c3c-4721-ad26-f39c2443209b.lovable.app${logoAsset.url}`;

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#domov" className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="Optima Svetovanje logo"
        className="h-10 w-10 rounded-md object-cover object-[center_35%] ring-1 ring-white/10"
      />
      <div className="leading-tight">
        <div className="font-display text-base font-semibold tracking-tight">
          Optima <span className="text-gold">Svetovanje</span>
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Optimizacija stroškov
        </div>
      </div>
    </a>
  );
}

import logo from "@/assets/optima-logo.jpg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#domov" className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="Optima Svetovanje logo"
        className="h-10 w-10 rounded-md object-cover object-[center_15%] ring-1 ring-white/10"
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

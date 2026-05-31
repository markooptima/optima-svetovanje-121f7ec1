import { useState } from "react";
import { Logo } from "./Logo";
import { ShareModal } from "./ShareModal";
import { Button } from "@/components/ui/button";
import { Share2, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { href: "#domov", label: "Domov" },
  { href: "#storitve", label: "Storitve" },
  { href: "#postopek", label: "Kako poteka" },
  { href: "#povprasevanje", label: "Povpraševanje" },
  { href: "#faq", label: "Pogosta vprašanja" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Header() {
  const [share, setShare] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-deep/95 text-navy-foreground backdrop-blur supports-[backdrop-filter]:bg-navy-deep/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-white/80 transition-colors hover:text-gold">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShare(true)}
            variant="ghost"
            size="sm"
            className="hidden text-white hover:bg-white/10 hover:text-gold sm:inline-flex"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Deli
          </Button>
          <Button
            onClick={() => setShare(true)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-gold sm:hidden"
            aria-label="Deli"
          >
            <Share2 className="h-5 w-5" />
          </Button>

          <a href="#povprasevanje" className="hidden sm:block">
            <Button className="btn-gold h-10 px-5 font-semibold">Brezplačna analiza</Button>
          </a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 lg:hidden" aria-label="Meni">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88%] max-w-sm bg-navy-deep text-navy-foreground border-white/10">
              <SheetTitle className="sr-only">Navigacija</SheetTitle>
              <div className="mt-2 flex items-center justify-between">
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex flex-col gap-1">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-base text-white/90 transition hover:bg-white/5 hover:text-gold"
                  >
                    {n.label}
                  </a>
                ))}
                <a href="#povprasevanje" onClick={() => setMobileOpen(false)} className="mt-4">
                  <Button className="btn-gold h-12 w-full text-base font-semibold">Brezplačna analiza</Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ShareModal open={share} onOpenChange={setShare} />
    </header>
  );
}

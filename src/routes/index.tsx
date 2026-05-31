import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Toaster } from "@/components/ui/sonner";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Zap, Flame, Wifi, ArrowRight, CheckCircle2, FileText, Sparkles, ClipboardList,
  Mail, Phone, Building2, ShieldCheck, HandshakeIcon, Eye, HeartHandshake, Calculator, BookOpen,
} from "lucide-react";
import logo from "@/assets/optima-logo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Optima Svetovanje — Brezplačna analiza stroškov elektrike, plina in telekomunikacij" },
      { name: "description", content: "Pomagamo gospodinjstvom in malim podjetjem v Sloveniji preveriti stroške za električno energijo, zemeljski plin in telekomunikacije. Brezplačna analiza brez obveznosti." },
      { property: "og:title", content: "Optima Svetovanje — Brezplačna analiza stroškov" },
      { property: "og:description", content: "Preverite, ali za elektriko, plin ali telekomunikacije plačujete preveč. Brezplačno in brez obveznosti." },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#0f1a33" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" },
    ],
  }),
  component: Index,
});

const SERVICES = [
  {
    icon: Zap, title: "Električna energija",
    items: [
      "pregled obstoječih stroškov",
      "analiza tarif in pogodbenih pogojev",
      "primerjava ponudb na trgu",
      "izračun potencialnih prihrankov",
      "pomoč pri izbiri ustreznejše rešitve",
    ],
  },
  {
    icon: Flame, title: "Zemeljski plin",
    items: [
      "pregled obstoječih pogojev",
      "analiza stroškov",
      "primerjava aktualnih ponudb",
      "iskanje ugodnejših rešitev",
      "pomoč pri razumevanju možnosti prihranka",
    ],
  },
  {
    icon: Wifi, title: "Telekomunikacije",
    items: [
      "pregled trenutnega operaterja in paketov",
      "analiza stroškov mobilne telefonije",
      "analiza stroškov interneta in televizije",
      "primerjava operaterjev in paketov",
      "iskanje ugodnejših rešitev glede na uporabo",
    ],
  },
];

const STEPS = [
  { icon: ClipboardList, title: "Oddate povpraševanje", desc: "Izpolnite kratek obrazec z osnovnimi podatki." },
  { icon: FileText, title: "Priložite račun ali pogodbo", desc: "Račun lahko poslikate s telefonom ali naložite kot datoteko." },
  { icon: Calculator, title: "Pripravimo analizo", desc: "Pregledamo obstoječe pogoje in preverimo možnosti za prihranek." },
  { icon: Sparkles, title: "Prejmete predlog", desc: "Predstavimo možne prihranke in rešitve, odločitev pa je vedno vaša." },
];

const BENEFITS = [
  { icon: CheckCircle2, title: "Brezplačna analiza", desc: "Pregled in priprava ponudbe sta brezplačna." },
  { icon: ShieldCheck, title: "Brez obveznosti", desc: "Oddaja povpraševanja vas k ničemur ne zavezuje." },
  { icon: HeartHandshake, title: "Osebni pristop", desc: "Vsako analizo pripravimo glede na vaše dejansko stanje." },
  { icon: Eye, title: "Pregledne informacije", desc: "Jasna in razumljiva razlaga vseh pogojev." },
  { icon: Calculator, title: "Realne možnosti prihranka", desc: "Iščemo rešitve, ki dejansko prinašajo prihranek." },
  { icon: BookOpen, title: "Razumevanje ponudb", desc: "Pomagamo razumeti pogodbe in pogoje." },
];

const FAQ = [
  ["Ali je analiza res brezplačna?", "Da. Analiza je brezplačna in brez obveznosti."],
  ["Ali lahko pošljem samo sliko računa?", "Seveda. Fotografija računa z mobilnim telefonom je povsem dovolj za prvi pregled."],
  ["Ali moram po oddaji povpraševanja zamenjati dobavitelja ali operaterja?", "Ne. Oddaja povpraševanja vas k ničemur ne zavezuje. Namen analize je, da najprej preverimo možnosti."],
  ["Ali med menjavo ostanem brez storitve?", "Ne. Menjava dobavitelja ali operaterja praviloma poteka nemoteno in brez prekinitve storitve."],
  ["Ali pomagamo tudi malim podjetjem?", "Da. Poleg gospodinjstev pomagamo tudi malim podjetjem in drugim manjšim poslovnim uporabnikom."],
  ["Katere dokumente lahko pošljem?", "Pošljete lahko račun, pogodbo ali drugo ponudbo, ki jo trenutno uporabljate."],
  ["Kako hitro dobim odgovor?", "Na vaše povpraševanje odgovorimo v najkrajšem možnem času po prejemu podatkov."],
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section id="domov" className="bg-hero-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Preverite, ali za <span className="text-gold">elektriko</span>, <span className="text-gold">zemeljski plin</span> ali <span className="text-gold">telekomunikacije</span> plačujete preveč.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Pomagamo gospodinjstvom in malim podjetjem preveriti obstoječe stroške ter poiskati ugodnejše rešitve. Pošljite nam svoje podatke ali račun in pripravili vam bomo brezplačno analizo brez obveznosti.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#povprasevanje" className="w-full sm:w-auto">
                <Button className="btn-gold h-14 w-full px-8 text-base font-semibold sm:w-auto">
                  Začni brezplačno analizo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#storitve" className="w-full sm:w-auto">
                <Button variant="outline" className="h-14 w-full border-white/30 bg-white/5 px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-gold sm:w-auto">
                  Preveri storitve
                </Button>
              </a>
            </div>
          </div>

          {/* 3 service cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {SERVICES.map((s) => (
              <a
                key={s.title}
                href="#storitve"
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-gold/40 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/30">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <div className="mt-3 inline-flex items-center gap-1 text-sm text-gold opacity-90 transition group-hover:gap-2">
                  Preberi več <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="storitve" className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Storitve"
            title="Naše storitve"
            subtitle="Pomagamo preveriti trenutne pogoje, primerjati ponudbe in poiskati možnosti za prihranek."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="flex flex-col rounded-2xl border bg-card p-7 shadow-sm transition hover:shadow-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-gold">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Storitve so namenjene predvsem gospodinjstvom in malim podjetjem.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="postopek" className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Postopek" title="Kako poteka" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border bg-card p-6">
                <div className="absolute -top-3 left-6 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-gold">
                  Korak {i + 1}
                </div>
                <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-navy">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-gold/10 px-5 py-2.5 text-sm font-medium text-navy">
              <CheckCircle2 className="h-4 w-4 text-gold" />
              Brezplačno. Brez obveznosti. Jasno in pregledno.
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Zaupanje"
            title="Zakaj Optima Svetovanje"
            subtitle="Na podlagi dejanskih podatkov pripravimo jasno oceno možnosti za optimizacijo stroškov."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 rounded-2xl border bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-navy">
                  <b.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section id="povprasevanje" className="bg-navy-deep py-20 text-navy-foreground sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Pošljite povpraševanje</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/75">
              Izpolnite osnovne podatke in, če želite, priložite račun ali pogodbo. Na podlagi prejetih informacij pripravimo brezplačno analizo.
            </p>
          </div>
          <div className="mt-10">
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Pomoč" title="Pogosta vprašanja" />
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {FAQ.map(([q, a], i) => (
              <AccordionItem key={i} value={`item-${i}`} className="overflow-hidden rounded-xl border bg-card px-5">
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:text-navy">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT */}
      <section id="kontakt" className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Stik"
            title="Kontakt"
            subtitle="Za dodatne informacije ali vprašanja nas lahko kontaktirate tudi neposredno."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            <ContactCard icon={Phone} label="Telefon" value="071 378 510" href="tel:071378510" />
            <ContactCard icon={Mail} label="E-pošta" value="info@optima-svetovanje.si" href="mailto:info@optima-svetovanje.si" />
            <ContactCard icon={Building2} label="Podjetje" value="Optima Svetovanje" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-navy-deep py-12 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Optima Svetovanje" className="h-12 w-12 rounded-md object-cover ring-1 ring-white/10" />
              <div>
                <div className="font-display text-lg font-semibold">
                  Optima <span className="text-gold">Svetovanje</span>
                </div>
                <p className="mt-1 max-w-md text-sm text-white/60">
                  Optimizacija stroškov električne energije, zemeljskega plina in telekomunikacij.
                </p>
              </div>
            </div>
            <div className="text-xs text-white/50">
              © {new Date().getFullYear()} Optima Svetovanje. Vse pravice pridržane.
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function ContactCard({
  icon: Icon, label, value, href,
}: { icon: typeof Mail; label: string; value: string; href?: string }) {
  const inner = (
    <div className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-6 transition hover:border-gold/40 hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-0.5 break-words font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block h-full">{inner}</a> : inner;
}

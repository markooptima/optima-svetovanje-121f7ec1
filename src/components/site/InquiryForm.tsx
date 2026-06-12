import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { notifyInquiry } from "@/lib/inquiry-notify.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SERVICES = ["Električna energija", "Zemeljski plin", "Telekomunikacije"] as const;
const TELCO_PAKETI = ["Mobilna telefonija", "Internet", "Televizija", "Poslovna telefonija"] as const;

const ELEKTRIKA_DOBAVITELJI = [
  "GEN-I", "Elektro Energija", "Energija Plus", "ECE", "E 3", "Petrol",
  "Energetika Ljubljana", "HEP Energija", "Elektro Maribor Energija",
];
const PLIN_DOBAVITELJI = [
  "Petrol", "Energija Plus", "Geoplin", "Energetika Ljubljana",
  "Plinarna Maribor", "ECE", "Adriaplin", "Domplan",
];
const TELCO_OPERATERJI = [
  "Telekom Slovenije", "A1 Slovenija", "Telemach", "T-2", "Bob", "Hot Mobil", "Hofer telekom",
];

const schema = z.object({
  ime_priimek: z.string().trim().min(2, "Vnesite ime in priimek").max(200),
  podjetje: z.string().trim().max(200).optional().or(z.literal("")),
  naslov: z.string().trim().max(200).optional().or(z.literal("")),
  posta_kraj: z.string().trim().max(120).optional().or(z.literal("")),
  telefon: z.string().trim().min(5, "Vnesite telefonsko številko").max(50),
  email: z.string().trim().email("Neveljaven e-naslov").max(255),
  services: z.array(z.string()).min(1, "Izberite vsaj eno storitev"),
  elektrika_dobavitelj: z.string().trim().max(120).optional().or(z.literal("")),
  elektrika_znesek: z.string().optional(),
  plin_dobavitelj: z.string().trim().max(120).optional().or(z.literal("")),
  plin_znesek: z.string().optional(),
  telco_operater: z.string().trim().max(120).optional().or(z.literal("")),
  telco_znesek: z.string().optional(),
  telco_paketi: z.array(z.string()).optional(),
  dodatne_informacije: z.string().trim().max(2000).optional().or(z.literal("")),
  privacy: z.literal(true, { errorMap: () => ({ message: "Potrebno je soglasje" }) }),
});

type FormData = z.infer<typeof schema>;

export function InquiryForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register, handleSubmit, watch, setValue, formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { services: [], telco_paketi: [], privacy: undefined as never },
  });

  const services = watch("services") || [];
  const telcoPaketi = watch("telco_paketi") || [];

  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, 5);
    setFiles(next);
  };

  const removeFile = (i: number) => setFiles(files.filter((_, idx) => idx !== i));

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Upload files first
      const paths: string[] = [];
      for (const f of files) {
        if (f.size > 10 * 1024 * 1024) {
          toast.error(`Datoteka ${f.name} je prevelika (max 10 MB).`);
          setSubmitting(false);
          return;
        }
        const safe = f.name.replace(/[^\w.\-]/g, "_");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
        const { error: upErr } = await supabase.storage.from("inquiry-uploads").upload(path, f, {
          contentType: f.type || "application/octet-stream",
        });
        if (upErr) throw upErr;
        paths.push(path);
      }

      const { data: inserted, error } = await supabase.from("inquiries").insert({
        ime_priimek: data.ime_priimek,
        podjetje: data.podjetje || null,
        naslov: data.naslov || null,
        posta_kraj: data.posta_kraj || null,
        telefon: data.telefon,
        email: data.email,
        services: data.services,
        elektrika_dobavitelj: data.elektrika_dobavitelj || null,
        elektrika_znesek: data.elektrika_znesek ? Number(data.elektrika_znesek) : null,
        plin_dobavitelj: data.plin_dobavitelj || null,
        plin_znesek: data.plin_znesek ? Number(data.plin_znesek) : null,
        telco_operater: data.telco_operater || null,
        telco_znesek: data.telco_znesek ? Number(data.telco_znesek) : null,
        telco_paketi: data.telco_paketi || [],
        dodatne_informacije: data.dodatne_informacije || null,
        file_paths: paths,
        privacy_accepted: true,
      }).select("id").single();

      if (error) throw error;

      // Pošlji obvestilo (ne blokira uspeha, če odpove)
      if (inserted?.id) {
        notifyInquiry({ data: { inquiryId: inserted.id } }).catch((e) => {
          console.error("notify failed", e);
        });
      }

      setDone(true);
      setFiles([]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Neznana napaka";
      toast.error("Napaka pri pošiljanju: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
        <h3 className="mt-4 font-display text-2xl font-semibold">Hvala za vaše povpraševanje.</h3>
        <p className="mt-3 text-muted-foreground">
          Vaše podatke smo uspešno prejeli. V najkrajšem možnem času vas kontaktiramo.
        </p>
        <Button onClick={() => setDone(false)} variant="outline" className="mt-6">
          Pošlji novo povpraševanje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-2xl border bg-white p-6 text-foreground shadow-sm sm:p-10">
      {/* Basic info */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ime in priimek *" error={errors.ime_priimek?.message}>
          <Input {...register("ime_priimek")} className="h-12" />
        </Field>
        <Field label="Podjetje (neobvezno)">
          <Input {...register("podjetje")} className="h-12" />
        </Field>
        <Field label="Naslov">
          <Input {...register("naslov")} className="h-12" />
        </Field>
        <Field label="Pošta in kraj">
          <Input {...register("posta_kraj")} className="h-12" />
        </Field>
        <Field label="Telefon *" error={errors.telefon?.message}>
          <Input type="tel" {...register("telefon")} className="h-12" />
        </Field>
        <Field label="E-pošta *" error={errors.email?.message}>
          <Input type="email" {...register("email")} className="h-12" />
        </Field>
      </div>

      {/* Services */}
      <div>
        <Label className="text-base font-semibold">Kaj želite preveriti? *</Label>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {SERVICES.map((s) => {
            const checked = services.includes(s);
            return (
              <label
                key={s}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${
                  checked ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => setValue("services", toggle(services, s), { shouldValidate: true })}
                />
                <span className="text-sm font-medium">{s}</span>
              </label>
            );
          })}
        </div>
        {errors.services && <p className="mt-2 text-sm text-destructive">{errors.services.message as string}</p>}
      </div>

      {/* Conditional */}
      {services.includes("Električna energija") && (
        <ConditionalCard title="Električna energija">
          <Field label="Trenutni dobavitelj">
            <SupplierSelect
              options={ELEKTRIKA_DOBAVITELJI}
              value={watch("elektrika_dobavitelj") || ""}
              onChange={(v) => setValue("elektrika_dobavitelj", v)}
              placeholder="Izberite dobavitelja"
            />
          </Field>
          <Field label="Trenutni mesečni znesek (€)"><Input type="number" step="0.01" {...register("elektrika_znesek")} className="h-12" /></Field>
        </ConditionalCard>
      )}
      {services.includes("Zemeljski plin") && (
        <ConditionalCard title="Zemeljski plin">
          <Field label="Trenutni dobavitelj">
            <SupplierSelect
              options={PLIN_DOBAVITELJI}
              value={watch("plin_dobavitelj") || ""}
              onChange={(v) => setValue("plin_dobavitelj", v)}
              placeholder="Izberite dobavitelja"
            />
          </Field>
          <Field label="Trenutni mesečni znesek (€)"><Input type="number" step="0.01" {...register("plin_znesek")} className="h-12" /></Field>
        </ConditionalCard>
      )}
      {services.includes("Telekomunikacije") && (
        <ConditionalCard title="Telekomunikacije">
          <Field label="Trenutni operater">
            <SupplierSelect
              options={TELCO_OPERATERJI}
              value={watch("telco_operater") || ""}
              onChange={(v) => setValue("telco_operater", v)}
              placeholder="Izberite operaterja"
            />
          </Field>
          <Field label="Trenutni mesečni znesek (€)"><Input type="number" step="0.01" {...register("telco_znesek")} className="h-12" /></Field>
          <div className="sm:col-span-2">
            <Label className="text-sm font-medium">Kaj vključuje vaš paket?</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {TELCO_PAKETI.map((p) => {
                const checked = telcoPaketi.includes(p);
                return (
                  <label key={p} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:border-gold/40">
                    <Checkbox checked={checked} onCheckedChange={() => setValue("telco_paketi", toggle(telcoPaketi, p))} />
                    <span className="text-sm">{p}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </ConditionalCard>
      )}

      <Field label="Dodatne informacije">
        <Textarea
          {...register("dodatne_informacije")}
          rows={4}
          placeholder="Sem lahko napišete dodatne želje, posebnosti ali vprašanja."
        />
      </Field>

      {/* File upload */}
      <div>
        <Label className="text-base font-semibold">Priložite račun ali pogodbo</Label>
        <p className="mt-1 text-sm text-muted-foreground">JPG, PNG ali PDF. Lahko poslikate s telefonom.</p>
        <label
          htmlFor="file-upload"
          className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center transition hover:border-gold hover:bg-gold/5"
        >
          <Upload className="h-7 w-7 text-muted-foreground" />
          <span className="mt-2 text-sm font-medium">Kliknite za izbiro ali povlecite datoteke</span>
          <span className="mt-1 text-xs text-muted-foreground">Največ 5 datotek, vsaka do 10 MB</span>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/jpeg,image/png,application/pdf,image/*"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                <span className="truncate pr-3">{f.name}</span>
                <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive" aria-label="Odstrani">
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3">
          <Checkbox
            onCheckedChange={(v) => setValue("privacy", v === true ? true : (undefined as never), { shouldValidate: true })}
            className="mt-1"
          />
          <span className="text-sm leading-relaxed">
            Strinjam se z obdelavo podatkov za namen priprave analize in ponudbe.
          </span>
        </label>
        {errors.privacy && <p className="mt-2 text-sm text-destructive">{errors.privacy.message as string}</p>}
      </div>

      <Button type="submit" disabled={submitting} className="btn-gold h-14 w-full text-base font-semibold">
        {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        {submitting ? "Pošiljam..." : "Pošlji v brezplačno analizo"}
      </Button>
    </form>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function ConditionalCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-gold/30 bg-gold/5 p-5">
      <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-navy">{title}</div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function SupplierSelect({
  options, value, onChange, placeholder,
}: { options: string[]; value: string; onChange: (v: string) => void; placeholder: string }) {
  const isOther = value !== "" && !options.includes(value);
  const [mode, setMode] = useState<"list" | "other">(isOther ? "other" : "list");
  const selectValue = mode === "other" ? "__other__" : (options.includes(value) ? value : "");

  return (
    <div className="space-y-2">
      <Select
        value={selectValue}
        onValueChange={(v) => {
          if (v === "__other__") {
            setMode("other");
            onChange("");
          } else {
            setMode("list");
            onChange(v);
          }
        }}
      >
        <SelectTrigger className="h-12"><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          <SelectItem value="__other__">Drugo / Ne vem</SelectItem>
        </SelectContent>
      </Select>
      {mode === "other" && (
        <Input
          className="h-12"
          placeholder="Vnesite ime dobavitelja"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

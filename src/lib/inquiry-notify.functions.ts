import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const NOTIFY_TO = "marko.optima.svetovanje@gmail.com";
const FROM = "Optima Povpraševanje <onboarding@resend.dev>";

function esc(s: unknown): string {
  if (s === null || s === undefined || s === "") return "—";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fmtEur(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return `${Number(n).toFixed(2)} €`;
}

export const notifyInquiry = createServerFn({ method: "POST" })
  .inputValidator(z.object({ inquiryId: z.string().uuid() }).parse)
  .handler(async ({ data }) => {
    console.log("[notifyInquiry] start", data.inquiryId);
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("[notifyInquiry] RESEND_API_KEY missing");
      return { ok: false, error: "resend_key_missing" };
    }
    console.log("[notifyInquiry] key present, length", RESEND_API_KEY.length);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .eq("id", data.inquiryId)
      .single();

    if (error || !row) {
      console.error("[notifyInquiry] inquiry not found", error);
      return { ok: false, error: "not_found" };
    }

    // Prepare attachments (download) + fallback signed URLs (7 days)
    const MAX_ATTACH_BYTES = 8 * 1024 * 1024; // 8 MB per file
    const MAX_TOTAL_BYTES = 30 * 1024 * 1024; // 30 MB total (Resend cap ~40 MB)
    const resendAttachments: { filename: string; content: string }[] = [];
    const linkFallbacks: { name: string; url: string }[] = [];
    const allLinks: { name: string; url: string }[] = [];
    const paths: string[] = Array.isArray(row.file_paths) ? row.file_paths : [];
    let totalBytes = 0;

    for (const p of paths) {
      const displayName = p.split("-").slice(2).join("-") || p;

      // Always create a signed URL as backup / link in email
      const { data: signed } = await supabaseAdmin.storage
        .from("inquiry-uploads")
        .createSignedUrl(p, 60 * 60 * 24 * 7);
      if (signed?.signedUrl) {
        allLinks.push({ name: displayName, url: signed.signedUrl });
      }

      // Try to download and attach
      try {
        const { data: blob, error: dlErr } = await supabaseAdmin.storage
          .from("inquiry-uploads")
          .download(p);
        if (dlErr || !blob) throw dlErr ?? new Error("download_failed");

        const size = blob.size;
        if (size > MAX_ATTACH_BYTES || totalBytes + size > MAX_TOTAL_BYTES) {
          if (signed?.signedUrl) linkFallbacks.push({ name: displayName, url: signed.signedUrl });
          continue;
        }

        const buf = new Uint8Array(await blob.arrayBuffer());
        // Base64 encode
        let binary = "";
        for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
        const b64 = btoa(binary);

        resendAttachments.push({ filename: displayName, content: b64 });
        totalBytes += size;
      } catch (e) {
        console.error("[notifyInquiry] attach failed", p, e);
        if (signed?.signedUrl) linkFallbacks.push({ name: displayName, url: signed.signedUrl });
      }
    }

    const services: string[] = Array.isArray(row.services) ? row.services : [];
    const telcoPaketi: string[] = Array.isArray(row.telco_paketi) ? row.telco_paketi : [];

    const subject = `Novo povpraševanje: ${row.ime_priimek} — ${services.join(", ") || "—"}`;

    const serviceBlocks: string[] = [];
    if (services.includes("Električna energija")) {
      serviceBlocks.push(`
        <tr><td style="padding:8px 12px;background:#f8f6f0;border-radius:6px">
          <strong>⚡ Električna energija</strong><br>
          Dobavitelj: ${esc(row.elektrika_dobavitelj)}<br>
          Mesečni znesek: ${fmtEur(row.elektrika_znesek)}
        </td></tr><tr><td style="height:8px"></td></tr>`);
    }
    if (services.includes("Zemeljski plin")) {
      serviceBlocks.push(`
        <tr><td style="padding:8px 12px;background:#f8f6f0;border-radius:6px">
          <strong>🔥 Zemeljski plin</strong><br>
          Dobavitelj: ${esc(row.plin_dobavitelj)}<br>
          Mesečni znesek: ${fmtEur(row.plin_znesek)}
        </td></tr><tr><td style="height:8px"></td></tr>`);
    }
    if (services.includes("Telekomunikacije")) {
      serviceBlocks.push(`
        <tr><td style="padding:8px 12px;background:#f8f6f0;border-radius:6px">
          <strong>📱 Telekomunikacije</strong><br>
          Operater: ${esc(row.telco_operater)}<br>
          Mesečni znesek: ${fmtEur(row.telco_znesek)}<br>
          Paketi: ${esc(telcoPaketi.join(", "))}
        </td></tr><tr><td style="height:8px"></td></tr>`);
    }

    const linksList = linkFallbacks.length ? linkFallbacks : allLinks;
    const attachmentsHtml = allLinks.length
      ? `<h3 style="margin:24px 0 8px;color:#1a2b4a">📎 Priložene datoteke</h3>
         ${resendAttachments.length ? `<p style="margin:0 0 8px;font-size:13px;color:#666">${resendAttachments.length} ${resendAttachments.length === 1 ? "datoteka je priložena" : "datotek je priloženih"} k temu e-mailu.</p>` : ""}
         ${linksList.length ? `<p style="margin:0 0 6px;font-size:13px;color:#666">${resendAttachments.length ? "Dodatne povezave" : "Povezave do datotek"}:</p>
         <ul style="padding-left:20px;margin:0">
           ${linksList.map(a => `<li><a href="${a.url}" style="color:#c9a14a">${esc(a.name)}</a></li>`).join("")}
         </ul>
         <p style="font-size:12px;color:#666;margin-top:4px">Povezave veljajo 7 dni.</p>` : ""}`
      : "";

    const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;color:#1a2b4a">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;max-width:600px">
        <tr><td>
          <h1 style="margin:0 0 4px;font-size:22px;color:#1a2b4a">Novo povpraševanje</h1>
          <p style="margin:0 0 24px;color:#666;font-size:13px">${new Date(row.created_at).toLocaleString("sl-SI")}</p>

          <h3 style="margin:0 0 8px;color:#1a2b4a">👤 Kontakt</h3>
          <table cellpadding="4" style="font-size:14px;width:100%">
            <tr><td style="color:#666;width:140px">Ime in priimek:</td><td><strong>${esc(row.ime_priimek)}</strong></td></tr>
            <tr><td style="color:#666">Podjetje:</td><td>${esc(row.podjetje)}</td></tr>
            <tr><td style="color:#666">Telefon:</td><td><a href="tel:${esc(row.telefon)}" style="color:#c9a14a">${esc(row.telefon)}</a></td></tr>
            <tr><td style="color:#666">E-pošta:</td><td><a href="mailto:${esc(row.email)}" style="color:#c9a14a">${esc(row.email)}</a></td></tr>
            <tr><td style="color:#666">Naslov:</td><td>${esc(row.naslov)}</td></tr>
            <tr><td style="color:#666">Pošta/kraj:</td><td>${esc(row.posta_kraj)}</td></tr>
          </table>

          <h3 style="margin:24px 0 8px;color:#1a2b4a">📋 Storitve za analizo</h3>
          <table width="100%" cellpadding="0" cellspacing="0">${serviceBlocks.join("")}</table>

          ${row.dodatne_informacije ? `
          <h3 style="margin:24px 0 8px;color:#1a2b4a">💬 Dodatne informacije</h3>
          <p style="background:#f8f6f0;padding:12px;border-radius:6px;margin:0;white-space:pre-wrap">${esc(row.dodatne_informacije)}</p>
          ` : ""}

          ${attachmentsHtml}

          <hr style="border:none;border-top:1px solid #eee;margin:32px 0 16px">
          <p style="font-size:12px;color:#999;margin:0">Odgovori direktno na ta e-mail — odgovor bo poslan stranki (${esc(row.email)}).</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        ...(row.email ? { reply_to: row.email } : {}),
        subject,
        html,
        ...(resendAttachments.length ? { attachments: resendAttachments } : {}),
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[notifyInquiry] resend failed", resp.status, text);
      return { ok: false, error: `resend_${resp.status}`, detail: text };
    }

    const okBody = await resp.text();
    console.log("[notifyInquiry] sent", okBody);
    return { ok: true };
  });

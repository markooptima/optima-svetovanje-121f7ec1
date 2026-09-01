# Optima Svetovanje — namestitev (lasten Supabase + Vercel)

## 1. Supabase (lasten projekt)
Odpri Supabase → SQL Editor → prilepi in zaženi celotno vsebino datoteke
`supabase/setup-lastni-projekt.sql`.

Ustvari:
- tabelo `inquiries` (vsi podatki obrazca),
- zaseben bucket `inquiry-uploads` (priponke/slike),
- pravice in RLS politike (javni vpis, branje samo preko service role).

## 2. Vercel → Settings → Environment Variables
| Ime | Vrednost |
| --- | --- |
| `VITE_SUPABASE_URL` | https://<tvoj-ref>.supabase.co |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon / publishable ključ |
| `VITE_SUPABASE_PROJECT_ID` | ref projekta |
| `SUPABASE_URL` | enako kot zgoraj |
| `SUPABASE_PUBLISHABLE_KEY` | enako kot anon ključ |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role ključ (Supabase → Settings → API keys) |
| `RESEND_API_KEY` | ključ iz Resend |

Po vnosu **obvezno Redeploy** (env spremenljivke se uporabijo šele ob novem buildu).

## 3. Resend
- Prejemnik obvestil: `info@optima-svetovanje.com`
- Pošiljatelj: `Optima Povpraševanje <onboarding@resend.dev>` (testni naslov).
  Za pošiljanje z lastne domene potrdi domeno v Resendu in spremeni `FROM`
  v `src/lib/inquiry-notify.functions.ts`.

## 4. Preverjanje
Oddaj testno povpraševanje. Če email ne pride, poglej Vercel → Functions → Logs
in poišči vrstice `[notifyInquiry]`.

# E-mail obvestila za nova povpraševanja

## Cilj
Vsakič ko nekdo odda obrazec na strani, dobiš na **marko.optima.svetovanje@gmail.com** lepo oblikovan e-mail z vsemi podatki povpraševanja (ime, kontakt, izbrane storitve, trenutni dobavitelji, zneski, sporočilo) in povezavami do priloženih datotek.

## Kaj naredim

### 1. Varno shranim Resend API ključ
Tvoj ključ, ki si ga poslal v chatu, je javno viden — **prekliči ga v Resend → API Keys** in ustvari novega. Novi ključ boš vnesel preko varne forme (Lovable Secrets), nikoli več v chat.

### 2. Server endpoint za pošiljanje
Naredim TanStack server route `/api/public/inquiry-notify` ki:
- sprejme ID novega povpraševanja
- iz baze prebere podatke
- pripravi HTML email s povzetkom
- za vsako priloženo datoteko generira **signed URL** (veljaven 7 dni), da lahko priponke odpreš direktno iz emaila
- pošlje preko Resend API na marko.optima.svetovanje@gmail.com
- From: `Optima Povpraševanje <onboarding@resend.dev>`, Reply-To: email stranke (da lahko direktno odgovoriš)

### 3. Sprožilec iz obrazca
V `InquiryForm.tsx` po uspešnem `insert` v `inquiries` tabelo pokličem ta endpoint. Če pošiljanje emaila spodleti, obrazec **vseeno uspe** (podatki so že v bazi) — napaka se samo zabeleži, uporabnik ne dobi napake.

## Vsebina emaila
- **Subject:** `Novo povpraševanje: [Ime Priimek] — [storitve]`
- Ime, podjetje, telefon, email, naslov
- Izbrane storitve + za vsako: trenutni dobavitelj in mesečni znesek
- Telco paketi (če izbrano)
- Dodatne informacije
- Povezave do priponk (računi/pogodbe)
- Datum oddaje

## Omejitve testnega načina
Ker uporabljaš `onboarding@resend.dev`:
- emaili se pošiljajo **samo na marko.optima.svetovanje@gmail.com** (email, s katerim si registriran v Resend) — to ti ustreza
- From naslov je `onboarding@resend.dev` (ne tvoja domena)
- Ko boš pripravljen za profesionalen izgled, lahko kasneje verificiraš `optima-svetovanje.si` v Resendu in zamenjava sender domene je 1-linijska sprememba

## Tehnične opombe
- Endpoint pod `/api/public/*` (brez auth, kličejo ga lahko anonimni uporabniki obrazca)
- Vendar varnost: endpoint sprejme samo `inquiry_id`, sam prebere podatke preko `supabaseAdmin` — nihče ne more ponarediti vsebine
- Resend ključ branjen samo na serverju (`process.env.RESEND_API_KEY`)
- Priponke iz `inquiry-uploads` storage bucket-a se pretvorijo v signed URL-je (bucket je privaten — to je pravilno)

## Kaj boš moral narediti ti
1. **Prekliči obstoječi Resend API ključ** in ustvari novega
2. Ko te vprašam, vnesi nov ključ v varno formo (en klik)
3. Po deployu na Vercel dodaj `RESEND_API_KEY` med Vercel Environment Variables (tega ne morem narediti zate)

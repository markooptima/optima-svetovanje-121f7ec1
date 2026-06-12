## Pomembna ugotovitev: vaš projekt NI statična SPA

Preden popravim karkoli, moram pojasniti, ker bodo predlagani popravki (iz Stack Overflow nasveta) pripeljali do nove napake:

Vaš projekt je **TanStack Start** aplikacija (SSR, server functions, nitro build), ne navadna Vite SPA. To pomeni:

- **Build NE generira `dist/client/index.html`**, ki bi ga Vercel lahko serviral kot statično stran. Nitro zgradi server bundle (privzeto za Cloudflare Workers).
- Aplikacija **potrebuje strežniško okolje** za delovanje server functions, SSR in TanStack Router.
- Trenutni `vercel.json` je pokvarjena predloga — `app/server.ts` ne obstaja, `dist/client/index.html` ne obstaja, in `rewrites` na `/index.html` ne deluje. Zato 404.

Zato je možnih **več scenarijev**, ne en sam — in moram vedeti, kateri si želite, preden delam spremembe.

---

## Možnost A — Pustiti Lovable (priporočam)

Vaš projekt **že deluje** na `https://optima-svetovanje.lovable.app` z vsem (SSR, baza, AI, server functions). Lahko brezplačno dodate svojo domeno v **Project Settings → Domains**.

**Kaj naredim:** nič — projekt že deluje. Samo opozorim na .env zadevo (spodaj).

---

## Možnost B — Deploy na Vercel kot SSR (z Node runtime)

Da TanStack Start deluje na Vercelu, je potrebno:

1. **Spremeniti nitro target** iz Cloudflare na Vercel — v `vite.config.ts` dodati nitro preset `vercel` ali `vercel-edge`.
2. **Prepisati `vercel.json`** — odstrani functions/rewrites/outputDirectory; Vercel sam zazna nitro output (`.vercel/output/`).
3. **Nastaviti env vars v Vercelu** (Settings → Environment Variables):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`
   - **NE** `SUPABASE_SERVICE_ROLE_KEY` (do nje nimate dostopa, in trenutno je v kodi ne potrebujete)
   - **NE** `LOVABLE_API_KEY` (do nje nimate dostopa preko Lovable Cloud)
4. **Posledica:** vse trenutne funkcionalnosti delujejo, server functions tudi (z anon kontekstom). Če bi pa želeli kdaj uporabljati `supabaseAdmin` (npr. za varnostne popravke obrazca), ne bi delovalo, ker `SUPABASE_SERVICE_ROLE_KEY` ni dostopen.

**Kaj naredim:**
- Posodobim `vite.config.ts` z `nitro: { preset: "vercel" }`
- Prepišem `vercel.json` na minimalno verzijo (ali ga sploh izbrišem)
- Vam dam seznam env vars za vnos v Vercel dashboard
- Testiram lokalno `bun run build` da preverim output

---

## Možnost C — Static export brez SSR (NE priporočam za vašo app)

Bilo bi treba odstraniti vse server functions (`requireSupabaseAuth`, `createServerFn`) in TanStack Start spremeniti v navadno Vite SPA z React Router. To je **velika preureditev**, izgubili bi SSR (slabši SEO za og:image, og:title po straneh) in vse varnostne izboljšave bi morale ostati izključno klient-side.

Ne svetujem.

---

## V vsakem primeru: `.env` v git repu

`.env` vsebuje samo **VITE_SUPABASE_URL** in **VITE_SUPABASE_PUBLISHABLE_KEY** — to sta javna ključa, namenjena objavi v brskalniku. **Ni varnostne nevarnosti**, da sta v repu. Vendar je dobra praksa, da `.env` ni v git zgodovini.

Pomembno: **Lovable interno upravlja `.env`** — ne morem ga preprosto dodati v `.gitignore` ali izbrisati iz Lovable file systema, ker bi to lahko zlomilo internal sync. To zadevo lahko uredite **v vašem GitHub repu lokalno**:

```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"
git push
```

To bo počistilo trenutno stanje; zgodovino lahko prepišete z `git filter-repo`, ampak ker so ključi javni anon ključi, ni potrebno.

---

## Moje vprašanje za vas

**Katero možnost izberete: A, B ali C?**

- Če **A** (ostanete na Lovable) → ne delam ničesar v kodi, samo opišem kako dodati svojo domeno.
- Če **B** (Vercel SSR z nitro vercel presetom) → naredim spremembe v `vite.config.ts` in `vercel.json`, podam seznam env vars.
- Če **C** (static SPA) → potrebujem še eno potrditev, ker je to velika preureditev z izgubo funkcij.

Brez vaše izbire ne bom slepo aplicirati popravkov iz SO nasveta, ker so napisani za drugačen tip projekta in bi povzročili novo napako.
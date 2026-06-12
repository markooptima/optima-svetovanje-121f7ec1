## Težava

E-poštna obvestila prihajajo s preview/lovable.app domene, ne pa s `optima-svetovanje.si` (Vercel).

Razlog: server funkcija `notifyInquiry` bere `process.env.RESEND_API_KEY`. Na Lovable Cloud je ključ nastavljen, na **Vercelu pa še ne** (ali pa zadnji deploy še ne uporablja novega ključa).

## Koraki za rešitev

1. **Vercel Dashboard → Project → Settings → Environment Variables**
   - Dodaj (ali uredi) `RESEND_API_KEY` z novo vrednostjo `re_...`
   - Označi vse okolice: **Production, Preview, Development**
   - Shrani

2. **Vercel → Deployments → zadnji deployment → ⋯ → Redeploy**
   - Brez redeploya nova okoljska spremenljivka ne začne veljati
   - Po redeployu počakaj ~30 s, da gre live

3. **Test na `optima-svetovanje.si`**
   - Pošlji testno povpraševanje
   - Če mail ne pride: odpri Vercel → Deployment → **Functions / Logs** in poglej napake (`[notifyInquiry] resend failed ...` ali `RESEND_API_KEY missing`)

## Najpogostejši vzroki, če še vedno ne deluje

- Ključ je dodan samo v "Production" — manjka Preview/Development
- Pozabljen redeploy (brez tega Vercel še vedno uporablja star/manjkajoč key)
- Vrednost ima presledek/novo vrstico pri prilepljanju
- Resend ključ ima napačne pravice (potreben **Sending access**)
- Domena `onboarding@resend.dev` je še vedno OK za testiranje; če uporabljaš lastno domeno, mora biti verificirana v Resendu

## Naslednji korak

Sporoči mi po redeployu, ali test deluje. Če ne, prilepi error iz Vercel Function logov in ti pokažem točen popravek.

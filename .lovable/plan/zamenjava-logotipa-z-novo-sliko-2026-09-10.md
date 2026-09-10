# Zamenjava logotipa z novo sliko

Naložim novo podano sliko logotipa v Lovable Assets CDN in jo uporabim na mestih, kjer se trenutno prikazuje stari logotip.

## Koraki

1. **Naloži novo sliko v CDN**
   - Uporabi `lovable-assets create` za `/mnt/user-uploads/WhatsApp_Image_2026-09-10_at_14.54.59.jpeg`.
   - Shrani kazalec v `src/assets/optima-logo.jpg.asset.json` (ali ustrezno ime glede na izhod CLI-ja).

2. **Posodobi uvoz logotipa**
   - `src/components/site/Logo.tsx`: zamenjaj `import logo from "@/assets/optima-logo.jpg"` z uvozom nove `.asset.json` datoteke.
   - `src/routes/index.tsx`: enako za logotip v nogi (footer).

3. **Odstrani staro datoteko**
   - Izbriši `src/assets/optima-logo.jpg`, ker je zdaj zamenjana z CDN kazalcem.

4. **Preveri prikaz**
   - Poženi build in preveri, da se novi logotip pravilno prikazuje v glavi in nogi ter da je OS znak centriran v kvadratku.

## Sprememba je omejena na

- Samo vizualno zamenjavo logotipa.
- Nobene spremembe obrazca, Supabase, Resend, Vercel ali drugih funkcionalnosti.

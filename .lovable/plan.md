Ugotovitev: koda po vnosu povpraševanja shrani podatke, nato pa email obvestilo pošlje “v ozadju”. Zato lahko uporabnik vidi uspeh, tudi če email ne uspe. Na Lovable Cloud je `RESEND_API_KEY` nastavljen, v zadnji uri pa ni logov `notifyInquiry`, kar pomeni, da test verjetno ni bil narejen na Lovable domeni ali pa Vercel okolje tega loga ne pošilja sem.

Plan:
1. Dodam bolj zanesljivo obravnavo pošiljanja obvestila v obrazcu:
   - po shranitvi povpraševanja počakamo na rezultat `notifyInquiry`,
   - če email odpove, uporabniku prikažemo jasno opozorilo namesto tihega neuspeha,
   - uspešno shranjeno povpraševanje ostane shranjeno.

2. Dodam bolj jasne server loge v email funkciji:
   - log ob začetku pošiljanja,
   - log ob uspešno sprejetem emailu,
   - ob napaki se zapiše status in odgovor ponudnika.

3. Po implementaciji preverimo Lovable verzijo z novim testnim povpraševanjem.

4. Za `optima-svetovanje.si` ostane obvezen zunanji korak:
   - v Vercelu mora obstajati `RESEND_API_KEY`,
   - po spremembi je nujen redeploy,
   - če še vedno ne pride, je treba pogledati Vercel Function logs, ker teh logov ne morem videti iz Lovable okolja.

Tehnična opomba: trenutno je prejemnik nastavljen na `marko.optima.svetovanje@gmail.com`, pošiljatelj pa `Optima Povpraševanje <onboarding@resend.dev>`. Če uporabljaš nov Resend račun, mora imeti ključ dovoljenje za pošiljanje; za lastno domeno mora biti domena potrjena v Resendu.
# SMS obvestilo, ko e-pošta ne uspe

Ko oddaja povpraševanja uspešno shrani podatke, a e-poštno obvestilo ne gre skozi (trenutno Resend vrača napako 401 – neveljaven ključ), naj sistem pošlje kratek SMS povzetek na **+386 40 163 633**.

## Kako bo delovalo

1. Stranka odda obrazec → podatki se shranijo v bazo (nespremenjeno).
2. Sistem poskusi poslati e-pošto na marko.optima.svetovanje@gmail.com (nespremenjeno).
3. Če e-pošta **ne uspe** (napaka ključa, zavrnitev, izpad), se samodejno pošlje SMS:
   - ime in priimek, telefon stranke, izbrane storitve
   - opomba, da e-poštno obvestilo ni uspelo
4. Če e-pošta uspe, se SMS **ne** pošlje.
5. Sporočilo v obrazcu se posodobi: ko uspe SMS, stranka/ti vidiš, da je obvestilo poslano po SMS.

## Kaj potrebujem od tebe

SMS pošiljanje zahteva ponudnika – uporabil bom **Twilio** (podprt konektor). Pred izvedbo boš moral povezati Twilio račun (odprem ti povezovalno kartico) in imeti Twilio telefonsko številko, s katere se pošilja. Twilio SMS je plačljiv po sporočilu.

## Stroški (Twilio)

- SMS na številke v Sloveniji: približno 0,06–0,10 USD na sporočilo (točna cena je odvisna od operaterja prejemnika; točen znesek pokaže Twilio pricing stran za SI).
- Twilio telefonska številka (pošiljatelj): približno 1–1,5 USD mesečno najemnine.
- Pri obsegu te strani (nekaj povpraševanj na mesec) so skupni stroški znosni, ker se SMS pošlje samo, ko e-pošta ne uspe.

## Tehnične podrobnosti

- `src/lib/inquiry-notify.functions.ts`: po neuspešnem Resend klicu (ali ujeti izjemi) klic pomožne funkcije `sendSmsFallback(row)`.
- SMS se pošlje prek Lovable connector gatewaya (`https://connector-gateway.lovable.dev/twilio/Messages.json`, `application/x-www-form-urlencoded`), z `LOVABLE_API_KEY` + `TWILIO_API_KEY` iz okolja; `From` = Twilio številka (nova skrivnost `TWILIO_FROM_NUMBER`), `To` = +38640163633.
- Vračilo funkcije se razširi: `{ ok, channel: 'email' | 'sms' | 'none', error? }`.
- `src/components/site/InquiryForm.tsx`: prikaz besedila glede na `channel` (uspeh po e-pošti / poslano po SMS / obvestilo ni uspelo, a je povpraševanje shranjeno).
- Besedilo SMS je omejeno na ~300 znakov, brez priponk (te ostanejo dostopne v bazi/storage).
- Vsi neuspehi se še naprej beležijo v strežniške zapise (`[notifyInquiry]`, `[smsFallback]`).

## Opomba

To ne odpravi vzroka – Resend ključ je še vedno neveljaven. SMS je le rezervni kanal; vzporedno velja preveriti, da je novi Resend ključ iz računa, kjer je verificirana domena optima-svetovanje.si.

# Landing page yaratish uchun prompt

Quyidagi matnni istalgan AI yordamchiga (Claude, ChatGPT va h.k.) toʻliq nusxalab bering.

---

Men uchun shaxsiy **creative portfolio landing page** yarat. Men — **Mardonbek Egamberdiyev**, Toshkentlik **full-stack dasturchi**man.

## Texnologiya va fayl tuzilmasi
Faqat sof **HTML, CSS va JavaScript** (framework’siz). Fayllar quyidagicha joylashsin:

```
mardonbek-portfolio/
├── index.html
├── css/style.css
├── js/i18n.js        (barcha tarjimalar)
├── js/main.js        (barcha logika)
└── images/
    ├── profile.png   (mening rasmim)
    ├── favicon.svg
    └── projects/project-1.svg … project-4.svg  (keyin almashtiriladigan namuna rasmlar)
```

## Majburiy funksiyalar
1. **Dark / Light rejim.** Boshida tizim sozlamasiga (`prefers-color-scheme`) moslashsin, tugma bilan almashsin, tanlov `localStorage`da saqlansin. Sahifa ochilganda rang “miltillamasin” (mavzu `<head>`dagi kichik skript orqali oldindan qoʻllansin). Quyosh/oy ikonkasi animatsiya bilan almashsin.
2. **Ikki til: UZ / EN.** Har bir matn elementida `data-i18n="kalit"` atributi boʻlsin, tarjimalar `js/i18n.js` ichidagi bitta obyektda tursin. Til tugmasi `aria-pressed` bilan, tanlov `localStorage`da saqlansin, `<html lang>` va `document.title` ham oʻzgarsin. Standart til — UZ. Oʻzbekcha matnlarda toʻgʻri belgilar ishlatilsin: oʻ, gʻ (U+02BB) va tutuq belgisi ʼ.
3. **Juda kreativ, lekin shablonga oʻxshamaydigan dizayn.**

## Dizayn konsepsiyasi: “Samarqand koshini + kod”
- **Ranglar** Registon koshinlaridan olinsin:
  - Light: fon `#EDF1F7`, matn `#13213F`, firuza `#0B8F8A`, zaʼfaron `#D98A1C`, anor `#C2304A`, lojuvard `#1F3FB4`.
  - Dark: fon `#0C1633` (toʻq lojuvard, qora emas), matn `#EAF0FA`, firuza `#3ED6CB`, zaʼfaron `#F6B64C`, anor `#F0627A`, lojuvard `#7D97FF`.
  - Barcha ranglar `:root`dagi CSS oʻzgaruvchilarida boʻlsin.
- **Shriftlar:** sarlavhalar uchun keng va qalin **Unbounded**, matn uchun **Onest** (Google Fonts), har biriga zaxira shrift steki.
- **Asosiy “wow” element — hero’dagi interaktiv ikat/girih naqshi:** `<canvas>` ustida romb (diamond) panjarasi chiziladi; har bir romb ichida fon rangidagi “koʻz” va undan ham kichik boshqa rangli romb boʻladi (ikat matosiga oʻxshab). Sichqoncha yaqinidagi romblar kattalashib, yorqinlashadi; kursor boʻlmasa, fokus nuqtasi oʻzi sekin “sayr” qiladi. Naqsh radial `mask-image` bilan chetlarga qarab yoʻqolsin. Mavzu almashganda ranglari ham yangilansin. Ekrandan chiqqanda va tab yashirin boʻlganda animatsiya toʻxtasin.
- **Profil rasmi peshtoq (pointed arch) shaklida** SVG `clipPath` orqali kesilsin; orqasida biroz siljigan zaʼfaron rangli, panjarasimon naqshli ikkinchi arka tursin. Rasm ustida “Yangi loyihalarga ochiqman” degan, pulslanuvchi yashil nuqtali kichik belgi boʻlsin.
- Ismning ikkinchi qatori (familiya) faqat kontur (`-webkit-text-stroke`) koʻrinishida, hover qilinganda toʻladi. Ism qatorlari hech qachon harf boʻyicha boʻlinmasin (`white-space: nowrap`).
- **Faqat bitta orkestrlangan animatsiya:** sahifa ochilganda ism harflari birin-ketin chiqadi, keyin rol, matn va tugmalar. Har bir boʻlimga “fade-up” qoʻshma.
- Boshqa dekoratsiya kam: romb shakli (◆) — yagona takrorlanuvchi motiv (logo, faol menyu belgisi, koʻnikma guruhlari, timeline nuqtalari).

## Boʻlimlar
1. **Header (sticky, blur fon):** romb logotip + ism, menyu (Men haqimda, Loyihalar, Tajriba, Aloqa), UZ/EN tugmasi, mavzu tugmasi. Scroll paytida faol boʻlim menyuda romb bilan belgilansin. Mobil’da hamburger menyu (Escape bilan yopiladi).
2. **Hero:** salomlashuv, katta ism, rol, qisqa taʼrif, 2 ta tugma (“Loyihalarni koʻrish”, “Bogʻlanish”), peshtoq shaklidagi rasm, naqsh canvas’i.
3. **Men haqimda:** 2 paragraf + koʻnikmalar 3 guruhda (Frontend, Backend, Asboblar), har biri “pill” koʻrinishida.
4. **Loyihalar:** 4 ta loyiha assimetrik gridda (5 ustunli grid: 3+2, 2+3). Har birida rasm (hover’da sekin zoom), nom, taʼrif, texnologiya teglari.
5. **Tajriba:** vertikal timeline (yillar, lavozim, joy, taʼrif). Eng oxirgi ish toʻldirilgan romb bilan belgilansin.
6. **Aloqa:** katta sarlavha “Keling, birga nimadir quramiz”, email havola + “Nusxalash” tugmasi (toast xabari bilan), ijtimoiy tarmoqlar (GitHub, Telegram, LinkedIn), forma (ism, email, xabar) — tekshiradi va `mailto:` orqali yuboradi, xatoni aniq koʻrsatadi.
7. **Footer:** © yil (JS bilan avtomatik), “Toshkentda, kod va choy bilan yaratildi”, “Yuqoriga qaytish”.

## Sifat talablari
- Toʻliq responsive (390px telefondan katta ekrangacha), `viewport-fit=cover` va safe-area padding’lari.
- Klaviatura fokusi aniq koʻrinsin, “Asosiy qismga oʻtish” havolasi boʻlsin, barcha tugmalarda `aria-label`.
- `prefers-reduced-motion` yoqilgan boʻlsa, barcha animatsiyalar oʻchsin, naqsh statik chizilsin.
- `localStorage` chaqiruvlari `try/catch` ichida boʻlsin.
- Kod izohlari oʻzbek tilida, oʻqilishi oson boʻlsin.
- Matnlar sodda, aniq va jonli boʻlsin; “Submit” kabi umumiy soʻzlar emas, harakatni aniq aytuvchi tugmalar (“Xabarni yuborish”).

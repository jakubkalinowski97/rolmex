# Garden Equipment Rental Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static garden equipment rental website with TinaCMS-managed catalog, blog, and FAQ.

**Architecture:** Astro SSG generates static pages from Markdown/JSON content managed via TinaCMS git-based. Tailwind CSS for styling with an energetic orange+green theme. No backend, no reservation system — contact by phone.

**Tech Stack:** Astro 5, TinaCMS (git-based), Tailwind CSS 4, TypeScript

---

## File Structure

```
rolmex/
├── astro.config.mjs          # Astro config with Tailwind
├── package.json
├── tsconfig.json
├── tina/
│   └── config.ts             # TinaCMS collections (categories, equipment, blog, FAQ)
├── src/
│   ├── styles/
│   │   └── global.css        # Tailwind directives + custom styles
│   ├── lib/
│   │   └── company.ts        # Static company data (address, phone, hours, map coords)
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML layout with head, header, footer
│   ├── components/
│   │   ├── Header.astro      # Sticky nav with logo, menu, phone number
│   │   ├── MobileMenu.astro  # Hamburger menu for mobile
│   │   ├── Footer.astro      # 3-column footer
│   │   ├── HeroSection.astro # Hero banner with CTA
│   │   ├── CategoryGrid.astro# Grid of category cards with icons
│   │   ├── EquipmentCard.astro# Single product card (thumbnail, name, price)
│   │   ├── FeaturedEquipment.astro # Featured products section for homepage
│   │   ├── WhyUs.astro       # "Why choose us" section
│   │   ├── LatestPosts.astro # Latest blog posts section
│   │   ├── FaqAccordion.astro# Collapsible FAQ items
│   │   └── GoogleMap.astro   # Embedded Google Map
│   ├── pages/
│   │   ├── index.astro       # Homepage
│   │   ├── katalog/
│   │   │   ├── index.astro   # Catalog with category filters
│   │   │   ├── [slug].astro  # Product detail page
│   │   │   └── kategoria/
│   │   │       └── [slug].astro # Category-filtered catalog
│   │   ├── o-nas.astro       # About us
│   │   ├── blog/
│   │   │   ├── index.astro   # Blog listing
│   │   │   └── [slug].astro  # Blog post
│   │   ├── faq.astro         # FAQ page
│   │   └── kontakt.astro     # Contact page
├── content/
│   ├── categories/           # TinaCMS category markdown files
│   ├── equipment/            # TinaCMS equipment markdown files
│   ├── blog/                 # TinaCMS blog markdown files
│   └── faq/                  # TinaCMS FAQ markdown files
└── public/
    └── images/               # Static images (logo, hero, placeholders)
```

---

### Task 1: Project Scaffolding — Astro + Tailwind

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro` (placeholder)

- [ ] **Step 1: Initialize Astro project**

```bash
cd /Users/jakubkalinowski/rolmex
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/tailwind tailwindcss @astrojs/sitemap
```

- [ ] **Step 3: Configure Astro with Tailwind**

Replace `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wypozyczalniarutki.pl',
  integrations: [tailwind(), sitemap()],
});
```

- [ ] **Step 4: Create global CSS with Tailwind directives and theme**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #F97316;
  --color-primary-dark: #EA580C;
  --color-secondary: #16A34A;
  --color-secondary-dark: #15803D;
  --color-bg: #F9FAFB;
  --color-text: #1F2937;
  --color-text-light: #6B7280;
  --font-family-sans: 'Inter', sans-serif;
}
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Astro dev server running on `localhost:4321`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with Tailwind CSS"
```

---

### Task 2: TinaCMS Setup + Collections

**Files:**
- Create: `tina/config.ts`
- Modify: `package.json` (add tina dependency)

- [ ] **Step 1: Install TinaCMS**

```bash
npx @tinacms/cli@latest init
```

Follow prompts: select "Other" framework, confirm defaults. This creates `tina/config.ts` scaffold.

- [ ] **Step 2: Replace `tina/config.ts` with full collections config**

```ts
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "category",
        label: "Kategorie",
        path: "content/categories",
        format: "md",
        fields: [
          { type: "string", name: "nazwa", label: "Nazwa", required: true },
          { type: "string", name: "slug", label: "Slug URL", required: true },
          { type: "string", name: "opis", label: "Opis" },
          { type: "string", name: "ikona", label: "Ikona (nazwa Lucide)", required: true },
          { type: "number", name: "kolejnosc", label: "Kolejność sortowania" },
        ],
      },
      {
        name: "equipment",
        label: "Sprzęt",
        path: "content/equipment",
        format: "md",
        fields: [
          { type: "string", name: "nazwa", label: "Nazwa", required: true },
          { type: "string", name: "slug", label: "Slug URL", required: true },
          { type: "image", name: "zdjecie", label: "Zdjęcie główne" },
          {
            type: "object",
            name: "galeria",
            label: "Galeria",
            list: true,
            fields: [
              { type: "image", name: "src", label: "Zdjęcie" },
              { type: "string", name: "alt", label: "Opis alt" },
            ],
          },
          { type: "rich-text", name: "body", label: "Opis", isBody: true },
          {
            type: "reference",
            name: "kategoria",
            label: "Kategoria",
            collections: ["category"],
          },
          { type: "number", name: "cena_doba", label: "Cena za dobę (PLN)", required: true },
          { type: "number", name: "cena_weekend", label: "Cena za weekend (PLN)", required: true },
          { type: "number", name: "cena_tydzien", label: "Cena za tydzień (PLN)", required: true },
          {
            type: "object",
            name: "parametry",
            label: "Parametry techniczne",
            list: true,
            fields: [
              { type: "string", name: "nazwa", label: "Parametr" },
              { type: "string", name: "wartosc", label: "Wartość" },
            ],
          },
          { type: "boolean", name: "dostepny", label: "Dostępny" },
          { type: "boolean", name: "wyroziony", label: "Wyróżniony (strona główna)" },
        ],
      },
      {
        name: "blog",
        label: "Blog",
        path: "content/blog",
        format: "md",
        fields: [
          { type: "string", name: "tytul", label: "Tytuł", required: true },
          { type: "string", name: "slug", label: "Slug URL", required: true },
          { type: "image", name: "zdjecie", label: "Zdjęcie wyróżniające" },
          { type: "datetime", name: "data", label: "Data publikacji", required: true },
          { type: "string", name: "autor", label: "Autor" },
          { type: "string", name: "tagi", label: "Tagi", list: true },
          { type: "rich-text", name: "body", label: "Treść", isBody: true },
        ],
      },
      {
        name: "faq",
        label: "FAQ",
        path: "content/faq",
        format: "md",
        fields: [
          { type: "string", name: "pytanie", label: "Pytanie", required: true },
          { type: "rich-text", name: "body", label: "Odpowiedź", isBody: true },
          { type: "number", name: "kolejnosc", label: "Kolejność sortowania" },
        ],
      },
    ],
  },
});
```

- [ ] **Step 3: Create content directories and sample content**

Create `content/categories/kosiarki.md`:

```md
---
nazwa: Kosiarki
slug: kosiarki
opis: Kosiarki spalinowe i elektryczne do każdego ogrodu
ikona: Scissors
kolejnosc: 1
---
```

Create `content/categories/pily-lancuchowe.md`:

```md
---
nazwa: Piły łańcuchowe
slug: pily-lancuchowe
opis: Piły łańcuchowe do drewna i pielęgnacji drzew
ikona: TreePine
kolejnosc: 2
---
```

Create `content/categories/glebogryzarki.md`:

```md
---
nazwa: Glebogryzarki
slug: glebogryzarki
opis: Glebogryzarki do przygotowania gleby
ikona: Shovel
kolejnosc: 3
---
```

Create `content/categories/dmuchawy.md`:

```md
---
nazwa: Dmuchawy i odkurzacze
slug: dmuchawy
opis: Dmuchawy i odkurzacze do liści
ikona: Wind
kolejnosc: 4
---
```

Create `content/categories/nozyce-do-zywoplotu.md`:

```md
---
nazwa: Nożyce do żywopłotu
slug: nozyce-do-zywoplotu
opis: Nożyce elektryczne i spalinowe do żywopłotu
ikona: Fence
kolejnosc: 5
---
```

Create `content/categories/wertykulatory.md`:

```md
---
nazwa: Wertykulatory
slug: wertykulatory
opis: Wertykulatory do pielęgnacji trawnika
ikona: Leaf
kolejnosc: 6
---
```

- [ ] **Step 4: Create sample equipment**

Create `content/equipment/kosiarka-spalinowa-honda.md`:

```md
---
nazwa: Kosiarka spalinowa Honda HRG 466
slug: kosiarka-spalinowa-honda
zdjecie: /images/placeholder-mower.jpg
kategoria: content/categories/kosiarki.md
cena_doba: 80
cena_weekend: 120
cena_tydzien: 350
parametry:
  - nazwa: Moc silnika
    wartosc: 3.5 KM
  - nazwa: Szerokość koszenia
    wartosc: 46 cm
  - nazwa: Waga
    wartosc: 27 kg
  - nazwa: Pojemność kosza
    wartosc: 55 L
dostepny: true
wyroziony: true
---

Kosiarka spalinowa Honda HRG 466 to niezawodne urządzenie do koszenia trawników o średniej i dużej powierzchni. Napęd na koła ułatwia pracę na nierównym terenie.
```

Create `content/equipment/pila-lancuchowa-stihl.md`:

```md
---
nazwa: Piła łańcuchowa STIHL MS 170
slug: pila-lancuchowa-stihl
zdjecie: /images/placeholder-chainsaw.jpg
kategoria: content/categories/pily-lancuchowe.md
cena_doba: 70
cena_weekend: 100
cena_tydzien: 300
parametry:
  - nazwa: Moc
    wartosc: 1.8 KM
  - nazwa: Długość prowadnicy
    wartosc: 35 cm
  - nazwa: Waga
    wartosc: 3.9 kg
dostepny: true
wyroziony: true
---

Piła łańcuchowa STIHL MS 170 — lekka, kompaktowa i wydajna. Idealna do przycinania drzew, cięcia drewna opałowego i prac porządkowych w ogrodzie.
```

Create `content/equipment/glebogryzarka-husqvarna.md`:

```md
---
nazwa: Glebogryzarka Husqvarna TF 325
slug: glebogryzarka-husqvarna
zdjecie: /images/placeholder-tiller.jpg
kategoria: content/categories/glebogryzarki.md
cena_doba: 120
cena_weekend: 180
cena_tydzien: 500
parametry:
  - nazwa: Moc silnika
    wartosc: 4.89 KM
  - nazwa: Szerokość robocza
    wartosc: 68 cm
  - nazwa: Waga
    wartosc: 46 kg
  - nazwa: Głębokość pracy
    wartosc: 30 cm
dostepny: true
wyroziony: true
---

Glebogryzarka Husqvarna TF 325 to profesjonalne narzędzie do uprawy gleby. Idealna do przygotowania grządek, rabat i trawników.
```

Create `content/equipment/dmuchawa-makita.md`:

```md
---
nazwa: Dmuchawa akumulatorowa Makita DUB363
slug: dmuchawa-makita
zdjecie: /images/placeholder-blower.jpg
kategoria: content/categories/dmuchawy.md
cena_doba: 50
cena_weekend: 75
cena_tydzien: 200
parametry:
  - nazwa: Napięcie
    wartosc: 2x18V
  - nazwa: Prędkość powietrza
    wartosc: 54 m/s
  - nazwa: Waga
    wartosc: 3.7 kg
dostepny: true
wyroziony: false
---

Dmuchawa akumulatorowa Makita DUB363 — cicha, bezprzewodowa i wydajna. Do porządkowania liści, trawników i chodników.
```

- [ ] **Step 5: Create sample blog posts**

Create `content/blog/jak-przygotowac-trawnik-na-wiosne.md`:

```md
---
tytul: Jak przygotować trawnik na wiosnę
slug: jak-przygotowac-trawnik-na-wiosne
zdjecie: /images/placeholder-lawn.jpg
data: 2026-03-15T00:00:00.000Z
autor: Rolmex
tagi:
  - trawnik
  - wiosna
  - porady
---

Wiosna to kluczowy moment dla Twojego trawnika. Dowiedz się, jakie kroki podjąć, aby cieszyć się piękną zielenią przez cały sezon.

## Krok 1: Grabienie i czyszczenie

Po zimie na trawniku zbiera się warstwa obumarłych liści i resztek roślinnych. Dokładne grabienie pozwala trawie oddychać i zapobiega chorobom grzybowym.

## Krok 2: Wertykulator

Wertykulator to urządzenie, które nacina darń i usuwa filc — warstwę obumarłej trawy zalegającej na powierzchni. Zalecamy wertykukację raz w roku, na wiosnę.

## Krok 3: Nawożenie

Po wertykukacji trawnik jest gotowy na przyjęcie nawozu. Stosuj nawóz wiosenny bogaty w azot, który pobudzi wzrost trawy.
```

Create `content/blog/bezpieczenstwo-przy-pracy-z-pila-lancuchowa.md`:

```md
---
tytul: Bezpieczeństwo przy pracy z piłą łańcuchową
slug: bezpieczenstwo-przy-pracy-z-pila-lancuchowa
zdjecie: /images/placeholder-safety.jpg
data: 2026-02-20T00:00:00.000Z
autor: Rolmex
tagi:
  - bezpieczeństwo
  - piła łańcuchowa
  - poradnik
---

Piła łańcuchowa to potężne narzędzie, które wymaga odpowiedniego przygotowania i ostrożności. Oto najważniejsze zasady bezpieczeństwa.

## Odzież ochronna

Zawsze noś: kask z osłoną twarzy, rękawice antywibracyjne, spodnie z wkładką antyprzecięciową i buty ochronne.

## Sprawdzenie sprzętu

Przed każdym użyciem sprawdź napięcie łańcucha, poziom oleju i stan prowadnicy. Nigdy nie pracuj uszkodzonym sprzętem.

## Technika pracy

Trzymaj piłę oburącz, nigdy nie pracuj powyżej wysokości ramion i zawsze planuj kierunek upadku gałęzi.
```

- [ ] **Step 6: Create sample FAQ entries**

Create `content/faq/jak-wypozyczyc.md`:

```md
---
pytanie: Jak wypożyczyć sprzęt?
kolejnosc: 1
---

Wystarczy zadzwonić pod nasz numer telefonu lub odwiedzić nas osobiście. Doradzimy w wyborze odpowiedniego sprzętu i ustalimy termin wypożyczenia.
```

Create `content/faq/jakie-dokumenty.md`:

```md
---
pytanie: Jakie dokumenty są potrzebne?
kolejnosc: 2
---

Wymagamy dowodu osobistego oraz wpłaty kaucji zwrotnej. Wysokość kaucji zależy od rodzaju wypożyczanego sprzętu.
```

Create `content/faq/czy-dostarczacie.md`:

```md
---
pytanie: Czy dostarczacie sprzęt pod wskazany adres?
kolejnosc: 3
---

Tak, oferujemy dostawę sprzętu na terenie miasta i okolic. Koszt dostawy ustalany jest indywidualnie w zależności od odległości.
```

Create `content/faq/co-w-razie-awarii.md`:

```md
---
pytanie: Co w razie awarii sprzętu?
kolejnosc: 4
---

W przypadku awarii prosimy o natychmiastowy kontakt telefoniczny. Wymienimy sprzęt na sprawny lub dokonamy naprawy. Klient nie ponosi kosztów naprawy wynikającej z normalnego użytkowania.
```

- [ ] **Step 7: Verify TinaCMS dev server starts**

```bash
npx tinacms dev -c "astro dev"
```

Expected: TinaCMS admin panel at `localhost:4321/admin`, Astro dev server running.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: configure TinaCMS with collections and sample content"
```

---

### Task 3: Company Data + Base Layout + Header + Footer

**Files:**
- Create: `src/lib/company.ts`
- Create: `src/layouts/Layout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/MobileMenu.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create static company data**

Create `src/lib/company.ts`:

```ts
export const company = {
  nazwa: "Rolmex",
  pelna_nazwa: "Rolmex - Wypożyczalnia Sprzętu Ogrodowego",
  adres: {
    ulica: "ul. Ogrodowa 15",
    miasto: "Warszawa",
    kod: "00-001",
  },
  telefon: "+48 123 456 789",
  telefonLink: "tel:+48123456789",
  email: "kontakt@rolmex.pl",
  godziny: {
    pn_pt: "8:00 - 18:00",
    sobota: "9:00 - 14:00",
    niedziela: "Nieczynne",
  },
  mapa: {
    lat: 52.2297,
    lng: 21.0122,
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.8!2d21.012!3d52.229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDEzJzQ3LjAiTiAyMcKwMDAnNDMuOSJF!5e0!3m2!1spl!2spl!4v1",
  },
  social: {
    facebook: "https://facebook.com/rolmex",
    instagram: "https://instagram.com/rolmex",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/katalog", label: "Katalog" },
  { href: "/o-nas", label: "O nas" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
```

- [ ] **Step 2: Create base Layout**

Create `src/layouts/Layout.astro`:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import { company } from "../lib/company";

interface Props {
  title: string;
  description?: string;
}

const { title, description = `${company.pelna_nazwa} — wynajem kosiarek, pilarek, glebogryzarek i innego sprzętu ogrodowego.` } = Astro.props;
---

<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <title>{title} | {company.nazwa}</title>
  </head>
  <body class="bg-bg text-text font-sans min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: Create Header component**

Create `src/components/Header.astro`:

```astro
---
import { company, navLinks } from "../lib/company";
---

<header class="bg-white shadow-sm sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 lg:h-20">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2">
        <span class="text-2xl font-extrabold text-primary">Rolmex</span>
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            href={link.href}
            class="text-text hover:text-primary font-medium transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <!-- Phone + Mobile Toggle -->
      <div class="flex items-center gap-4">
        <a
          href={company.telefonLink}
          class="hidden sm:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          {company.telefon}
        </a>

        <!-- Mobile menu button -->
        <button
          id="mobile-menu-btn"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <nav id="mobile-menu" class="lg:hidden hidden pb-4">
      {navLinks.map((link) => (
        <a
          href={link.href}
          class="block py-2 text-text hover:text-primary font-medium transition-colors"
        >
          {link.label}
        </a>
      ))}
      <a
        href={company.telefonLink}
        class="block mt-2 text-center bg-primary text-white px-4 py-2 rounded-lg font-semibold sm:hidden"
      >
        {company.telefon}
      </a>
    </nav>
  </div>
</header>

<script>
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  btn?.addEventListener("click", () => {
    menu?.classList.toggle("hidden");
  });
</script>
```

- [ ] **Step 4: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
import { company, navLinks } from "../lib/company";
---

<footer class="bg-gray-900 text-gray-300 mt-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Column 1: Quick Links -->
      <div>
        <h3 class="text-white font-bold text-lg mb-4">Szybkie linki</h3>
        <ul class="space-y-2">
          {navLinks.map((link) => (
            <li>
              <a href={link.href} class="hover:text-primary transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Column 2: Contact -->
      <div>
        <h3 class="text-white font-bold text-lg mb-4">Kontakt</h3>
        <ul class="space-y-2">
          <li>{company.adres.ulica}</li>
          <li>{company.adres.kod} {company.adres.miasto}</li>
          <li>
            <a href={company.telefonLink} class="hover:text-primary transition-colors">
              {company.telefon}
            </a>
          </li>
          <li>
            <a href={`mailto:${company.email}`} class="hover:text-primary transition-colors">
              {company.email}
            </a>
          </li>
        </ul>
      </div>

      <!-- Column 3: Opening Hours -->
      <div>
        <h3 class="text-white font-bold text-lg mb-4">Godziny otwarcia</h3>
        <ul class="space-y-2">
          <li>Poniedziałek - Piątek: {company.godziny.pn_pt}</li>
          <li>Sobota: {company.godziny.sobota}</li>
          <li>Niedziela: {company.godziny.niedziela}</li>
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} {company.pelna_nazwa}. Wszelkie prawa zastrzeżone.
    </div>
  </div>
</footer>
```

- [ ] **Step 5: Verify layout renders**

Update `src/pages/index.astro` temporarily:

```astro
---
import Layout from "../layouts/Layout.astro";
---

<Layout title="Strona główna">
  <div class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold">Rolmex — w budowie</h1>
  </div>
</Layout>
```

Run: `npx tinacms dev -c "astro dev"` and check `localhost:4321`.

Expected: Page with sticky header, footer, and placeholder content.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add company data, base layout, header and footer"
```

---

### Task 4: Homepage Components + Page

**Files:**
- Create: `src/components/HeroSection.astro`
- Create: `src/components/CategoryGrid.astro`
- Create: `src/components/EquipmentCard.astro`
- Create: `src/components/FeaturedEquipment.astro`
- Create: `src/components/WhyUs.astro`
- Create: `src/components/LatestPosts.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create HeroSection**

Create `src/components/HeroSection.astro`:

```astro
---
import { company } from "../lib/company";
---

<section class="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
  <div class="absolute inset-0 bg-[url('/images/hero-garden.jpg')] bg-cover bg-center opacity-30"></div>
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl">
      Wypożycz sprzęt ogrodowy
      <span class="text-primary">szybko i tanio</span>
    </h1>
    <p class="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl">
      Profesjonalny sprzęt ogrodowy do wynajęcia. Kosiarki, piły, glebogryzarki i wiele więcej — wszystko czego potrzebujesz do zadbania o swój ogród.
    </p>
    <div class="mt-8 flex flex-wrap gap-4">
      <a
        href="/katalog"
        class="inline-flex items-center px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-colors shadow-lg"
      >
        Zobacz katalog
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </a>
      <a
        href={company.telefonLink}
        class="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-gray-900 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        Zadzwoń do nas
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create CategoryGrid**

Create `src/components/CategoryGrid.astro`:

```astro
---
import { getCollection } from "astro:content";

const categories = (await getCollection("category")).sort(
  (a, b) => (a.data.kolejnosc ?? 99) - (b.data.kolejnosc ?? 99)
);
---

<section class="py-16 lg:py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-text">Kategorie sprzętu</h2>
      <p class="mt-4 text-text-light text-lg">Znajdź narzędzie idealne do Twojego zadania</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
      {categories.map((cat) => (
        <a
          href={`/katalog/kategoria/${cat.data.slug}`}
          class="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <div class="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
            <span class="text-secondary text-2xl font-bold">{cat.data.ikona?.charAt(0) ?? "?"}</span>
          </div>
          <h3 class="text-sm font-semibold text-center">{cat.data.nazwa}</h3>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create EquipmentCard**

Create `src/components/EquipmentCard.astro`:

```astro
---
interface Props {
  nazwa: string;
  slug: string;
  zdjecie?: string;
  cena_doba: number;
  dostepny?: boolean;
}

const { nazwa, slug, zdjecie, cena_doba, dostepny = true } = Astro.props;
---

<a
  href={`/katalog/${slug}`}
  class="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
>
  <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
    {zdjecie ? (
      <img
        src={zdjecie}
        alt={nazwa}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    ) : (
      <div class="w-full h-full flex items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
      </div>
    )}
  </div>
  <div class="p-4">
    <h3 class="font-semibold text-text group-hover:text-primary transition-colors">{nazwa}</h3>
    <div class="mt-2 flex items-center justify-between">
      <span class="text-primary font-bold text-lg">{cena_doba} zł<span class="text-sm text-text-light font-normal">/doba</span></span>
      {!dostepny && (
        <span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Niedostępny</span>
      )}
    </div>
  </div>
</a>
```

- [ ] **Step 4: Create FeaturedEquipment**

Create `src/components/FeaturedEquipment.astro`:

```astro
---
import { getCollection } from "astro:content";
import EquipmentCard from "./EquipmentCard.astro";

const equipment = (await getCollection("equipment"))
  .filter((e) => e.data.wyroziony)
  .slice(0, 4);
---

<section class="py-16 lg:py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-text">Polecany sprzęt</h2>
      <p class="mt-4 text-text-light text-lg">Najczęściej wypożyczany przez naszych klientów</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {equipment.map((item) => (
        <EquipmentCard
          nazwa={item.data.nazwa}
          slug={item.data.slug}
          zdjecie={item.data.zdjecie}
          cena_doba={item.data.cena_doba}
          dostepny={item.data.dostepny}
        />
      ))}
    </div>

    <div class="text-center mt-10">
      <a
        href="/katalog"
        class="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
      >
        Zobacz cały katalog
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Create WhyUs**

Create `src/components/WhyUs.astro`:

```astro
---
const reasons = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    title: "Szybko i wygodnie",
    desc: "Odbierz sprzęt tego samego dnia. Bez zbędnych formalności.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    title: "Profesjonalny sprzęt",
    desc: "Regularnie serwisowane maszyny renomowanych marek.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    title: "Atrakcyjne ceny",
    desc: "Konkurencyjne stawki dobowe, weekendowe i tygodniowe.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    title: "Fachowe doradztwo",
    desc: "Pomożemy dobrać sprzęt do Twoich potrzeb i doradzimy w obsłudze.",
  },
];
---

<section class="py-16 lg:py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-text">Dlaczego my?</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {reasons.map((r) => (
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary mb-4">
            <Fragment set:html={r.icon} />
          </div>
          <h3 class="text-lg font-bold mb-2">{r.title}</h3>
          <p class="text-text-light">{r.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 6: Create LatestPosts**

Create `src/components/LatestPosts.astro`:

```astro
---
import { getCollection } from "astro:content";

const posts = (await getCollection("blog"))
  .sort((a, b) => new Date(b.data.data).getTime() - new Date(a.data.data).getTime())
  .slice(0, 3);
---

<section class="py-16 lg:py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl lg:text-4xl font-extrabold text-text">Z naszego bloga</h2>
      <p class="mt-4 text-text-light text-lg">Porady i wskazówki dotyczące pielęgnacji ogrodu</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <a
          href={`/blog/${post.data.slug}`}
          class="group block bg-bg rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
        >
          <div class="aspect-video bg-gray-200 overflow-hidden">
            {post.data.zdjecie ? (
              <img
                src={post.data.zdjecie}
                alt={post.data.tytul}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div class="w-full h-full flex items-center justify-center text-gray-400">Blog</div>
            )}
          </div>
          <div class="p-5">
            <time class="text-sm text-text-light">
              {new Date(post.data.data).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <h3 class="mt-2 font-bold text-lg group-hover:text-primary transition-colors">{post.data.tytul}</h3>
          </div>
        </a>
      ))}
    </div>

    <div class="text-center mt-10">
      <a href="/blog" class="text-primary font-semibold hover:underline">
        Wszystkie artykuły &rarr;
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 7: Assemble homepage**

Replace `src/pages/index.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import HeroSection from "../components/HeroSection.astro";
import CategoryGrid from "../components/CategoryGrid.astro";
import FeaturedEquipment from "../components/FeaturedEquipment.astro";
import WhyUs from "../components/WhyUs.astro";
import LatestPosts from "../components/LatestPosts.astro";
---

<Layout title="Strona główna">
  <HeroSection />
  <CategoryGrid />
  <FeaturedEquipment />
  <WhyUs />
  <LatestPosts />
</Layout>
```

- [ ] **Step 8: Verify homepage renders**

Run: `npx tinacms dev -c "astro dev"`, visit `localhost:4321`.

Expected: Full homepage with hero, categories, featured equipment, why-us, and latest posts sections.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: build homepage with hero, categories, featured equipment, why-us, blog"
```

---

### Task 5: Catalog + Product Detail Pages

**Files:**
- Create: `src/pages/katalog/index.astro`
- Create: `src/pages/katalog/[slug].astro`

- [ ] **Step 1: Create catalog listing page**

Create `src/pages/katalog/index.astro`:

```astro
---
import Layout from "../../layouts/Layout.astro";
import EquipmentCard from "../../components/EquipmentCard.astro";
import { getCollection } from "astro:content";

const categories = (await getCollection("category")).sort(
  (a, b) => (a.data.kolejnosc ?? 99) - (b.data.kolejnosc ?? 99)
);
const equipment = await getCollection("equipment");
---

<Layout title="Katalog sprzętu" description="Przeglądaj nasz katalog sprzętu ogrodowego do wypożyczenia.">
  <section class="py-12 lg:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl lg:text-4xl font-extrabold mb-8">Katalog sprzętu</h1>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar: Category Filters -->
        <aside class="lg:w-64 shrink-0">
          <h2 class="font-bold text-lg mb-4">Kategorie</h2>
          <ul class="space-y-2">
            <li>
              <a
                href="/katalog"
                class="block px-3 py-2 rounded-lg bg-primary text-white font-medium"
              >
                Wszystkie
              </a>
            </li>
            {categories.map((cat) => (
              <li>
                <a
                  href={`/katalog/kategoria/${cat.data.slug}`}
                  class="block px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-text"
                >
                  {cat.data.nazwa}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <!-- Equipment Grid -->
        <div class="flex-1">
          <p class="text-text-light mb-6">{equipment.length} produktów</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <EquipmentCard
                nazwa={item.data.nazwa}
                slug={item.data.slug}
                zdjecie={item.data.zdjecie}
                cena_doba={item.data.cena_doba}
                dostepny={item.data.dostepny}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Create product detail page**

Create `src/pages/katalog/[slug].astro`:

```astro
---
import Layout from "../../layouts/Layout.astro";
import EquipmentCard from "../../components/EquipmentCard.astro";
import { getCollection } from "astro:content";
import { company } from "../../lib/company";

export async function getStaticPaths() {
  const equipment = await getCollection("equipment");
  return equipment.map((item) => ({
    params: { slug: item.data.slug },
    props: { item },
  }));
}

const { item } = Astro.props;
const { Content } = await item.render();

const allEquipment = await getCollection("equipment");
const related = allEquipment
  .filter(
    (e) =>
      e.data.kategoria === item.data.kategoria &&
      e.data.slug !== item.data.slug
  )
  .slice(0, 3);
---

<Layout title={item.data.nazwa} description={`Wypożycz ${item.data.nazwa} — od ${item.data.cena_doba} zł/dobę.`}>
  <section class="py-12 lg:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="text-sm text-text-light mb-6">
        <a href="/katalog" class="hover:text-primary">Katalog</a>
        <span class="mx-2">/</span>
        <span>{item.data.nazwa}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Image -->
        <div>
          <div class="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            {item.data.zdjecie ? (
              <img src={item.data.zdjecie} alt={item.data.nazwa} class="w-full h-full object-cover" />
            ) : (
              <div class="w-full h-full flex items-center justify-center text-gray-400 text-6xl">?</div>
            )}
          </div>

          {item.data.galeria && item.data.galeria.length > 0 && (
            <div class="grid grid-cols-4 gap-2 mt-4">
              {item.data.galeria.map((img: { src: string; alt?: string }) => (
                <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img.src} alt={img.alt ?? ""} class="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <!-- Details -->
        <div>
          <h1 class="text-3xl lg:text-4xl font-extrabold">{item.data.nazwa}</h1>

          {!item.data.dostepny && (
            <span class="inline-block mt-3 text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
              Aktualnie niedostępny
            </span>
          )}

          <!-- Pricing -->
          <div class="mt-6 bg-bg rounded-xl p-6">
            <h2 class="font-bold text-lg mb-4">Cennik</h2>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-sm text-text-light">Doba</p>
                <p class="text-2xl font-bold text-primary">{item.data.cena_doba} zł</p>
              </div>
              <div>
                <p class="text-sm text-text-light">Weekend</p>
                <p class="text-2xl font-bold text-primary">{item.data.cena_weekend} zł</p>
              </div>
              <div>
                <p class="text-sm text-text-light">Tydzień</p>
                <p class="text-2xl font-bold text-primary">{item.data.cena_tydzien} zł</p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <a
            href={company.telefonLink}
            class="mt-6 w-full inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-dark transition-colors shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Zadzwoń i zarezerwuj
          </a>

          <!-- Technical Parameters -->
          {item.data.parametry && item.data.parametry.length > 0 && (
            <div class="mt-8">
              <h2 class="font-bold text-lg mb-4">Parametry techniczne</h2>
              <table class="w-full">
                <tbody>
                  {item.data.parametry.map((p: { nazwa: string; wartosc: string }, i: number) => (
                    <tr class={i % 2 === 0 ? "bg-bg" : ""}>
                      <td class="px-4 py-2 font-medium">{p.nazwa}</td>
                      <td class="px-4 py-2 text-text-light">{p.wartosc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <!-- Description -->
          <div class="mt-8 prose prose-gray max-w-none">
            <h2 class="font-bold text-lg mb-4">Opis</h2>
            <Content />
          </div>
        </div>
      </div>

      <!-- Related Products -->
      {related.length > 0 && (
        <div class="mt-16">
          <h2 class="text-2xl font-extrabold mb-6">Podobne produkty</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <EquipmentCard
                nazwa={r.data.nazwa}
                slug={r.data.slug}
                zdjecie={r.data.zdjecie}
                cena_doba={r.data.cena_doba}
                dostepny={r.data.dostepny}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
</Layout>
```

- [ ] **Step 3: Verify catalog and product pages render**

Visit `localhost:4321/katalog` and click a product.

Expected: Catalog grid with sidebar, product detail page with pricing table, parameters, description, and related products.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add catalog listing and product detail pages"
```

---

### Task 6: Category Filtered Page

**Files:**
- Create: `src/pages/katalog/kategoria/[slug].astro`

- [ ] **Step 1: Create category page**

Create `src/pages/katalog/kategoria/[slug].astro`:

```astro
---
import Layout from "../../../layouts/Layout.astro";
import EquipmentCard from "../../../components/EquipmentCard.astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const categories = await getCollection("category");
  return categories.map((cat) => ({
    params: { slug: cat.data.slug },
    props: { category: cat },
  }));
}

const { category } = Astro.props;

const categories = (await getCollection("category")).sort(
  (a, b) => (a.data.kolejnosc ?? 99) - (b.data.kolejnosc ?? 99)
);

const equipment = (await getCollection("equipment")).filter(
  (e) => e.data.kategoria && (typeof e.data.kategoria === 'string'
    ? e.data.kategoria.includes(category.id)
    : e.data.kategoria?.id === category.id)
);
---

<Layout title={category.data.nazwa} description={category.data.opis}>
  <section class="py-12 lg:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl lg:text-4xl font-extrabold mb-2">{category.data.nazwa}</h1>
      {category.data.opis && <p class="text-text-light text-lg mb-8">{category.data.opis}</p>}

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="lg:w-64 shrink-0">
          <h2 class="font-bold text-lg mb-4">Kategorie</h2>
          <ul class="space-y-2">
            <li>
              <a
                href="/katalog"
                class="block px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-text"
              >
                Wszystkie
              </a>
            </li>
            {categories.map((cat) => (
              <li>
                <a
                  href={`/katalog/kategoria/${cat.data.slug}`}
                  class:list={[
                    "block px-3 py-2 rounded-lg transition-colors",
                    cat.data.slug === category.data.slug
                      ? "bg-primary text-white font-medium"
                      : "hover:bg-gray-100 text-text",
                  ]}
                >
                  {cat.data.nazwa}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <!-- Equipment Grid -->
        <div class="flex-1">
          <p class="text-text-light mb-6">{equipment.length} produktów</p>
          {equipment.length > 0 ? (
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <EquipmentCard
                  nazwa={item.data.nazwa}
                  slug={item.data.slug}
                  zdjecie={item.data.zdjecie}
                  cena_doba={item.data.cena_doba}
                  dostepny={item.data.dostepny}
                />
              ))}
            </div>
          ) : (
            <p class="text-text-light">Brak sprzętu w tej kategorii.</p>
          )}
        </div>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Verify category filtering works**

Visit `localhost:4321/katalog/kategoria/kosiarki`.

Expected: Only mowers shown, sidebar highlights "Kosiarki".

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add category-filtered catalog page"
```

---

### Task 7: Blog Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create blog listing page**

Create `src/pages/blog/index.astro`:

```astro
---
import Layout from "../../layouts/Layout.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("blog")).sort(
  (a, b) => new Date(b.data.data).getTime() - new Date(a.data.data).getTime()
);
---

<Layout title="Blog" description="Porady i artykuły o pielęgnacji ogrodu i sprzęcie ogrodowym.">
  <section class="py-12 lg:py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl lg:text-4xl font-extrabold mb-8">Blog</h1>

      <div class="space-y-8">
        {posts.map((post) => (
          <a
            href={`/blog/${post.data.slug}`}
            class="group flex flex-col sm:flex-row gap-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div class="sm:w-64 shrink-0 aspect-video sm:aspect-auto bg-gray-100 overflow-hidden">
              {post.data.zdjecie ? (
                <img
                  src={post.data.zdjecie}
                  alt={post.data.tytul}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div class="w-full h-full flex items-center justify-center text-gray-400 min-h-[160px]">Blog</div>
              )}
            </div>
            <div class="p-5 sm:py-6">
              <time class="text-sm text-text-light">
                {new Date(post.data.data).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <h2 class="mt-2 text-xl font-bold group-hover:text-primary transition-colors">{post.data.tytul}</h2>
              {post.data.tagi && (
                <div class="mt-3 flex flex-wrap gap-2">
                  {post.data.tagi.map((tag: string) => (
                    <span class="text-xs bg-bg px-2 py-1 rounded-full text-text-light">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Create blog post page**

Create `src/pages/blog/[slug].astro`:

```astro
---
import Layout from "../../layouts/Layout.astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout title={post.data.tytul} description={`${post.data.tytul} — artykuł na blogu Rolmex.`}>
  <article class="py-12 lg:py-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="text-sm text-text-light mb-6">
        <a href="/blog" class="hover:text-primary">Blog</a>
        <span class="mx-2">/</span>
        <span>{post.data.tytul}</span>
      </nav>

      {post.data.zdjecie && (
        <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-8">
          <img src={post.data.zdjecie} alt={post.data.tytul} class="w-full h-full object-cover" />
        </div>
      )}

      <header class="mb-8">
        <h1 class="text-3xl lg:text-4xl font-extrabold">{post.data.tytul}</h1>
        <div class="mt-4 flex items-center gap-4 text-text-light text-sm">
          <time>
            {new Date(post.data.data).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          {post.data.autor && <span>| {post.data.autor}</span>}
        </div>
        {post.data.tagi && (
          <div class="mt-4 flex flex-wrap gap-2">
            {post.data.tagi.map((tag: string) => (
              <span class="text-xs bg-bg px-3 py-1 rounded-full text-text-light">{tag}</span>
            ))}
          </div>
        )}
      </header>

      <div class="prose prose-gray prose-lg max-w-none">
        <Content />
      </div>

      <div class="mt-12 pt-8 border-t">
        <a href="/blog" class="text-primary font-semibold hover:underline">&larr; Wróć do bloga</a>
      </div>
    </div>
  </article>
</Layout>
```

- [ ] **Step 3: Verify blog pages render**

Visit `localhost:4321/blog` and click a post.

Expected: Blog listing with post cards, individual post page with rendered markdown content.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add blog listing and post pages"
```

---

### Task 8: FAQ Page

**Files:**
- Create: `src/components/FaqAccordion.astro`
- Create: `src/pages/faq.astro`

- [ ] **Step 1: Create FaqAccordion component**

Create `src/components/FaqAccordion.astro`:

```astro
---
interface Props {
  pytanie: string;
  index: number;
}

const { pytanie, index } = Astro.props;
---

<div class="border-b border-gray-200">
  <button
    class="faq-toggle w-full flex items-center justify-between py-5 text-left"
    aria-expanded="false"
    aria-controls={`faq-${index}`}
  >
    <span class="font-semibold text-lg pr-4">{pytanie}</span>
    <svg
      class="faq-chevron w-5 h-5 shrink-0 text-text-light transition-transform duration-200"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>
  <div id={`faq-${index}`} class="faq-content hidden pb-5 prose prose-gray max-w-none">
    <slot />
  </div>
</div>

<script>
  document.querySelectorAll(".faq-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling as HTMLElement;
      const chevron = btn.querySelector(".faq-chevron") as HTMLElement;
      const isOpen = !content.classList.contains("hidden");

      content.classList.toggle("hidden");
      chevron.style.transform = isOpen ? "" : "rotate(180deg)";
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });
</script>
```

- [ ] **Step 2: Create FAQ page**

Create `src/pages/faq.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import FaqAccordion from "../components/FaqAccordion.astro";
import { getCollection } from "astro:content";

const faqs = (await getCollection("faq")).sort(
  (a, b) => (a.data.kolejnosc ?? 99) - (b.data.kolejnosc ?? 99)
);
---

<Layout title="Najczęstsze pytania" description="Odpowiedzi na najczęstsze pytania dotyczące wypożyczalni sprzętu ogrodowego.">
  <section class="py-12 lg:py-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl lg:text-4xl font-extrabold mb-8">Najczęstsze pytania</h1>

      <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        {faqs.map(async (faq, i) => {
          const { Content } = await faq.render();
          return (
            <FaqAccordion pytanie={faq.data.pytanie} index={i}>
              <Content />
            </FaqAccordion>
          );
        })}
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 3: Verify FAQ page renders**

Visit `localhost:4321/faq`.

Expected: Accordion with collapsible FAQ items.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add FAQ page with accordion component"
```

---

### Task 9: About Us Page

**Files:**
- Create: `src/pages/o-nas.astro`

- [ ] **Step 1: Create About page**

Create `src/pages/o-nas.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import { company } from "../lib/company";
---

<Layout title="O nas" description="Poznaj wypożyczalnię sprzętu ogrodowego Rolmex.">
  <section class="py-12 lg:py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl lg:text-4xl font-extrabold mb-8">O nas</h1>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="aspect-[3/1] bg-gray-200">
          <div class="w-full h-full flex items-center justify-center text-gray-400 text-lg">
            Zdjęcie wypożyczalni
          </div>
        </div>

        <div class="p-6 lg:p-10 prose prose-gray prose-lg max-w-none">
          <p>
            <strong>{company.pelna_nazwa}</strong> to firma z wieloletnim doświadczeniem w branży ogrodniczej.
            Oferujemy profesjonalny sprzęt ogrodowy do wynajęcia dla klientów indywidualnych i firm.
          </p>

          <h2>Nasza misja</h2>
          <p>
            Wierzymy, że każdy zasługuje na dostęp do profesjonalnego sprzętu ogrodowego bez konieczności
            jego zakupu. Dlatego oferujemy szeroki wybór maszyn i narzędzi w atrakcyjnych cenach,
            z gwarancją sprawności i fachowym doradztwem.
          </p>

          <h2>Dlaczego warto wypożyczać?</h2>
          <ul>
            <li>Oszczędzasz pieniądze — płacisz tylko za czas, kiedy używasz sprzętu</li>
            <li>Nie martwisz się o serwis i konserwację</li>
            <li>Masz dostęp do profesjonalnych maszyn znanych marek</li>
            <li>Możesz przetestować sprzęt przed ewentualnym zakupem</li>
          </ul>

          <h2>Nasz sprzęt</h2>
          <p>
            Dysponujemy szeroką gamą sprzętu ogrodowego renomowanych producentów: Honda, STIHL,
            Husqvarna, Makita i wielu innych. Każde urządzenie jest regularnie serwisowane
            i sprawdzane przed każdym wypożyczeniem.
          </p>
        </div>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Verify page renders**

Visit `localhost:4321/o-nas`.

Expected: About page with company description.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add about us page"
```

---

### Task 10: Contact Page

**Files:**
- Create: `src/components/GoogleMap.astro`
- Create: `src/pages/kontakt.astro`

- [ ] **Step 1: Create GoogleMap component**

Create `src/components/GoogleMap.astro`:

```astro
---
import { company } from "../lib/company";
---

<div class="rounded-xl overflow-hidden shadow-sm">
  <iframe
    src={company.mapa.embedUrl}
    width="100%"
    height="400"
    style="border:0;"
    allowfullscreen
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="Mapa — lokalizacja Rolmex"
  ></iframe>
</div>
```

- [ ] **Step 2: Create Contact page**

Create `src/pages/kontakt.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import GoogleMap from "../components/GoogleMap.astro";
import { company } from "../lib/company";
---

<Layout title="Kontakt" description="Skontaktuj się z nami — adres, telefon, godziny otwarcia.">
  <section class="py-12 lg:py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl lg:text-4xl font-extrabold mb-8">Kontakt</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Company Info -->
        <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h2 class="font-bold text-xl mb-6">{company.nazwa}</h2>

          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <div>
                <p class="font-medium">Adres</p>
                <p class="text-text-light">{company.adres.ulica}</p>
                <p class="text-text-light">{company.adres.kod} {company.adres.miasto}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <div>
                <p class="font-medium">Telefon</p>
                <a href={company.telefonLink} class="text-primary hover:underline">{company.telefon}</a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <div>
                <p class="font-medium">Email</p>
                <a href={`mailto:${company.email}`} class="text-primary hover:underline">{company.email}</a>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div>
                <p class="font-medium">Godziny otwarcia</p>
                <p class="text-text-light">Pn-Pt: {company.godziny.pn_pt}</p>
                <p class="text-text-light">Sobota: {company.godziny.sobota}</p>
                <p class="text-text-light">Niedziela: {company.godziny.niedziela}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div>
          <GoogleMap />
        </div>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 3: Verify contact page renders**

Visit `localhost:4321/kontakt`.

Expected: Contact info with icons + embedded Google Map.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact page with Google Map embed"
```

---

### Task 11: Astro Content Collections Config

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Define Astro content collections to match TinaCMS schema**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const category = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/categories" }),
  schema: z.object({
    nazwa: z.string(),
    slug: z.string(),
    opis: z.string().optional(),
    ikona: z.string(),
    kolejnosc: z.number().optional(),
  }),
});

const equipment = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/equipment" }),
  schema: z.object({
    nazwa: z.string(),
    slug: z.string(),
    zdjecie: z.string().optional(),
    galeria: z
      .array(z.object({ src: z.string(), alt: z.string().optional() }))
      .optional(),
    kategoria: z.string().optional(),
    cena_doba: z.number(),
    cena_weekend: z.number(),
    cena_tydzien: z.number(),
    parametry: z
      .array(z.object({ nazwa: z.string(), wartosc: z.string() }))
      .optional(),
    dostepny: z.boolean().optional().default(true),
    wyroziony: z.boolean().optional().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/blog" }),
  schema: z.object({
    tytul: z.string(),
    slug: z.string(),
    zdjecie: z.string().optional(),
    data: z.coerce.date(),
    autor: z.string().optional(),
    tagi: z.array(z.string()).optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/faq" }),
  schema: z.object({
    pytanie: z.string(),
    kolejnosc: z.number().optional(),
  }),
});

export const collections = { category, equipment, blog, faq };
```

- [ ] **Step 2: Verify build succeeds**

```bash
npx tinacms dev -c "astro build"
```

Expected: Build completes with all pages generated.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Astro content collections config with Zod schemas"
```

---

### Task 12: Final Touches — .gitignore, Typography Plugin, SEO

**Files:**
- Create: `.gitignore`
- Modify: `package.json` (add @tailwindcss/typography)
- Modify: `src/styles/global.css` (add typography plugin)

- [ ] **Step 1: Create .gitignore**

Create `.gitignore`:

```
node_modules/
dist/
.astro/
.tina/__generated__/
.superpowers/
.env
.env.*
```

- [ ] **Step 2: Install Tailwind typography plugin**

```bash
npm install @tailwindcss/typography
```

- [ ] **Step 3: Add typography plugin to global CSS**

Update `src/styles/global.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-primary: #F97316;
  --color-primary-dark: #EA580C;
  --color-secondary: #16A34A;
  --color-secondary-dark: #15803D;
  --color-bg: #F9FAFB;
  --color-text: #1F2937;
  --color-text-light: #6B7280;
  --font-family-sans: 'Inter', sans-serif;
}
```

- [ ] **Step 4: Verify full build**

```bash
npx tinacms dev -c "astro build"
```

Expected: Clean build, all pages generated, no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add gitignore, typography plugin, finalize project setup"
```

# Wypożyczalnia Sprzętu Ogrodowego — Design Spec

## Przegląd

Nowoczesna strona internetowa wypożyczalni sprzętu ogrodowego zbudowana na Astro (SSG) z TinaCMS (git-based) do zarządzania treścią. Bez systemu rezerwacji — kontakt telefoniczny.

## Stos technologiczny

- **Astro** — statyczna generacja strony (SSG), SEO-friendly
- **TinaCMS** — git-based, self-hosted, panel admina do zarządzania sprzętem, kategoriami, artykułami i FAQ
- **Tailwind CSS** — stylowanie, motyw energiczny (pomarańcz + zieleń)
- **Dane** — Markdown/JSON w repozytorium (kolekcje TinaCMS)
- **Hosting** — Vercel/Netlify (statyczne pliki, darmowy tier)

## Struktura danych

### Kategorie (`content/categories/*.md`)

| Pole             | Typ      | Opis                        |
|------------------|----------|-----------------------------|
| nazwa            | string   | Nazwa kategorii             |
| slug             | string   | URL slug                    |
| opis             | string   | Krótki opis                 |
| ikona            | string   | Nazwa ikony                 |
| kolejnosc        | number   | Kolejność sortowania        |

### Sprzęt (`content/equipment/*.md`)

| Pole              | Typ          | Opis                                        |
|-------------------|--------------|---------------------------------------------|
| nazwa             | string       | Nazwa sprzętu                               |
| slug              | string       | URL slug                                    |
| zdjecie           | image        | Zdjęcie główne                              |
| galeria           | image[]      | Dodatkowe zdjęcia                           |
| opis              | rich-text    | Opis sprzętu                                |
| kategoria         | reference    | Relacja do kategorii                        |
| cena_doba         | number       | Cena za dobę (PLN)                          |
| cena_weekend      | number       | Cena za weekend (PLN)                       |
| cena_tydzien      | number       | Cena za tydzień (PLN)                       |
| parametry         | object[]     | Lista klucz-wartość (moc, waga, itp.)       |
| dostepny          | boolean      | Czy aktualnie dostępny                      |
| wyroziony         | boolean      | Czy wyświetlać na stronie głównej           |

### Artykuły/Blog (`content/blog/*.md`)

| Pole              | Typ       | Opis                     |
|-------------------|-----------|--------------------------|
| tytul             | string    | Tytuł artykułu           |
| slug              | string    | URL slug                 |
| tresc             | rich-text | Treść artykułu           |
| zdjecie           | image     | Zdjęcie wyróżniające     |
| data              | datetime  | Data publikacji          |
| autor             | string    | Autor                    |
| tagi              | string[]  | Tagi                     |

### FAQ (`content/faq/*.md`)

| Pole       | Typ       | Opis                 |
|------------|-----------|----------------------|
| pytanie    | string    | Pytanie              |
| odpowiedz | rich-text | Odpowiedź            |
| kolejnosc  | number    | Kolejność sortowania |

### Dane firmy (statyczne w kodzie)

Adres, telefon, email, godziny otwarcia, współrzędne mapy Google, linki social media — zahardkodowane w konfiguracji Astro lub pliku stałych.

## Podstrony

### Strona główna (`/`)

- Hero banner z hasłem i CTA "Zobacz katalog"
- Siatka wyróżnionych kategorii z ikonami
- Wyróżniony sprzęt (3-4 produkty z flagą `wyroziony`)
- Sekcja "Dlaczego my" (szybkość, jakość, ceny)
- Ostatnie 2-3 artykuły z bloga

### Katalog (`/katalog`)

- Nawigacja boczna/filtry po kategoriach
- Siatka produktów: miniatura, nazwa, cena za dobę
- Kliknięcie → strona produktu

### Strona produktu (`/katalog/[slug]`)

- Duże zdjęcie + galeria
- Opis
- Parametry techniczne (tabela)
- Cennik: dobowa / weekend / tydzień
- Przycisk "Zadzwoń i zarezerwuj" (link `tel:`)
- Powiązane produkty z tej samej kategorii

### Kategoria (`/katalog/kategoria/[slug]`)

- Filtrowana lista produktów z danej kategorii
- Ten sam layout co katalog, ale ograniczony do kategorii

### O nas (`/o-nas`)

- Statyczna strona — opis firmy, misja, zdjęcia

### Blog (`/blog`)

- Lista artykułów z miniaturami i datami
- Strona artykułu: `/blog/[slug]`

### FAQ (`/faq`)

- Akordeon pytań i odpowiedzi, zarządzany z TinaCMS

### Kontakt (`/kontakt`)

- Dane firmy: adres, telefon, email, godziny otwarcia (statyczne)
- Osadzona mapa Google (embed iframe)

## Styl wizualny

### Kolorystyka

| Rola          | Kolor      | Hex       |
|---------------|------------|-----------|
| Główny/CTA    | Pomarańcz  | `#F97316` |
| Drugorzędny   | Zieleń     | `#16A34A` |
| Tło           | Jasny szary| `#F9FAFB` |
| Tekst         | Ciemny     | `#1F2937` |
| Karty         | Biały      | `#FFFFFF` |

### Typografia

- Nagłówki: **Inter Bold** — duże, wyraziste
- Tekst: **Inter Regular**

### Komponenty UI

- **Nawigacja**: sticky header — logo, menu, numer telefonu. Hamburger na mobile.
- **Przyciski CTA**: pomarańczowe tło, biały tekst, duże i wyraziste
- **Karty produktów**: biały bg, cień, hover effect (powiększenie cienia + lekki scale)
- **Footer**: 3 kolumny — szybkie linki, kontakt, godziny otwarcia
- **Responsywność**: mobile-first, breakpoints Tailwind (sm/md/lg/xl)

### Zdjęcia

- Na start: placeholder z Unsplash (sprzęt ogrodowy, ogrody)
- Hero: pełnoszerokie duże zdjęcia
- Katalog: miniatury w jednolitej proporcji (4:3 lub 3:2)

## Czego NIE ma

- System rezerwacji online
- Koszyk / płatności
- Konta użytkowników
- Formularz kontaktowy (kontakt telefoniczny/mailowy)

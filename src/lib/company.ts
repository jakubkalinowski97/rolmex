export const company = {
  nazwa: "Rolmex",
  pelna_nazwa: "ROL-MEX s.c. Bartłomiej Modzelewski, Kamil Kalinowski",
  adres: {
    ulica: "ul. Rynek 1A",
    miasto: "Rutki-Kossaki",
    kod: "18-312",
  },
  nip: "723-000-22-13",
  regon: "450012598",
  telefon: "+48 500 217 501",
  telefonLink: "tel:+48500217501",
  email: "rolmexrutki@wp.pl",
  godziny: {
    pn_pt: "7:00 - 16:00",
    sobota: "7:00 - 14:00",
    niedziela: "Nieczynne",
  },
  mapa: {
    lat: 53.0864,
    lng: 22.4574,
    embedUrl:
      "https://maps.google.com/maps?q=ul.%20Rynek%201A%2C%2018-312%20Rutki-Kossaki&hl=pl&z=16&output=embed",
  },
  social: {
    facebook: "https://facebook.com/rolmex",
    instagram: "https://instagram.com/rolmex",
  },
} as const;

export const obszarDzialania = [
  "Zambrów",
  "Łomża",
  "Wysokie Mazowieckie",
  "Jedwabne",
  "Szepietowo",
  "Czyżew",
  "Tykocin",
  "Stawiski",
  "Mońki",
  "Kolno",
  "Ciechanowiec",
  "Brańsk",
  "Białystok",
] as const;

export const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/katalog", label: "Katalog" },
  { href: "/o-nas", label: "O nas" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

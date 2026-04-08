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

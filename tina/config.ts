import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
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
          { type: "string", name: "ikona", label: "Ikona (nazwa Lucide)" },
          { type: "image", name: "zdjecie", label: "Zdjęcie kategorii" },
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
          { type: "string", name: "kategoria", label: "Kategoria (slug)" },
          { type: "number", name: "cena_doba", label: "Cena za dobę (PLN)", required: true },
          { type: "number", name: "cena_weekend", label: "Cena za weekend (PLN)", required: true },
          { type: "number", name: "cena_tydzien", label: "Cena za tydzień (PLN)", required: true },
          { type: "number", name: "kaucja", label: "Kaucja (PLN)" },
          {
            type: "string",
            name: "dodatkowe_info",
            label: "Dodatkowe informacje (tekst pod cennikiem)",
            ui: { component: "textarea" },
          },
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
      {
        name: "pages",
        label: "Strony (Regulamin, Polityka...)",
        path: "content/pages",
        format: "md",
        fields: [
          { type: "string", name: "tytul", label: "Tytuł", required: true },
          { type: "string", name: "opis", label: "Krótki opis (meta)" },
          { type: "datetime", name: "aktualizacja", label: "Data aktualizacji" },
          { type: "rich-text", name: "body", label: "Treść", isBody: true },
        ],
      },
    ],
  },
});

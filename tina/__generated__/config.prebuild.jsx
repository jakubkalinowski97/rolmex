// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
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
          { type: "number", name: "kolejnosc", label: "Kolejno\u015B\u0107 sortowania" }
        ]
      },
      {
        name: "equipment",
        label: "Sprz\u0119t",
        path: "content/equipment",
        format: "md",
        fields: [
          { type: "string", name: "nazwa", label: "Nazwa", required: true },
          { type: "string", name: "slug", label: "Slug URL", required: true },
          { type: "image", name: "zdjecie", label: "Zdj\u0119cie g\u0142\xF3wne" },
          {
            type: "object",
            name: "galeria",
            label: "Galeria",
            list: true,
            fields: [
              { type: "image", name: "src", label: "Zdj\u0119cie" },
              { type: "string", name: "alt", label: "Opis alt" }
            ]
          },
          { type: "rich-text", name: "body", label: "Opis", isBody: true },
          {
            type: "reference",
            name: "kategoria",
            label: "Kategoria",
            collections: ["category"]
          },
          { type: "number", name: "cena_doba", label: "Cena za dob\u0119 (PLN)", required: true },
          { type: "number", name: "cena_weekend", label: "Cena za weekend (PLN)", required: true },
          { type: "number", name: "cena_tydzien", label: "Cena za tydzie\u0144 (PLN)", required: true },
          {
            type: "object",
            name: "parametry",
            label: "Parametry techniczne",
            list: true,
            fields: [
              { type: "string", name: "nazwa", label: "Parametr" },
              { type: "string", name: "wartosc", label: "Warto\u015B\u0107" }
            ]
          },
          { type: "boolean", name: "dostepny", label: "Dost\u0119pny" },
          { type: "boolean", name: "wyroziony", label: "Wyr\xF3\u017Cniony (strona g\u0142\xF3wna)" }
        ]
      },
      {
        name: "blog",
        label: "Blog",
        path: "content/blog",
        format: "md",
        fields: [
          { type: "string", name: "tytul", label: "Tytu\u0142", required: true },
          { type: "string", name: "slug", label: "Slug URL", required: true },
          { type: "image", name: "zdjecie", label: "Zdj\u0119cie wyr\xF3\u017Cniaj\u0105ce" },
          { type: "datetime", name: "data", label: "Data publikacji", required: true },
          { type: "string", name: "autor", label: "Autor" },
          { type: "string", name: "tagi", label: "Tagi", list: true },
          { type: "rich-text", name: "body", label: "Tre\u015B\u0107", isBody: true }
        ]
      },
      {
        name: "faq",
        label: "FAQ",
        path: "content/faq",
        format: "md",
        fields: [
          { type: "string", name: "pytanie", label: "Pytanie", required: true },
          { type: "rich-text", name: "body", label: "Odpowied\u017A", isBody: true },
          { type: "number", name: "kolejnosc", label: "Kolejno\u015B\u0107 sortowania" }
        ]
      }
    ]
  }
});
export {
  config_default as default
};

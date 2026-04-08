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

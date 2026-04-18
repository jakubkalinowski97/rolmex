import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs/promises";
import path from "node:path";
// @ts-ignore - no types
import wawoff from "wawoff2";

export async function getStaticPaths() {
  const equipment = await getCollection("equipment");
  return equipment.map((item) => ({
    params: { slug: item.data.slug },
    props: { item: item.data },
  }));
}

type FontEntry = { name: string; weight: 700 | 800; data: Uint8Array };
let fontCache: FontEntry[] | null = null;

async function loadWoff2AsTtf(fileName: string): Promise<Uint8Array> {
  const filePath = path.join(
    process.cwd(),
    "node_modules",
    "@fontsource",
    "inter",
    "files",
    fileName
  );
  const woff2 = await fs.readFile(filePath);
  const raw: Uint8Array = await wawoff.decompress(woff2);
  const ttf = new Uint8Array(raw.length);
  ttf.set(raw);
  return ttf;
}

async function loadFonts(): Promise<FontEntry[]> {
  if (fontCache) return fontCache;
  const weights: (700 | 800)[] = [700, 800];
  const subsets: { subset: string; name: string }[] = [
    { subset: "latin", name: "Inter" },
    { subset: "latin-ext", name: "InterExt" },
  ];
  const combos = weights.flatMap((weight) =>
    subsets.map(({ subset, name }) => ({ weight, subset, name }))
  );
  fontCache = await Promise.all(
    combos.map(async ({ weight, subset, name }) => ({
      name,
      weight,
      data: await loadWoff2AsTtf(`inter-${subset}-${weight}-normal.woff2`),
    }))
  );
  return fontCache;
}

async function imageToDataUrl(publicPath: string): Promise<string | null> {
  try {
    const rel = publicPath.replace(/^\//, "");
    const filePath = path.join(process.cwd(), "public", rel);
    const buf = await fs.readFile(filePath);
    const ext = path.extname(rel).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ props }) => {
  const item = (props as { item: any }).item;
  const fonts = await loadFonts();
  const productImage = item.zdjecie ? await imageToDataUrl(item.zdjecie) : null;

  const PRIMARY = "#E86A10";
  const TEXT = "#1E293B";
  const TEXT_LIGHT = "#64748B";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundColor: "#FFFFFF",
          fontFamily: "Inter, InterExt",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                width: "620px",
                height: "630px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FAFAFA",
                padding: "40px",
              },
              children: productImage
                ? {
                    type: "img",
                    props: {
                      src: productImage,
                      style: {
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      },
                    },
                  }
                : {
                    type: "div",
                    props: {
                      style: { color: TEXT_LIGHT, fontSize: 32 },
                      children: item.nazwa,
                    },
                  },
            },
          },
          {
            type: "div",
            props: {
              style: {
                width: "580px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "56px 48px",
                backgroundColor: "#FFFFFF",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 20,
                            fontWeight: 700,
                            color: PRIMARY,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            marginBottom: "20px",
                          },
                          children: "Wypożyczalnia Rolmex",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 52,
                            fontWeight: 800,
                            color: TEXT,
                            lineHeight: 1.1,
                            marginBottom: "32px",
                          },
                          children: item.nazwa,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            padding: "24px",
                            backgroundColor: "#FFF3E8",
                            borderRadius: "16px",
                          },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: 18,
                                  color: TEXT_LIGHT,
                                  fontWeight: 700,
                                  marginBottom: "4px",
                                },
                                children: "Już od",
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: 48,
                                  fontWeight: 800,
                                  color: PRIMARY,
                                },
                                children: `${item.cena_doba} zł / doba`,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 22,
                      fontWeight: 700,
                      color: TEXT_LIGHT,
                    },
                    children: "wypozyczalniarutki.pl",
                  },
                },
              ],
            },
          },
        ],
      },
    } as any,
    {
      width: 1200,
      height: 630,
      fonts: fonts.map((f) => ({
        name: f.name,
        data: f.data,
        weight: f.weight,
        style: "normal",
      })),
    }
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

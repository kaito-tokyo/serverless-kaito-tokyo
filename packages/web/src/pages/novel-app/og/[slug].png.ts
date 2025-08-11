import satori from "satori";
import sharp from "sharp";
import fetchApi from "../../../lib/strapi";
import type { NovelApp } from "../../../interfaces/NovelApp";
import fs from "fs";
import path from "path";
import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const novelApps = await fetchApi<NovelApp[]>({
    endpoint: "novel-apps",
    wrappedByKey: "data",
  });

  return novelApps.map((app) => ({
    params: { slug: app.slug },
    props: app,
  }));
}

export const GET: APIRoute<NovelApp> = async ({ props }) => {
  const app = props;

  const fontPath = path.resolve(
    "./src/assets/fonts/NotoSerifJP-ExtraLight.ttf",
  );
  const fontData = fs.readFileSync(fontPath);
  const boldFontPath = path.resolve("./src/assets/fonts/NotoSerifJP-Bold.ttf");
  const boldFontData = fs.readFileSync(boldFontPath);

  const template = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        padding: "40px",
        backgroundColor: "#f5f5f5",
        border: "20px solid #e0e0e0",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontFamily: "Noto Serif JP Bold",
              fontSize: "40px",
              marginBottom: "20px",
            },
            children: `『${app.Title}』`,
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: "40px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 7,
              textIndent: "1em",
            },
            children: app.Description,
          },
        },
      ],
    },
  };

  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Serif JP",
        data: fontData,
        weight: 200,
        style: "normal",
      },
      {
        name: "Noto Serif JP Bold",
        data: boldFontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};

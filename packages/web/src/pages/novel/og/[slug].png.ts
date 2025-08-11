import { getNovelBodyPreview } from "../../../lib/novel-processor";
import satori from "satori";
import sharp from "sharp";
import fetchApi from "../../../lib/strapi";
import type { Novel } from "../../../interfaces/Novel";
import fs from "fs";
import path from "path";
import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const novels = await fetchApi<Novel[]>({
    endpoint: "novels",
    wrappedByKey: "data",
  });

  return novels.map((novel) => ({
    params: { slug: novel.slug },
    props: novel,
  }));
}

export const GET: APIRoute<Novel> = async ({ props }) => {
  const novel = props;

  const fontPath = path.resolve(
    "./src/assets/fonts/NotoSerifJP-ExtraLight.ttf",
  );
  const fontData = fs.readFileSync(fontPath);
  const boldFontPath = path.resolve("./src/assets/fonts/NotoSerifJP-Bold.ttf");
  const boldFontData = fs.readFileSync(boldFontPath);

  const body = `${getNovelBodyPreview(novel, 300)}`;

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
              fontFamily: "'Noto Serif JP Bold'",
              fontSize: "40px",
              marginBottom: "20px",
            },
            children: `『${novel.Title}』`,
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
            children: body,
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

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};

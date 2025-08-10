import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";
import fetchApi from "../../../lib/strapi";
import type { Novel } from "../../../interfaces/Novel";
import fs from "fs";
import path from "path";

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

// @ts-ignore
const GET = async ({ props }) => {
  const novel = props as Novel;

  const fontPath = path.resolve(
    "./public/assets/fonts/NotoSerifJP-Regular.otf",
  );
  const fontData = fs.readFileSync(fontPath);

  const body = novel.Body.slice(0, 100);

  const template = html(`
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        padding: "40px",
        backgroundColor: "#f5f5f5",
        border: "20px solid #e0e0e0",
      }}
    >
      <h1 style={{ fontSize: "60px", marginBottom: "20px" }}>${novel.Title}</h1>
      <p style={{ fontSize: "30px" }}>${body}...</p>
    </div>
  `);

  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Serif JP",
        data: fontData,
        weight: 400,
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

export { GET };

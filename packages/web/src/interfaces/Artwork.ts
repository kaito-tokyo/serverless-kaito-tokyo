import type { StrapiImage } from "./StrapiImage.js";

export interface Artwork {
  readonly id: number;

  readonly Body: string;
  readonly Date: string;
  readonly Description: string;
  readonly SdrImage: StrapiImage;
  readonly HdrImage: StrapiImage;
  readonly Title: string;

  readonly slug: string;

  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}

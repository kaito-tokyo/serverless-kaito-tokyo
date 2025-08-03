import type { StrapiImage } from "./StrapiImage.js";

export interface Artwork {
  readonly id: number;

  readonly Date: string;
  readonly Title: string;
  readonly slug: string;
  readonly SdrImage: StrapiImage;
  readonly HdrImage?: StrapiImage;
  readonly Body?: string;

  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}

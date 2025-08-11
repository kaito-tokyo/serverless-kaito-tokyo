export interface NovelApp {
  readonly id: number;

  readonly slug: string;
  readonly Title: string;
  readonly Description: string;
  readonly Lang: string;
  readonly Head: string;
  readonly Body: string;

  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}

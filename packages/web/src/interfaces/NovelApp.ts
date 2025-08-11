export interface NovelApp {
  readonly id: number;

  readonly Html: string;
  readonly slug: string;

  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}

export interface Novel {
  readonly id: number;

  readonly Body: string;
  readonly Date: string;
  readonly Description: string | null;
  readonly Title: string;

  readonly slug: string;

  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}

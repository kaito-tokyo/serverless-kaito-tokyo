export interface StrapiImageFormatDetail {
  readonly ext: string;
  readonly url: string;
  readonly hash: string;
  readonly mime: string;
  readonly name: string;
  readonly path: string | null;
  readonly size: number;
  readonly width: number;
  readonly height: number;
  readonly sizeInBytes: number;
}

export interface StrapiImageFormats {
  readonly large: StrapiImageFormatDetail;
  readonly small: StrapiImageFormatDetail;
  readonly medium: StrapiImageFormatDetail;
  readonly thumbnail: StrapiImageFormatDetail;
}

export interface StrapiImage {
  readonly id: number;
  readonly documentId: string;
  readonly name: string;
  readonly alternativeText: string | null;
  readonly caption: string | null;
  readonly width: number | null;
  readonly height: number | null;
  readonly formats: StrapiImageFormats | null;
  readonly hash: string;
  readonly ext: string;
  readonly mime: string;
  readonly size: number;
  readonly url: string;
  readonly previewUrl: string | null;
  readonly provider: string;
  readonly provider_metadata: null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
}

/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

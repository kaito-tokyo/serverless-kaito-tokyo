import type { Novel } from "../interfaces/Novel";

export function getNovelBodyPreview(novel: Novel, length = 100): string {
  return novel.Body.split("\n")
    .filter((line) => !line.startsWith("#"))
    .join("\n")
    .substring(0, length);
}

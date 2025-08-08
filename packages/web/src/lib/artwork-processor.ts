import type { Artwork } from "../interfaces/Artwork";

export function processArtwork(artwork: Artwork) {
  if (
    !artwork.SdrImage?.url ||
    !artwork.SdrImage.width ||
    !(artwork.SdrImage.width > 0) ||
    !artwork.SdrImage.height ||
    !(artwork.SdrImage.height > 0)
  ) {
    return null;
  }
  return {
    ...artwork,
    displayHeight: (200 / artwork.SdrImage.width) * artwork.SdrImage.height,
  };
}

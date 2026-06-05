// src/utils/image.ts

export const getImageUrl = (
  image?: string
) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `http://localhost:5000${image}`;
};
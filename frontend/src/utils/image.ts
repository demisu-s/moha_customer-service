// src/utils/image.ts

// export const getImageUrl = (
//   image?: string
// ) => {
//   if (!image) return "";

//   if (image.startsWith("http")) {
//     return image;
//   }

//   return `http://localhost:5000${image}`;
// };


const API_FALLBACK = "http://172.16.70.25:5000";

export const getImageUrl = (image?: string) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    // 🔥 override broken local DNS for mobile
    if (image.includes("helpdesk.moha.local")) {
      return image.replace(
        "http://helpdesk.moha.local",
        API_FALLBACK
      );
    }

    return image;
  }

  return `${API_FALLBACK}${image}`;
};
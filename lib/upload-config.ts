export const ALLOWED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "pdf",
  "ai",
  "eps",
  "svg",
] as const;

export const MAX_UPLOAD_SIZE_MB = 10;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
export const AVATAR_SIGNED_URL_TTL_SECONDS = 120;

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;

export const AVATAR_ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const CONTENT_TYPE_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export type AvatarContentType = 'image/jpeg' | 'image/png' | 'image/webp';

export type AvatarUploadIntentResult = {
  uploadUrl: string;
  path: string;
  publicUrl: string;
  expiresAt: Date;
};

export type AvatarObjectMetadata = {
  size: number;
  contentType: AvatarContentType;
};

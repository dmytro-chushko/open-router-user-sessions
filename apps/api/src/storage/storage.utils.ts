const JPEG_MAGIC = [0xff, 0xd8, 0xff];
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
const WEBP_RIFF = [0x52, 0x49, 0x46, 0x46];
const WEBP_MARKER = [0x57, 0x45, 0x42, 0x50];

function matchesMagicBytes(
  buffer: Uint8Array,
  magic: readonly number[],
): boolean {
  if (buffer.length < magic.length) {
    return false;
  }

  return magic.every((byte, index) => buffer[index] === byte);
}

function isWebp(buffer: Uint8Array): boolean {
  if (buffer.length < 12) {
    return false;
  }

  if (!matchesMagicBytes(buffer, WEBP_RIFF)) {
    return false;
  }

  return (
    buffer[8] === WEBP_MARKER[0] &&
    buffer[9] === WEBP_MARKER[1] &&
    buffer[10] === WEBP_MARKER[2] &&
    buffer[11] === WEBP_MARKER[3]
  );
}

export function detectAvatarContentType(
  buffer: Uint8Array,
): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (matchesMagicBytes(buffer, JPEG_MAGIC)) {
    return 'image/jpeg';
  }

  if (matchesMagicBytes(buffer, PNG_MAGIC)) {
    return 'image/png';
  }

  if (isWebp(buffer)) {
    return 'image/webp';
  }

  return null;
}

export function isAvatarPathOwnedByUser(
  path: string,
  userId: string,
  avatarsPrefix: string,
): boolean {
  if (path.includes('..') || path.includes('\\')) {
    return false;
  }

  const expectedPrefix = `${avatarsPrefix}/${userId}/`;

  return path.startsWith(expectedPrefix) && path.length > expectedPrefix.length;
}

export function extractStoragePathFromPublicUrl(
  publicUrl: string,
  supabaseUrl: string,
  bucket: string,
): string | null {
  if (!publicUrl.startsWith(supabaseUrl)) {
    return null;
  }

  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return publicUrl.slice(markerIndex + marker.length);
}

export function isManagedAvatarPublicUrl(
  publicUrl: string | null,
  supabaseUrl: string,
  bucket: string,
): boolean {
  if (publicUrl === null || publicUrl === '') {
    return false;
  }

  return (
    extractStoragePathFromPublicUrl(publicUrl, supabaseUrl, bucket) !== null
  );
}

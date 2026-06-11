import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { AppConfigService } from '@/common/app-config.service';
import {
  AVATAR_MAX_BYTES,
  AVATAR_SIGNED_URL_TTL_SECONDS,
  CONTENT_TYPE_TO_EXTENSION,
  type AvatarContentType,
  type AvatarObjectMetadata,
  type AvatarUploadIntentResult,
} from '@/storage/storage.constants';
import {
  detectAvatarContentType,
  isAvatarPathOwnedByUser,
} from '@/storage/storage.utils';

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private client: SupabaseClient | null = null;

  constructor(private readonly appConfig: AppConfigService) {}

  createAvatarUploadIntent(
    userId: string,
    input: { contentType: AvatarContentType; contentLength: number },
  ): Promise<AvatarUploadIntentResult> {
    this.assertConfigured();

    if (input.contentLength > AVATAR_MAX_BYTES) {
      throw new BadRequestException('Avatar file is too large.');
    }

    const extension = CONTENT_TYPE_TO_EXTENSION[input.contentType];

    if (extension === undefined) {
      throw new BadRequestException('Unsupported avatar content type.');
    }

    const path = `${this.appConfig.supabaseAvatarsPrefix}/${userId}/${crypto.randomUUID()}.${extension}`;

    return this.createSignedUpload(path);
  }

  async readAvatarMetadata(path: string): Promise<AvatarObjectMetadata> {
    this.assertConfigured();

    const client = this.getClient();
    const { data, error } = await client.storage
      .from(this.appConfig.supabaseStorageBucket)
      .download(path);

    if (error !== null || data === null) {
      throw new BadRequestException('Uploaded avatar was not found.');
    }

    if (data.size > AVATAR_MAX_BYTES) {
      throw new BadRequestException('Avatar file is too large.');
    }

    const headerBytes = new Uint8Array(await data.slice(0, 12).arrayBuffer());
    const detectedContentType = detectAvatarContentType(headerBytes);

    if (detectedContentType === null) {
      throw new BadRequestException('Unsupported avatar file format.');
    }

    return {
      size: data.size,
      contentType: detectedContentType,
    };
  }

  deleteObject(path: string): Promise<void> {
    this.assertConfigured();

    return this.removeObjects([path]);
  }

  getPublicUrl(path: string): string {
    this.assertConfigured();

    const client = this.getClient();
    const { data } = client.storage
      .from(this.appConfig.supabaseStorageBucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  assertPathOwnedByUser(path: string, userId: string): void {
    const isOwned = isAvatarPathOwnedByUser(
      path,
      userId,
      this.appConfig.supabaseAvatarsPrefix,
    );

    if (!isOwned) {
      throw new BadRequestException('Invalid avatar path.');
    }
  }

  private async createSignedUpload(
    path: string,
  ): Promise<AvatarUploadIntentResult> {
    const client = this.getClient();
    const { data, error } = await client.storage
      .from(this.appConfig.supabaseStorageBucket)
      .createSignedUploadUrl(path, { upsert: true });

    if (error !== null || data === null) {
      this.logger.error(
        `Failed to create signed upload URL: ${error?.message}`,
      );
      throw new InternalServerErrorException(
        'Could not prepare avatar upload.',
      );
    }

    const expiresAt = new Date(
      Date.now() + AVATAR_SIGNED_URL_TTL_SECONDS * 1000,
    );

    return {
      uploadUrl: data.signedUrl,
      path: data.path,
      publicUrl: this.getPublicUrl(data.path),
      expiresAt,
    };
  }

  private async removeObjects(paths: string[]): Promise<void> {
    const client = this.getClient();
    const { error } = await client.storage
      .from(this.appConfig.supabaseStorageBucket)
      .remove(paths);

    if (error !== null) {
      this.logger.error(`Failed to delete storage object: ${error.message}`);
      throw new InternalServerErrorException('Could not delete avatar file.');
    }
  }

  private getClient(): SupabaseClient {
    if (this.client === null) {
      this.client = createClient(
        this.appConfig.supabaseUrl,
        this.appConfig.supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      );
    }

    return this.client;
  }

  private assertConfigured(): void {
    if (
      this.appConfig.supabaseUrl === '' ||
      this.appConfig.supabaseServiceRoleKey === ''
    ) {
      throw new InternalServerErrorException(
        'Supabase storage is not configured.',
      );
    }
  }
}

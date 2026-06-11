import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    const raw = this.config.get<string>('PORT');

    if (raw === undefined || raw === '') {
      return 3002;
    }
    const n = Number.parseInt(raw, 10);

    return Number.isFinite(n) ? n : 3002;
  }

  get apiUrl(): string {
    const v = this.config.get<string>('API_URL')?.trim();

    return v && v.length > 0 ? v : 'http://localhost:3002/api';
  }

  get webOrigins(): string[] {
    const raw = this.config.get<string>('WEB_ORIGIN');

    if (raw === undefined || raw.trim() === '') {
      return ['http://localhost:3001'];
    }

    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  get sessionSecret(): string {
    return this.config.get<string>('SESSION_SECRET') ?? 'session-secret';
  }

  get sessionCookieName(): string {
    return this.config.get<string>('SESSION_COOKIE_NAME') ?? 'session';
  }

  get sessionCookieMaxAge(): number {
    return (
      this.config.get<number>('SESSION_COOKIE_MAX_AGE') ?? 60 * 60 * 24 * 30
    );
  }

  get cookieSameSite(): 'lax' | 'strict' | 'none' {
    return (
      this.config.get<'lax' | 'strict' | 'none'>('COOKIE_SAME_SITE') ?? 'lax'
    );
  }

  get cookieSecure(): boolean {
    return this.config.get<boolean>('COOKIE_SECURE') ?? false;
  }

  get googleOAuth(): {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  } {
    return {
      clientId: this.config.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: this.config.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackUrl: this.config.get<string>('GOOGLE_CALLBACK_URL') ?? '',
    };
  }

  get githubOAuth(): {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  } {
    return {
      clientId: this.config.get<string>('GITHUB_CLIENT_ID') ?? '',
      clientSecret: this.config.get<string>('GITHUB_CLIENT_SECRET') ?? '',
      callbackUrl: this.config.get<string>('GITHUB_CALLBACK_URL') ?? '',
    };
  }

  get webAppUrl(): string {
    return this.config.get<string>('WEB_APP_URL') ?? 'http://localhost:3001';
  }

  get emailFrom(): string {
    return (
      this.config.get<string>('EMAIL_FROM') ??
      'no-reply@open-router-sessions.com'
    );
  }

  get resendApiKey(): string {
    return this.config.get<string>('RESEND_API_KEY') ?? '';
  }

  get enableAdminSeed(): boolean {
    return this.config.get<boolean>('ENABLE_ADMIN_SEED') ?? false;
  }

  get adminEmail(): string {
    return this.config.get<string>('ADMIN_EMAIL') ?? '';
  }

  get adminSeedPassword(): string {
    return this.config.get<string>('ADMIN_SEED_PASSWORD') ?? '';
  }

  get supabaseUrl(): string {
    return this.config.get<string>('SUPABASE_URL') ?? '';
  }

  get supabaseServiceRoleKey(): string {
    return this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  }

  get supabaseStorageBucket(): string {
    return (
      this.config.get<string>('SUPABASE_STORAGE_BUCKET') ??
      'open-router-sessions'
    );
  }

  get supabaseAvatarsPrefix(): string {
    return this.config.get<string>('SUPABASE_AVATARS_PREFIX') ?? 'avatars';
  }
}

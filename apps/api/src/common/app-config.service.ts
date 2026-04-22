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
    return v && v.length > 0 ? v : 'http://localhost:3002';
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
}

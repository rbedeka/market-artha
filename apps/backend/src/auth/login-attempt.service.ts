import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class LoginAttemptService {
  private readonly MAX_ATTEMPTS = 3;
  private readonly BLOCK_TIME_MS = 300000; // 300,000 milliseconds = 300 seconds = 5 minutes

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getCacheKey(email: string, ip: string): string {
    return `login_attempts:${email}:${ip}`;
  }

  async recordFailedAttempt(identifier: string): Promise<number> {
    const key = identifier;
    try {
      let attempts = (await this.cacheManager.get<number>(key)) || 0;
      attempts++;
      // TTL is in milliseconds for cache-manager v7 with Keyv
      await this.cacheManager.set(key, attempts, this.BLOCK_TIME_MS);
      return attempts;
    } catch (error) {
      console.error(
        `[LOGIN_ATTEMPT] Error recording failed attempt for ${key}:`,
        error,
      );
      throw error;
    }
  }

  async resetAttempts(identifier: string): Promise<void> {
    const key = identifier;
    await this.cacheManager.del(key);
  }

  async getAttempts(identifier: string): Promise<number> {
    const key = identifier;
    return (await this.cacheManager.get<number>(key)) || 0;
  }

  async shouldRequireCaptcha(identifier: string): Promise<boolean> {
    const attempts = await this.getAttempts(identifier);
    return attempts >= this.MAX_ATTEMPTS;
  }
}

import { z } from 'zod';

// URL validation schema
export const urlSchema = z.string().url('Invalid URL format');

// Custom code validation schema
export const customCodeSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{6,8}$/, 'Code must be 6-8 alphanumeric characters')
  .optional();

// Link creation schema
export const createLinkSchema = z.object({
  longUrl: urlSchema,
  customCode: customCodeSchema,
});

// Generate random code
export function generateShortCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
}

// Validate code format
export function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

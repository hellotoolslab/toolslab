import { z } from 'zod';

// Country codes with phone information
export interface CountryCode {
  code: string;
  country: string;
  dialCode: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { code: 'IT', country: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'US', country: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', country: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', country: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', country: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'ES', country: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'PT', country: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'BR', country: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', country: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', country: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CO', country: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'CL', country: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'PE', country: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'VE', country: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'CA', country: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', country: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', country: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'IN', country: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'PK', country: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', country: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'ID', country: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', country: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'SG', country: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'PH', country: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'TH', country: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', country: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'JP', country: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', country: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', country: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'HK', country: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'TW', country: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
  { code: 'RU', country: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'UA', country: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { code: 'PL', country: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'NL', country: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', country: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', country: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', country: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'SE', country: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', country: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', country: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', country: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'IE', country: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'GR', country: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'TR', country: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'IL', country: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'AE', country: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', country: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'EG', country: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'ZA', country: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', country: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', country: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'MA', country: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
];

// WhatsApp Link Parameters
export interface WhatsAppLinkParams {
  countryCode: string;
  phoneNumber: string;
  message?: string;
}

export interface WhatsAppLinkResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: {
    fullPhoneNumber: string;
    messageLength: number;
    hasMessage: boolean;
  };
}

// Validation schemas
const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\d+$/, 'Phone number must contain only digits');

const messageSchema = z.string().max(4096, 'Message too long (max 4096 chars)');

/**
 * Clean phone number by removing spaces, dashes, and other characters
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '');
}

/**
 * Build WhatsApp link
 */
export function buildWhatsAppLink(
  params: WhatsAppLinkParams
): WhatsAppLinkResult {
  try {
    // Clean and validate phone number
    const cleanedPhone = cleanPhoneNumber(params.phoneNumber);
    phoneSchema.parse(cleanedPhone);

    // Get dial code (remove + prefix for wa.me)
    const dialCode = params.countryCode.replace('+', '');

    // Build full phone number
    const fullPhoneNumber = `${dialCode}${cleanedPhone}`;

    // Build URL
    let url = `https://wa.me/${fullPhoneNumber}`;

    // Add message if provided
    let hasMessage = false;
    let messageLength = 0;

    if (params.message && params.message.trim()) {
      messageSchema.parse(params.message);
      const encodedMessage = encodeURIComponent(params.message.trim());
      url += `?text=${encodedMessage}`;
      hasMessage = true;
      messageLength = params.message.trim().length;
    }

    return {
      success: true,
      url,
      metadata: {
        fullPhoneNumber,
        messageLength,
        hasMessage,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation error',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate link',
    };
  }
}

/**
 * Parse WhatsApp link to extract parameters
 */
export function parseWhatsAppLink(url: string): WhatsAppLinkParams | null {
  try {
    // Match wa.me or api.whatsapp.com patterns
    const waMatch = url.match(
      /(?:wa\.me|api\.whatsapp\.com\/send\?phone=)\/?([\d]+)(?:\?text=(.*))?/
    );

    if (!waMatch) return null;

    const fullNumber = waMatch[1];
    const encodedMessage = waMatch[2];

    // Try to detect country code (simplified - checks common prefixes)
    let countryCode = '+1'; // Default to US
    let phoneNumber = fullNumber;

    for (const country of countryCodes) {
      const dialCode = country.dialCode.replace('+', '');
      if (fullNumber.startsWith(dialCode)) {
        countryCode = country.dialCode;
        phoneNumber = fullNumber.slice(dialCode.length);
        break;
      }
    }

    return {
      countryCode,
      phoneNumber,
      message: encodedMessage ? decodeURIComponent(encodedMessage) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Format phone number for display
 */
export function formatPhoneForDisplay(
  countryCode: string,
  phoneNumber: string
): string {
  const cleaned = cleanPhoneNumber(phoneNumber);
  return `${countryCode} ${cleaned}`;
}

/**
 * Get country by dial code
 */
export function getCountryByDialCode(
  dialCode: string
): CountryCode | undefined {
  return countryCodes.find((c) => c.dialCode === dialCode);
}

/**
 * Message templates for common use cases
 */
export const messageTemplates = {
  business: {
    inquiry: 'Hi! I would like to inquire about your products/services.',
    support:
      "Hi! I need help with an issue I'm experiencing. Can you assist me?",
    order: "Hi! I'd like to place an order. Can you help me?",
    appointment:
      "Hi! I'd like to schedule an appointment. When are you available?",
    pricing: 'Hi! Can you share the pricing information for your services?',
  },
  personal: {
    greeting: 'Hey! How are you doing?',
    meetup: "Hey! Let's catch up soon. When are you free?",
    thanks: 'Thank you so much! I really appreciate it.',
  },
  marketing: {
    promo: "Hi! I saw your promotion and I'm interested. Can you tell me more?",
    newsletter: 'Hi! I would like to subscribe to your newsletter.',
    feedback: 'Hi! I wanted to share some feedback about your service.',
  },
};

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  return /^\d{6,15}$/.test(cleaned);
}

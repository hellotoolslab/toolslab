// JWT Decoder - Professional JWT token parsing and analysis
export interface JwtDecodedHeader {
  alg?: string; // Algorithm
  typ?: string; // Type
  kid?: string; // Key ID
  [key: string]: any;
}

export interface JwtDecodedPayload {
  iss?: string; // Issuer
  sub?: string; // Subject
  aud?: string | string[]; // Audience
  exp?: number; // Expiration time
  nbf?: number; // Not before
  iat?: number; // Issued at
  jti?: string; // JWT ID
  [key: string]: any;
}

export interface JwtDecodeResult {
  success: boolean;
  error?: string;
  header?: JwtDecodedHeader;
  payload?: JwtDecodedPayload;
  signature?: string;
  isValid: boolean;
  isExpired: boolean;
  timeInfo: {
    issuedAt?: string;
    expiresAt?: string;
    notBefore?: string;
    age?: string;
    timeToExpiry?: string;
  };
  securityInfo: {
    algorithm: string;
    isSecure: boolean;
    warnings: string[];
  };
  claimsAnalysis: {
    standardClaims: Array<{
      key: string;
      value: any;
      description: string;
    }>;
    customClaims: Array<{
      key: string;
      value: any;
    }>;
  };
  metadata: {
    headerSize: number;
    payloadSize: number;
    signatureSize: number;
    totalSize: number;
    structure: 'valid' | 'invalid';
  };
  suggestions: string[];
}

export interface JwtDecodeOptions {
  validateStructure?: boolean;
  analyzeTime?: boolean;
  provideSuggestions?: boolean;
}

// Standard JWT claims with descriptions
const STANDARD_CLAIMS: Record<string, string> = {
  iss: 'Issuer - The entity that issued the JWT',
  sub: 'Subject - The principal that the JWT is about (user ID)',
  aud: 'Audience - The intended recipients of the JWT',
  exp: 'Expiration Time - When the JWT expires (Unix timestamp)',
  nbf: 'Not Before - Time before which the JWT is not valid',
  iat: 'Issued At - Time when the JWT was issued (Unix timestamp)',
  jti: 'JWT ID - Unique identifier for the JWT',
  scope: 'Scope - Permissions granted to the token holder',
  azp: 'Authorized Party - The party to which the ID token was issued',
  nonce: 'Nonce - A random value to prevent replay attacks',
  auth_time: 'Authentication Time - When user authentication occurred',
  acr: 'Authentication Context Class Reference',
  amr: 'Authentication Methods References',
  email: 'Email address of the user',
  email_verified: 'Whether the email address has been verified',
  name: 'Full name of the user',
  given_name: 'Given name of the user',
  family_name: 'Family name of the user',
  picture: 'Profile picture URL',
  roles: 'User roles or permissions',
  groups: 'Groups the user belongs to',
};

// Security assessment for JWT algorithms
const ALGORITHM_SECURITY: Record<
  string,
  { secure: boolean; warnings: string[] }
> = {
  none: {
    secure: false,
    warnings: [
      'Algorithm "none" provides no signature verification',
      'Tokens can be easily forged',
    ],
  },
  HS256: {
    secure: true,
    warnings: [
      'Symmetric algorithm - same key for signing and verification',
      'Key must be kept secret on both client and server',
    ],
  },
  HS384: {
    secure: true,
    warnings: ['Symmetric algorithm - same key for signing and verification'],
  },
  HS512: {
    secure: true,
    warnings: ['Symmetric algorithm - same key for signing and verification'],
  },
  RS256: {
    secure: true,
    warnings: [],
  },
  RS384: {
    secure: true,
    warnings: [],
  },
  RS512: {
    secure: true,
    warnings: [],
  },
  ES256: {
    secure: true,
    warnings: [],
  },
  ES384: {
    secure: true,
    warnings: [],
  },
  ES512: {
    secure: true,
    warnings: [],
  },
  PS256: {
    secure: true,
    warnings: [],
  },
  PS384: {
    secure: true,
    warnings: [],
  },
  PS512: {
    secure: true,
    warnings: [],
  },
};

/**
 * Base64URL decode function
 */
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  switch (base64.length % 4) {
    case 0:
      break;
    case 2:
      base64 += '==';
      break;
    case 3:
      base64 += '=';
      break;
    default:
      throw new Error('Invalid base64url string');
  }

  try {
    // Decode base64 and handle UTF-8
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (error) {
    throw new Error('Invalid base64url encoding');
  }
}

/**
 * Format Unix timestamp to readable date
 */
function formatTimestamp(timestamp: number): string {
  try {
    const date = new Date(timestamp * 1000);
    return date.toISOString().replace('T', ' ').replace('.000Z', ' UTC');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Calculate relative time from Unix timestamp
 */
function getRelativeTime(timestamp: number): string {
  try {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    const absDiff = Math.abs(diff);

    if (absDiff < 60) {
      return diff > 0 ? 'in a few seconds' : 'a few seconds ago';
    } else if (absDiff < 3600) {
      const mins = Math.floor(absDiff / 60);
      return diff > 0
        ? `in ${mins} minute${mins > 1 ? 's' : ''}`
        : `${mins} minute${mins > 1 ? 's' : ''} ago`;
    } else if (absDiff < 86400) {
      const hours = Math.floor(absDiff / 3600);
      return diff > 0
        ? `in ${hours} hour${hours > 1 ? 's' : ''}`
        : `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(absDiff / 86400);
      return diff > 0
        ? `in ${days} day${days > 1 ? 's' : ''}`
        : `${days} day${days > 1 ? 's' : ''} ago`;
    }
  } catch {
    return 'unknown';
  }
}

/**
 * Validate JWT structure
 */
function validateJwtStructure(token: string): {
  valid: boolean;
  error?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token is required' };
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return { valid: false, error: 'Token cannot be empty' };
  }

  const parts = trimmedToken.split('.');
  if (parts.length !== 3) {
    return {
      valid: false,
      error: `Invalid JWT structure: expected 3 parts separated by dots, got ${parts.length}`,
    };
  }

  const [header, payload, signature] = parts;

  if (!header) {
    return { valid: false, error: 'Missing JWT header' };
  }

  if (!payload) {
    return { valid: false, error: 'Missing JWT payload' };
  }

  // Signature can be empty for unsigned tokens
  if (signature === undefined) {
    return { valid: false, error: 'Missing JWT signature section' };
  }

  return { valid: true };
}

/**
 * Analyze JWT claims and categorize them
 */
function analyzeClaims(payload: JwtDecodedPayload): {
  standardClaims: Array<{ key: string; value: any; description: string }>;
  customClaims: Array<{ key: string; value: any }>;
} {
  const standardClaims = [];
  const customClaims = [];

  for (const [key, value] of Object.entries(payload)) {
    if (STANDARD_CLAIMS[key]) {
      standardClaims.push({
        key,
        value,
        description: STANDARD_CLAIMS[key],
      });
    } else {
      customClaims.push({
        key,
        value,
      });
    }
  }

  return { standardClaims, customClaims };
}

/**
 * Generate tool chaining suggestions based on JWT content
 */
function generateSuggestions(
  header: JwtDecodedHeader,
  payload: JwtDecodedPayload
): string[] {
  const suggestions = [];

  // Check for Base64 encoded data in payload
  if (
    payload &&
    Object.values(payload).some(
      (value) =>
        typeof value === 'string' &&
        value.length > 20 &&
        /^[A-Za-z0-9+/=]+$/.test(value)
    )
  ) {
    suggestions.push(
      'Found potential Base64 data in payload - try the Base64 Decoder tool'
    );
  }

  // Check for JSON strings in payload
  if (
    payload &&
    Object.values(payload).some(
      (value) =>
        typeof value === 'string' &&
        (value.startsWith('{') || value.startsWith('['))
    )
  ) {
    suggestions.push(
      'Found JSON strings in payload - try the JSON Formatter tool'
    );
  }

  // Check for URLs in payload
  if (
    payload &&
    Object.values(payload).some(
      (value) =>
        typeof value === 'string' &&
        (value.startsWith('http://') || value.startsWith('https://'))
    )
  ) {
    suggestions.push(
      'Found URLs in payload - try URL encoding/decoding tools if needed'
    );
  }

  // Check for hashed values
  if (
    payload &&
    Object.values(payload).some(
      (value) => typeof value === 'string' && /^[a-f0-9]{32,}$/.test(value)
    )
  ) {
    suggestions.push(
      'Found potential hash values - try the Hash Generator tool for verification'
    );
  }

  // Security suggestions
  if (header?.alg === 'none') {
    suggestions.push(
      'Consider using a secure signing algorithm instead of "none" for production tokens'
    );
  }

  if (payload?.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    suggestions.push(
      'Token is expired - check expiration handling in your application'
    );
  }

  return suggestions;
}

/**
 * Main JWT decoder function
 */
export function decodeJwt(
  token: string,
  options: JwtDecodeOptions = {}
): JwtDecodeResult {
  const {
    validateStructure = true,
    analyzeTime = true,
    provideSuggestions = true,
  } = options;

  try {
    // Validate structure first
    if (validateStructure) {
      const structureValidation = validateJwtStructure(token);
      if (!structureValidation.valid) {
        return {
          success: false,
          error: structureValidation.error,
          isValid: false,
          isExpired: false,
          timeInfo: {},
          securityInfo: {
            algorithm: 'unknown',
            isSecure: false,
            warnings: ['Invalid token structure'],
          },
          claimsAnalysis: {
            standardClaims: [],
            customClaims: [],
          },
          metadata: {
            headerSize: 0,
            payloadSize: 0,
            signatureSize: 0,
            totalSize: token ? token.length : 0,
            structure: 'invalid',
          },
          suggestions: [],
        };
      }
    }

    const parts = token.trim().split('.');
    const [headerPart, payloadPart, signaturePart] = parts;

    // Decode header
    let header: JwtDecodedHeader;
    try {
      const decodedHeader = base64UrlDecode(headerPart);
      header = JSON.parse(decodedHeader);
    } catch (error) {
      return {
        success: false,
        error: `Invalid JWT header: ${error instanceof Error ? error.message : 'Failed to decode'}`,
        isValid: false,
        isExpired: false,
        timeInfo: {},
        securityInfo: {
          algorithm: 'unknown',
          isSecure: false,
          warnings: ['Invalid header encoding'],
        },
        claimsAnalysis: {
          standardClaims: [],
          customClaims: [],
        },
        metadata: {
          headerSize: headerPart.length,
          payloadSize: payloadPart.length,
          signatureSize: signaturePart.length,
          totalSize: token.length,
          structure: 'invalid',
        },
        suggestions: [],
      };
    }

    // Decode payload
    let payload: JwtDecodedPayload;
    try {
      const decodedPayload = base64UrlDecode(payloadPart);
      payload = JSON.parse(decodedPayload);
    } catch (error) {
      return {
        success: false,
        error: `Invalid JWT payload: ${error instanceof Error ? error.message : 'Failed to decode'}`,
        header,
        isValid: false,
        isExpired: false,
        timeInfo: {},
        securityInfo: {
          algorithm: header?.alg || 'unknown',
          isSecure: false,
          warnings: ['Invalid payload encoding'],
        },
        claimsAnalysis: {
          standardClaims: [],
          customClaims: [],
        },
        metadata: {
          headerSize: headerPart.length,
          payloadSize: payloadPart.length,
          signatureSize: signaturePart.length,
          totalSize: token.length,
          structure: 'invalid',
        },
        suggestions: [],
      };
    }

    // Analyze time-based claims
    const timeInfo: JwtDecodeResult['timeInfo'] = {};
    let isExpired = false;

    if (analyzeTime) {
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp) {
        timeInfo.expiresAt = formatTimestamp(payload.exp);
        timeInfo.timeToExpiry = getRelativeTime(payload.exp);
        isExpired = payload.exp < now;
      }

      if (payload.iat) {
        timeInfo.issuedAt = formatTimestamp(payload.iat);
        timeInfo.age = getRelativeTime(payload.iat);
      }

      if (payload.nbf) {
        timeInfo.notBefore = formatTimestamp(payload.nbf);
      }
    }

    // Security analysis
    const algorithm = header?.alg || 'unknown';
    const algorithmInfo = ALGORITHM_SECURITY[algorithm] || {
      secure: false,
      warnings: [`Unknown algorithm: ${algorithm}`],
    };

    const securityInfo: JwtDecodeResult['securityInfo'] = {
      algorithm,
      isSecure: algorithmInfo.secure,
      warnings: [...algorithmInfo.warnings],
    };

    // Additional security warnings
    if (isExpired) {
      securityInfo.warnings.push('Token is expired');
    }

    if (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000)) {
      securityInfo.warnings.push(
        'Token is not yet valid (nbf claim in future)'
      );
    }

    // Analyze claims
    const claimsAnalysis = analyzeClaims(payload);

    // Generate suggestions
    const suggestions = provideSuggestions
      ? generateSuggestions(header, payload)
      : [];

    // Calculate metadata
    const metadata: JwtDecodeResult['metadata'] = {
      headerSize: headerPart.length,
      payloadSize: payloadPart.length,
      signatureSize: signaturePart.length,
      totalSize: token.length,
      structure: 'valid',
    };

    return {
      success: true,
      header,
      payload,
      signature: signaturePart,
      isValid: true,
      isExpired,
      timeInfo,
      securityInfo,
      claimsAnalysis,
      metadata,
      suggestions,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to decode JWT',
      isValid: false,
      isExpired: false,
      timeInfo: {},
      securityInfo: {
        algorithm: 'unknown',
        isSecure: false,
        warnings: ['Processing error'],
      },
      claimsAnalysis: {
        standardClaims: [],
        customClaims: [],
      },
      metadata: {
        headerSize: 0,
        payloadSize: 0,
        signatureSize: 0,
        totalSize: token.length,
        structure: 'invalid',
      },
      suggestions: [],
    };
  }
}

/**
 * Generate sample JWTs for testing
 */
export function generateSampleJwts(): { [key: string]: string } {
  return {
    'Standard JWT':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    'Expired JWT':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.4lMHu6Ej4JdJ_Kn7hOJKL8L3zCJLJX_nVQBG8G8a4s8',
    'Complex Claims JWT':
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InB1YmxpY19rZXkifQ.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwic3ViIjoidXNlcl8xMjM0NSIsImF1ZCI6WyJhcGkxIiwiYXBpMiJdLCJleHAiOjE3MDk2ODQ4MDAsIm5iZiI6MTcwOTU5ODQwMCwiaWF0IjoxNzA5NTk4NDAwLCJqdGkiOiJ1bmlxdWVfaWRfMTIzNDUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl0sInBlcm1pc3Npb25zIjp7InJlYWQiOnRydWUsIndyaXRlIjp0cnVlLCJkZWxldGUiOmZhbHNlfX0.signature_would_be_here',
    'Unsigned JWT (alg: none)':
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.',
  };
}

/**
 * Validate multiple JWTs from input (line-separated)
 */
export function decodeMultipleJwts(
  input: string,
  options: JwtDecodeOptions = {}
): JwtDecodeResult[] {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  return lines.map((line) => decodeJwt(line, options));
}

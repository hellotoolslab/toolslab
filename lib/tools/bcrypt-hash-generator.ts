import bcrypt from 'bcryptjs';

// Types
export interface BcryptOptions {
  rounds?: number;
}

export interface BcryptResult {
  success: boolean;
  hash?: string;
  salt?: string;
  rounds?: number;
  timeTaken?: number;
  error?: string;
}

export interface BcryptVerifyResult {
  success: boolean;
  isMatch?: boolean;
  timeTaken?: number;
  error?: string;
}

export interface BcryptParseResult {
  success: boolean;
  version?: string;
  rounds?: number;
  salt?: string;
  hash?: string;
  error?: string;
}

// Constants
const MIN_ROUNDS = 4;
const MAX_ROUNDS = 12;
const DEFAULT_ROUNDS = 10;
const MAX_BATCH_COUNT = 10;

/**
 * Clamp rounds to valid range
 */
function clampRounds(rounds: number): number {
  if (rounds < MIN_ROUNDS) return MIN_ROUNDS;
  if (rounds > MAX_ROUNDS) return MAX_ROUNDS;
  return rounds;
}

/**
 * Generate a bcrypt hash from a password
 */
export async function generateBcryptHash(
  password: string | null | undefined,
  options: BcryptOptions = {}
): Promise<BcryptResult> {
  const startTime = Date.now();

  try {
    // Validate input
    if (password === null || password === undefined) {
      return {
        success: false,
        error: 'Password is required',
      };
    }

    // Convert to string if needed
    const passwordStr = String(password);

    if (passwordStr === '') {
      return {
        success: false,
        error: 'Password is required',
      };
    }

    if (passwordStr.trim() === '') {
      return {
        success: false,
        error: 'Password cannot be empty or whitespace only',
      };
    }

    // Determine rounds
    const rounds = clampRounds(options.rounds ?? DEFAULT_ROUNDS);

    // Generate salt and hash
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(passwordStr, salt);

    const timeTaken = Date.now() - startTime;

    return {
      success: true,
      hash,
      salt,
      rounds,
      timeTaken,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate hash',
      timeTaken: Date.now() - startTime,
    };
  }
}

/**
 * Verify a password against a bcrypt hash
 */
export async function verifyBcryptHash(
  password: string | null | undefined,
  hash: string | null | undefined
): Promise<BcryptVerifyResult> {
  const startTime = Date.now();

  try {
    // Validate inputs
    if (password === null || password === undefined || password === '') {
      return {
        success: false,
        error: 'Password is required',
      };
    }

    if (hash === null || hash === undefined || hash === '') {
      return {
        success: false,
        error: 'Hash is required',
      };
    }

    // Validate hash format before attempting verification
    const parseResult = parseBcryptHash(hash);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error || 'Invalid hash format',
      };
    }

    // Verify
    const isMatch = await bcrypt.compare(String(password), hash);

    const timeTaken = Date.now() - startTime;

    return {
      success: true,
      isMatch,
      timeTaken,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify hash',
      timeTaken: Date.now() - startTime,
    };
  }
}

/**
 * Generate multiple bcrypt hashes for batch testing
 */
export async function generateMultipleBcryptHashes(
  password: string,
  count: number,
  options: BcryptOptions = {}
): Promise<BcryptResult[]> {
  // Validate count
  if (count <= 0) {
    return [];
  }

  // Limit count to reasonable maximum
  const actualCount = Math.min(count, MAX_BATCH_COUNT);

  const results: BcryptResult[] = [];

  for (let i = 0; i < actualCount; i++) {
    const result = await generateBcryptHash(password, options);
    results.push(result);
  }

  return results;
}

/**
 * Parse a bcrypt hash to extract its components
 */
export function parseBcryptHash(
  hash: string | null | undefined
): BcryptParseResult {
  try {
    // Validate input
    if (hash === null || hash === undefined || hash === '') {
      return {
        success: false,
        error: 'Hash is required',
      };
    }

    // Bcrypt hash format: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
    // Parts: $version$rounds$salt(22 chars)hash(31 chars)
    const bcryptRegex = /^\$2([aby])\$(\d{2})\$(.{22})(.{31})$/;
    const match = hash.match(bcryptRegex);

    if (!match) {
      return {
        success: false,
        error: 'Invalid bcrypt hash format. Expected format: $2a$XX$...',
      };
    }

    const [, version, roundsStr, salt, hashPart] = match;

    return {
      success: true,
      version: `2${version}`,
      rounds: parseInt(roundsStr, 10),
      salt,
      hash: hashPart,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to parse bcrypt hash',
    };
  }
}

/**
 * Get bcrypt algorithm info
 */
export function getBcryptInfo(): {
  minRounds: number;
  maxRounds: number;
  defaultRounds: number;
  maxPasswordLength: number;
  hashLength: number;
} {
  return {
    minRounds: MIN_ROUNDS,
    maxRounds: MAX_ROUNDS,
    defaultRounds: DEFAULT_ROUNDS,
    maxPasswordLength: 72, // bcrypt truncates at 72 bytes
    hashLength: 60, // Total hash string length
  };
}

/**
 * Estimate hashing time based on rounds
 * Returns approximate milliseconds
 */
export function estimateHashingTime(rounds: number): number {
  // Base time at rounds=4 is approximately 3ms
  // Each additional round doubles the time
  const baseTime = 3;
  const actualRounds = clampRounds(rounds);
  return baseTime * Math.pow(2, actualRounds - 4);
}

/**
 * Generate sample passwords for testing
 */
export function generateSamplePasswords(): Record<string, string> {
  return {
    'Simple password': 'password123',
    'Strong password': 'MyStr0ng!P@ssw0rd#2024',
    'With spaces': 'my secret password',
    'Special characters': '!@#$%^&*()_+-=[]{}|;:\'",.<>?',
    Unicode: '密码パスワード',
    'Very long (72 chars)': 'a'.repeat(72),
  };
}

/**
 * Chmod Calculator - Unix file permissions calculator
 * Converts between octal and symbolic notation
 */

export interface Permission {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface Permissions {
  owner: Permission;
  group: Permission;
  others: Permission;
}

export interface ChmodResult {
  octal: string;
  symbolic: string;
  command: string;
  binary: string;
  permissions: Permissions;
}

// Common permission presets
export const PERMISSION_PRESETS = [
  {
    octal: '755',
    name: 'Standard Directory',
    description: 'Owner full, group/others read+execute',
  },
  {
    octal: '644',
    name: 'Standard File',
    description: 'Owner read+write, group/others read only',
  },
  {
    octal: '777',
    name: 'Full Access',
    description: 'Everyone has full access (use with caution)',
  },
  {
    octal: '700',
    name: 'Private',
    description: 'Owner full, no access for others',
  },
  {
    octal: '750',
    name: 'Group Access',
    description: 'Owner full, group read+execute, no others',
  },
  {
    octal: '640',
    name: 'Group Read',
    description: 'Owner read+write, group read only, no others',
  },
  {
    octal: '600',
    name: 'Private File',
    description: 'Owner read+write, no access for others',
  },
  {
    octal: '666',
    name: 'All Read/Write',
    description: 'Everyone can read and write',
  },
  {
    octal: '555',
    name: 'Read+Execute All',
    description: 'Everyone can read and execute',
  },
  {
    octal: '444',
    name: 'Read Only All',
    description: 'Everyone can only read',
  },
];

/**
 * Convert a single permission digit (0-7) to Permission object
 */
function digitToPermission(digit: number): Permission {
  return {
    read: (digit & 4) !== 0,
    write: (digit & 2) !== 0,
    execute: (digit & 1) !== 0,
  };
}

/**
 * Convert Permission object to digit (0-7)
 */
function permissionToDigit(permission: Permission): number {
  let digit = 0;
  if (permission.read) digit += 4;
  if (permission.write) digit += 2;
  if (permission.execute) digit += 1;
  return digit;
}

/**
 * Convert Permission object to symbolic string (rwx)
 */
function permissionToSymbolic(permission: Permission): string {
  return (
    (permission.read ? 'r' : '-') +
    (permission.write ? 'w' : '-') +
    (permission.execute ? 'x' : '-')
  );
}

/**
 * Convert Permission object to binary string (e.g., "101")
 */
function permissionToBinary(permission: Permission): string {
  return (
    (permission.read ? '1' : '0') +
    (permission.write ? '1' : '0') +
    (permission.execute ? '1' : '0')
  );
}

/**
 * Parse octal string (e.g., "755") to Permissions
 */
export function parseOctal(octal: string): Permissions | null {
  // Remove leading zeros and validate
  const normalized = octal.replace(/^0+/, '') || '0';

  // Pad to 3 digits
  const padded = normalized.padStart(3, '0');

  // Validate format
  if (!/^[0-7]{3,4}$/.test(padded)) {
    return null;
  }

  // Take last 3 digits (ignore special bits like setuid/setgid for now)
  const digits = padded.slice(-3);

  return {
    owner: digitToPermission(parseInt(digits[0], 10)),
    group: digitToPermission(parseInt(digits[1], 10)),
    others: digitToPermission(parseInt(digits[2], 10)),
  };
}

/**
 * Parse symbolic string (e.g., "rwxr-xr-x") to Permissions
 */
export function parseSymbolic(symbolic: string): Permissions | null {
  // Remove leading - or d (directory indicator)
  const normalized = symbolic.replace(/^[-d]/, '');

  // Validate format
  if (!/^[rwx-]{9}$/.test(normalized)) {
    return null;
  }

  const parseSection = (section: string): Permission => ({
    read: section[0] === 'r',
    write: section[1] === 'w',
    execute: section[2] === 'x',
  });

  return {
    owner: parseSection(normalized.slice(0, 3)),
    group: parseSection(normalized.slice(3, 6)),
    others: parseSection(normalized.slice(6, 9)),
  };
}

/**
 * Convert Permissions to full ChmodResult
 */
export function permissionsToResult(
  permissions: Permissions,
  filename: string = 'file.txt'
): ChmodResult {
  const ownerDigit = permissionToDigit(permissions.owner);
  const groupDigit = permissionToDigit(permissions.group);
  const othersDigit = permissionToDigit(permissions.others);

  const octal = `${ownerDigit}${groupDigit}${othersDigit}`;
  const symbolic =
    permissionToSymbolic(permissions.owner) +
    permissionToSymbolic(permissions.group) +
    permissionToSymbolic(permissions.others);
  const binary =
    permissionToBinary(permissions.owner) +
    permissionToBinary(permissions.group) +
    permissionToBinary(permissions.others);

  return {
    octal,
    symbolic,
    command: `chmod ${octal} ${filename}`,
    binary,
    permissions,
  };
}

/**
 * Main calculation function - from octal
 */
export function calculateFromOctal(
  octal: string,
  filename?: string
): ChmodResult | null {
  const permissions = parseOctal(octal);
  if (!permissions) return null;
  return permissionsToResult(permissions, filename);
}

/**
 * Main calculation function - from symbolic
 */
export function calculateFromSymbolic(
  symbolic: string,
  filename?: string
): ChmodResult | null {
  const permissions = parseSymbolic(symbolic);
  if (!permissions) return null;
  return permissionsToResult(permissions, filename);
}

/**
 * Create default permissions (644)
 */
export function getDefaultPermissions(): Permissions {
  return {
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false },
  };
}

/**
 * Validate octal input
 */
export function isValidOctal(octal: string): boolean {
  return /^[0-7]{1,4}$/.test(octal);
}

/**
 * Validate symbolic input
 */
export function isValidSymbolic(symbolic: string): boolean {
  const normalized = symbolic.replace(/^[-d]/, '');
  return /^[rwx-]{9}$/.test(normalized);
}

export interface FormatDetectionResult {
  type: string
  confidence: number
  suggestedTools: string[]
  description: string
}

export function detectFormat(input: string): FormatDetectionResult {
  if (!input || input.trim().length === 0) {
    return {
      type: 'empty',
      confidence: 1.0,
      suggestedTools: [],
      description: 'Empty input'
    }
  }

  const trimmedInput = input.trim()

  // Check for JWT
  const jwtRegex = /^eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+$/
  if (jwtRegex.test(trimmedInput)) {
    return {
      type: 'jwt',
      confidence: 0.95,
      suggestedTools: ['jwt-decoder', 'base64'],
      description: 'JSON Web Token detected'
    }
  }

  // Check for Base64 (must be before JSON as valid JSON can look like base64)
  const base64Regex = /^[A-Za-z0-9+/]+=*$/
  if (base64Regex.test(trimmedInput) && trimmedInput.length % 4 === 0 && trimmedInput.length > 4) {
    return {
      type: 'base64',
      confidence: 0.8,
      suggestedTools: ['base64', 'url-encoder', 'jwt-decoder'],
      description: 'Base64 encoded data detected'
    }
  }

  // Check for JSON
  try {
    const parsed = JSON.parse(trimmedInput)
    if (typeof parsed === 'object') {
      return {
        type: 'json',
        confidence: 0.9,
        suggestedTools: ['json-formatter', 'base64', 'url-encoder'],
        description: 'JSON object detected'
      }
    }
  } catch {
    // Not JSON, continue checking
  }

  // Check for URL
  try {
    new URL(trimmedInput)
    return {
      type: 'url',
      confidence: 0.9,
      suggestedTools: ['url-encoder', 'base64', 'qr-generator'],
      description: 'URL detected'
    }
  } catch {
    // Not a URL, continue checking
  }

  // Check for URL encoded data
  if (trimmedInput.includes('%') && /^[\w%.-]+$/.test(trimmedInput)) {
    return {
      type: 'url-encoded',
      confidence: 0.7,
      suggestedTools: ['url-encoder', 'base64'],
      description: 'URL encoded data detected'
    }
  }

  // Check for UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (uuidRegex.test(trimmedInput)) {
    return {
      type: 'uuid',
      confidence: 0.95,
      suggestedTools: ['uuid-generator', 'qr-generator'],
      description: 'UUID detected'
    }
  }

  // Check for Hash (MD5, SHA1, SHA256, etc.)
  if (/^[a-f0-9]{32}$/i.test(trimmedInput)) {
    return {
      type: 'hash-md5',
      confidence: 0.8,
      suggestedTools: ['hash-generator', 'base64'],
      description: 'MD5 hash detected'
    }
  }

  if (/^[a-f0-9]{40}$/i.test(trimmedInput)) {
    return {
      type: 'hash-sha1',
      confidence: 0.8,
      suggestedTools: ['hash-generator', 'base64'],
      description: 'SHA1 hash detected'
    }
  }

  if (/^[a-f0-9]{64}$/i.test(trimmedInput)) {
    return {
      type: 'hash-sha256',
      confidence: 0.8,
      suggestedTools: ['hash-generator', 'base64'],
      description: 'SHA256 hash detected'
    }
  }

  // Check for timestamp (Unix timestamp)
  if (/^\d{10}$/.test(trimmedInput)) {
    const timestamp = parseInt(trimmedInput)
    const date = new Date(timestamp * 1000)
    if (date.getFullYear() > 1970 && date.getFullYear() < 2100) {
      return {
        type: 'unix-timestamp',
        confidence: 0.7,
        suggestedTools: ['timestamp-converter', 'qr-generator'],
        description: 'Unix timestamp detected'
      }
    }
  }

  // Check for millisecond timestamp
  if (/^\d{13}$/.test(trimmedInput)) {
    const timestamp = parseInt(trimmedInput)
    const date = new Date(timestamp)
    if (date.getFullYear() > 1970 && date.getFullYear() < 2100) {
      return {
        type: 'unix-timestamp-ms',
        confidence: 0.7,
        suggestedTools: ['timestamp-converter', 'qr-generator'],
        description: 'Unix timestamp (milliseconds) detected'
      }
    }
  }

  // Check for HTML
  if (trimmedInput.includes('<') && trimmedInput.includes('>')) {
    return {
      type: 'html',
      confidence: 0.6,
      suggestedTools: ['html-encoder', 'base64', 'qr-generator'],
      description: 'HTML content detected'
    }
  }

  // Check for XML
  if (trimmedInput.startsWith('<?xml') || (trimmedInput.includes('<') && trimmedInput.includes('</'))) {
    return {
      type: 'xml',
      confidence: 0.7,
      suggestedTools: ['html-encoder', 'base64', 'json-formatter'],
      description: 'XML content detected'
    }
  }

  // Check for Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(trimmedInput)) {
    return {
      type: 'email',
      confidence: 0.8,
      suggestedTools: ['qr-generator', 'url-encoder', 'hash-generator'],
      description: 'Email address detected'
    }
  }

  // Check for hex color
  if (/^#[0-9a-f]{6}$/i.test(trimmedInput)) {
    return {
      type: 'hex-color',
      confidence: 0.9,
      suggestedTools: ['color-picker', 'qr-generator'],
      description: 'Hex color code detected'
    }
  }

  // Check for IP address
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (ipRegex.test(trimmedInput)) {
    return {
      type: 'ip-address',
      confidence: 0.9,
      suggestedTools: ['qr-generator', 'hash-generator'],
      description: 'IP address detected'
    }
  }

  // Check for phone number (basic pattern)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  if (phoneRegex.test(trimmedInput.replace(/[\s\-\(\)]/g, ''))) {
    return {
      type: 'phone',
      confidence: 0.6,
      suggestedTools: ['qr-generator', 'url-encoder'],
      description: 'Phone number detected'
    }
  }

  // Default to plain text
  return {
    type: 'text',
    confidence: 0.5,
    suggestedTools: ['base64', 'url-encoder', 'hash-generator', 'qr-generator'],
    description: 'Plain text detected'
  }
}

export function getSuggestedToolsForOutput(outputType: string, currentTool: string): string[] {
  const suggestions: Record<string, string[]> = {
    'json': ['base64', 'url-encoder', 'hash-generator', 'qr-generator'],
    'base64': ['json-formatter', 'url-encoder', 'hash-generator'],
    'url': ['qr-generator', 'base64', 'hash-generator'],
    'hash': ['base64', 'qr-generator'],
    'uuid': ['qr-generator', 'hash-generator', 'base64'],
    'text': ['base64', 'url-encoder', 'hash-generator', 'qr-generator'],
    'jwt': ['json-formatter', 'base64'],
    'timestamp': ['qr-generator', 'hash-generator']
  }

  const tools = suggestions[outputType] || suggestions['text']
  return tools.filter(tool => tool !== currentTool)
}
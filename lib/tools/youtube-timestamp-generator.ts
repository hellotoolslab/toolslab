import { z } from 'zod';

// Timestamp format types
export type TimestampFormat = 'seconds' | 'hms' | 'youtube-link' | 'chapters';

export interface Timestamp {
  id: string;
  time: number; // Always stored as seconds
  label: string;
}

export interface TimestampResult {
  success: boolean;
  result?: string;
  timestamps?: Timestamp[];
  error?: string;
}

export interface ConversionResult {
  success: boolean;
  seconds?: number;
  formatted?: string;
  error?: string;
}

// Validation schemas
const timeStringSchema = z
  .string()
  .regex(
    /^(\d{1,2}:)?(\d{1,2}):(\d{2})$/,
    'Invalid time format. Use MM:SS or HH:MM:SS'
  );

const secondsSchema = z
  .number()
  .min(0, 'Seconds must be positive')
  .max(86400, 'Maximum 24 hours');

const youtubeUrlSchema = z
  .string()
  .regex(
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    'Invalid YouTube URL'
  );

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTimeToSeconds(timeString: string): ConversionResult {
  try {
    const trimmed = timeString.trim();

    // Handle pure seconds input
    if (/^\d+$/.test(trimmed)) {
      const seconds = parseInt(trimmed, 10);
      secondsSchema.parse(seconds);
      return { success: true, seconds };
    }

    // Validate format
    timeStringSchema.parse(trimmed);

    const parts = trimmed.split(':').map(Number);
    let seconds = 0;

    if (parts.length === 2) {
      // MM:SS
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    secondsSchema.parse(seconds);
    return { success: true, seconds };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid time format',
    };
  }
}

/**
 * Format seconds to time string (HH:MM:SS or MM:SS)
 */
export function formatSecondsToTime(
  totalSeconds: number,
  forceHours = false
): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0 || forceHours) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Generate YouTube link with timestamp
 */
export function generateYouTubeLink(
  videoUrl: string,
  seconds: number
): string | null {
  try {
    // Extract video ID from various YouTube URL formats
    let videoId: string | null = null;

    // youtu.be/VIDEO_ID
    const shortMatch = videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }

    // youtube.com/watch?v=VIDEO_ID
    const longMatch = videoUrl.match(
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    );
    if (longMatch) {
      videoId = longMatch[1];
    }

    // youtube.com/embed/VIDEO_ID
    const embedMatch = videoUrl.match(
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    );
    if (embedMatch) {
      videoId = embedMatch[1];
    }

    // youtube.com/v/VIDEO_ID
    const vMatch = videoUrl.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
    if (vMatch) {
      videoId = vMatch[1];
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`;
  } catch {
    return null;
  }
}

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generate YouTube Chapters format
 * Format: 00:00 Introduction
 *         01:30 First Topic
 *         05:45 Second Topic
 */
export function generateChaptersFormat(timestamps: Timestamp[]): string {
  // Sort by time
  const sorted = [...timestamps].sort((a, b) => a.time - b.time);

  // Check if first timestamp starts at 0:00 (required for YouTube chapters)
  const hasIntro = sorted.length > 0 && sorted[0].time === 0;

  return sorted
    .map((ts) => {
      const time = formatSecondsToTime(ts.time);
      return `${time} ${ts.label}`;
    })
    .join('\n');
}

/**
 * Parse YouTube Chapters format back to timestamps
 */
export function parseChaptersFormat(text: string): Timestamp[] {
  const lines = text.trim().split('\n');
  const timestamps: Timestamp[] = [];

  for (const line of lines) {
    // Match patterns like "00:00 Introduction" or "1:30:00 Long section"
    const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/);
    if (match) {
      const timeStr = match[1];
      const label = match[2].trim();

      const result = parseTimeToSeconds(timeStr);
      if (result.success && result.seconds !== undefined) {
        timestamps.push({
          id: crypto.randomUUID(),
          time: result.seconds,
          label,
        });
      }
    }
  }

  return timestamps;
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  try {
    youtubeUrlSchema.parse(url);
    return extractVideoId(url) !== null;
  } catch {
    return false;
  }
}

/**
 * Generate timestamps list with links
 */
export function generateTimestampLinks(
  timestamps: Timestamp[],
  videoUrl?: string
): string {
  const sorted = [...timestamps].sort((a, b) => a.time - b.time);

  return sorted
    .map((ts) => {
      const time = formatSecondsToTime(ts.time);
      if (videoUrl && isValidYouTubeUrl(videoUrl)) {
        const link = generateYouTubeLink(videoUrl, ts.time);
        return `${time} - ${ts.label}${link ? ` (${link})` : ''}`;
      }
      return `${time} - ${ts.label}`;
    })
    .join('\n');
}

/**
 * Convert seconds to YouTube URL parameter format
 */
export function secondsToYouTubeParam(seconds: number): string {
  return `${seconds}s`;
}

/**
 * Parse YouTube timestamp parameter (e.g., "1h30m45s", "90", "1:30:45")
 */
export function parseYouTubeTimestamp(param: string): number | null {
  // Format: 1h30m45s
  const hmsMatch = param.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  if (hmsMatch && (hmsMatch[1] || hmsMatch[2] || hmsMatch[3])) {
    const hours = parseInt(hmsMatch[1] || '0', 10);
    const minutes = parseInt(hmsMatch[2] || '0', 10);
    const seconds = parseInt(hmsMatch[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Pure seconds
  if (/^\d+$/.test(param)) {
    return parseInt(param, 10);
  }

  // MM:SS or HH:MM:SS
  const result = parseTimeToSeconds(param);
  if (result.success && result.seconds !== undefined) {
    return result.seconds;
  }

  return null;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins} minutes`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
  }
}

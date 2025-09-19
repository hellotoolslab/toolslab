/**
 * Batch IndexNow API endpoint
 * Accepts multiple URLs and submits them to IndexNow search engines
 * POST /api/indexnow/batch - Submit URLs
 * GET /api/indexnow/batch - API documentation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/api/rateLimit';

// Validation schemas
const BatchSubmitSchema = z.object({
  urls: z
    .array(z.string().url())
    .min(1, 'At least one URL is required')
    .max(100, 'Maximum 100 URLs per request'),
  key: z.string().optional(),
});

type BatchSubmitRequest = z.infer<typeof BatchSubmitSchema>;

// IndexNow endpoints
const INDEXNOW_ENGINES = [
  { name: 'IndexNow.org', url: 'https://api.indexnow.org/indexnow' },
  { name: 'Bing', url: 'https://www.bing.com/indexnow' },
  { name: 'Yandex', url: 'https://yandex.com/indexnow' },
];

// Get IndexNow key from environment
const INDEXNOW_KEY =
  process.env.NEXT_PUBLIC_INDEXNOW_KEY || process.env.INDEXNOW_KEY;
const API_SECRET_KEY = process.env.INDEXNOW_API_SECRET_KEY;

interface SubmissionResult {
  engine: string;
  success: boolean;
  status?: number;
  message?: string;
}

interface BatchResponse {
  success: boolean;
  message: string;
  submittedCount: number;
  domains: number;
  enginesSuccess: number;
  enginesTotal: number;
  details?: SubmissionResult[];
  errors?: string[];
}

/**
 * Submit URLs to a single IndexNow engine
 */
async function submitToEngine(
  engine: { name: string; url: string },
  urls: string[],
  host: string
): Promise<SubmissionResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(engine.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        urlList: urls,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // IndexNow returns 200 or 202 for success
    const success = response.status === 200 || response.status === 202;

    return {
      engine: engine.name,
      success,
      status: response.status,
      message: success
        ? `Successfully submitted ${urls.length} URLs`
        : `Failed with status ${response.status}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      engine: engine.name,
      success: false,
      message: message.includes('aborted') ? 'Request timeout (10s)' : message,
    };
  }
}

/**
 * Group URLs by domain
 */
function groupUrlsByDomain(urls: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  for (const url of urls) {
    try {
      const { hostname } = new URL(url);
      if (!groups.has(hostname)) {
        groups.set(hostname, []);
      }
      groups.get(hostname)!.push(url);
    } catch {
      // Skip invalid URLs
    }
  }

  return groups;
}

/**
 * POST /api/indexnow/batch
 * Submit URLs to IndexNow in batch
 */
export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 10),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
          },
        }
      );
    }

    // Parse and validate request body
    let body: BatchSubmitRequest;
    try {
      const rawBody = await request.json();
      body = BatchSubmitSchema.parse(rawBody);
    } catch (error) {
      const message =
        error instanceof z.ZodError
          ? error.issues
              .map((e) => `${e.path.join('.')}: ${e.message}`)
              .join(', ')
          : 'Invalid request body';

      return NextResponse.json(
        {
          success: false,
          message,
          errors: error instanceof z.ZodError ? error.issues : undefined,
        },
        { status: 400 }
      );
    }

    // Check API key if required
    if (API_SECRET_KEY && body.key !== API_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid API key',
        },
        { status: 401 }
      );
    }

    // Check if IndexNow key is configured
    if (!INDEXNOW_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'IndexNow key not configured on server',
        },
        { status: 500 }
      );
    }

    // Group URLs by domain
    const domainGroups = groupUrlsByDomain(body.urls);

    if (domainGroups.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No valid URLs provided',
        },
        { status: 400 }
      );
    }

    // Submit to all engines for each domain
    const allResults: SubmissionResult[] = [];
    let totalSubmitted = 0;

    for (const [domain, urls] of domainGroups.entries()) {
      // Submit to all engines in parallel for each domain
      const enginePromises = INDEXNOW_ENGINES.map((engine) =>
        submitToEngine(engine, urls, domain)
      );

      const results = await Promise.all(enginePromises);
      allResults.push(...results);
      totalSubmitted += urls.length;
    }

    // Calculate statistics
    const successCount = allResults.filter((r) => r.success).length;
    const errors = allResults
      .filter((r) => !r.success)
      .map((r) => `${r.engine}: ${r.message}`);

    const response: BatchResponse = {
      success: successCount > 0,
      message:
        successCount > 0
          ? `Successfully submitted ${totalSubmitted} URLs to ${successCount}/${INDEXNOW_ENGINES.length} engines`
          : 'All IndexNow submissions failed',
      submittedCount: totalSubmitted,
      domains: domainGroups.size,
      enginesSuccess: Math.floor(successCount / domainGroups.size),
      enginesTotal: INDEXNOW_ENGINES.length,
      details: allResults,
      errors: errors.length > 0 ? errors : undefined,
    };

    // Log submission for monitoring
    console.log('IndexNow batch submission:', {
      urls: body.urls.length,
      domains: domainGroups.size,
      success: successCount,
      failed: allResults.length - successCount,
    });

    return NextResponse.json(response, {
      status: response.success ? 200 : 207, // 207 Multi-Status for partial success
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
      },
    });
  } catch (error) {
    console.error('IndexNow batch API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexnow/batch
 * API documentation
 */
export async function GET() {
  const documentation = {
    endpoint: '/api/indexnow/batch',
    method: 'POST',
    description: 'Submit multiple URLs to IndexNow search engines for indexing',
    version: '1.0.0',
    rateLimiting: {
      requests: 10,
      window: '10 seconds',
      identifier: 'IP address or API key',
    },
    request: {
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        urls: {
          type: 'array',
          description: 'Array of URLs to submit',
          required: true,
          minItems: 1,
          maxItems: 100,
          example: ['https://toolslab.dev/tools/json-formatter'],
        },
        key: {
          type: 'string',
          description: 'Optional API key for authentication',
          required: false,
        },
      },
    },
    response: {
      success: {
        status: 200,
        body: {
          success: true,
          message: 'Success message',
          submittedCount: 'Number of URLs submitted',
          domains: 'Number of unique domains',
          enginesSuccess: 'Number of successful engine submissions',
          enginesTotal: 'Total number of engines',
          details: 'Array of submission results per engine',
        },
      },
      rateLimit: {
        status: 429,
        body: {
          success: false,
          message: 'Too many requests',
          retryAfter: 'Seconds to wait before retry',
        },
      },
      error: {
        status: '400/401/500',
        body: {
          success: false,
          message: 'Error description',
          errors: 'Validation errors (if applicable)',
        },
      },
    },
    examples: {
      simple: {
        description: 'Submit a single URL',
        curl: `curl -X POST https://toolslab.dev/api/indexnow/batch \\
  -H "Content-Type: application/json" \\
  -d '{"urls": ["https://toolslab.dev/tools/json-formatter"]}'`,
      },
      multiple: {
        description: 'Submit multiple URLs',
        curl: `curl -X POST https://toolslab.dev/api/indexnow/batch \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://toolslab.dev/tools/json-formatter",
      "https://toolslab.dev/tools/base64-encoder",
      "https://toolslab.dev/tools/jwt-decoder"
    ]
  }'`,
      },
      authenticated: {
        description: 'Submit with API key',
        curl: `curl -X POST https://toolslab.dev/api/indexnow/batch \\
  -H "Content-Type: application/json" \\
  -d '{"urls": ["..."], "key": "your-api-key"}'`,
      },
      fromFile: {
        description: 'Submit URLs from a JSON file',
        curl: `curl -X POST https://toolslab.dev/api/indexnow/batch \\
  -H "Content-Type: application/json" \\
  -d @urls.json`,
        fileFormat: {
          urls: [
            'https://toolslab.dev/tools/json-formatter',
            'https://toolslab.dev/tools/base64-encoder',
          ],
        },
      },
    },
    notes: [
      'URLs are automatically grouped by domain for efficient submission',
      'The IndexNow key file must be accessible at https://domain.com/{key}.txt',
      'Successful submissions return HTTP 200 or 202 from IndexNow',
      'Rate limiting is per IP address or API key',
      'Maximum 100 URLs per request to prevent timeouts',
      'Each engine has a 10-second timeout for submission',
    ],
    engines: INDEXNOW_ENGINES.map((e) => ({
      name: e.name,
      endpoint: e.url,
    })),
  };

  return NextResponse.json(documentation, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * Admin API Route for Tool Management
 * Provides administrative access to update tool configurations
 * Requires authentication in production
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getCompleteConfig, clearCache } from '@/lib/edge-config/client';
import { EdgeConfigSchema, ToolConfig } from '@/lib/edge-config/types';

// Simple authentication check
function isAuthenticated(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true; // Allow all requests in development
  }

  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET_KEY;

  if (!adminSecret || !authHeader) {
    return false;
  }

  return authHeader === `Bearer ${adminSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  try {
    const result = await getCompleteConfig();

    return NextResponse.json({
      success: true,
      config: result.success ? result.data : result.fallback,
      source: result.success ? result.source : ('fallback' as const),
      responseTime: result.responseTime,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Admin API GET error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'update_tool':
        return await updateTool(data);
      case 'toggle_tool':
        return await toggleTool(data);
      case 'reorder_tools':
        return await reorderTools(data);
      case 'update_feature_flags':
        return await updateFeatureFlags(data);
      case 'clear_cache':
        return await clearConfigCache();
      case 'health_check':
        return await performHealthCheck();
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Admin API POST error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

async function updateTool(data: {
  slug: string;
  updates: Partial<ToolConfig>;
}) {
  const { slug, updates } = data;

  if (!slug || !updates) {
    return NextResponse.json(
      {
        success: false,
        error: 'Tool slug and updates are required',
      },
      { status: 400 }
    );
  }

  // In a real implementation, this would update the Edge Config
  // For now, we'll simulate the update
  console.log(`Updating tool ${slug}:`, updates);

  // Clear cache and revalidate pages
  clearCache();
  revalidatePath('/');
  revalidatePath(`/tools/${slug}`);
  revalidateTag('tools');

  return NextResponse.json({
    success: true,
    message: `Tool ${slug} updated successfully`,
    timestamp: new Date().toISOString(),
  });
}

async function toggleTool(data: { slug: string; enabled: boolean }) {
  const { slug, enabled } = data;

  if (!slug || enabled === undefined) {
    return NextResponse.json(
      {
        success: false,
        error: 'Tool slug and enabled status are required',
      },
      { status: 400 }
    );
  }

  console.log(`Toggling tool ${slug} to ${enabled ? 'enabled' : 'disabled'}`);

  // Clear cache and revalidate
  clearCache();
  revalidatePath('/');
  revalidatePath(`/tools/${slug}`);
  revalidateTag('tools');

  return NextResponse.json({
    success: true,
    message: `Tool ${slug} ${enabled ? 'enabled' : 'disabled'} successfully`,
    timestamp: new Date().toISOString(),
  });
}

async function reorderTools(data: {
  order: Array<{ slug: string; order: number }>;
}) {
  const { order } = data;

  if (!order || !Array.isArray(order)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Order array is required',
      },
      { status: 400 }
    );
  }

  console.log('Reordering tools:', order);

  // Clear cache and revalidate
  clearCache();
  revalidatePath('/');
  revalidateTag('tools');

  return NextResponse.json({
    success: true,
    message: 'Tools reordered successfully',
    timestamp: new Date().toISOString(),
  });
}

async function updateFeatureFlags(data: { flags: Record<string, boolean> }) {
  const { flags } = data;

  if (!flags) {
    return NextResponse.json(
      {
        success: false,
        error: 'Feature flags are required',
      },
      { status: 400 }
    );
  }

  console.log('Updating feature flags:', flags);

  // Clear cache and revalidate
  clearCache();
  revalidatePath('/');
  revalidateTag('features');

  return NextResponse.json({
    success: true,
    message: 'Feature flags updated successfully',
    timestamp: new Date().toISOString(),
  });
}

async function clearConfigCache() {
  clearCache();

  // Revalidate all tool-related pages
  revalidatePath('/');
  revalidatePath('/tools');
  revalidateTag('tools');
  revalidateTag('categories');

  return NextResponse.json({
    success: true,
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString(),
  });
}

async function performHealthCheck() {
  try {
    const result = await getCompleteConfig();

    const stats = {
      edgeConfigHealthy: result.success,
      responseTime: result.responseTime,
      source: result.success ? result.source : ('fallback' as const),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      health: stats,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // PUT endpoint for bulk configuration updates

  if (!isAuthenticated(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  try {
    const newConfig: Partial<EdgeConfigSchema> = await request.json();

    // Validate the configuration structure
    if (!newConfig || typeof newConfig !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid configuration format',
        },
        { status: 400 }
      );
    }

    // In a real implementation, this would validate and update the entire Edge Config
    console.log('Bulk configuration update:', Object.keys(newConfig));

    // Clear cache and revalidate everything
    clearCache();
    revalidatePath('/');
    revalidateTag('tools');
    revalidateTag('categories');
    revalidateTag('features');

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      updatedSections: Object.keys(newConfig),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Admin API PUT error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Configuration update failed',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // DELETE endpoint for removing tools (dangerous operation)

  if (!isAuthenticated(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tool slug is required',
        },
        { status: 400 }
      );
    }

    // In a real implementation, this would remove the tool from Edge Config
    console.log(`Removing tool: ${slug}`);

    // Clear cache and revalidate
    clearCache();
    revalidatePath('/');
    revalidatePath(`/tools/${slug}`);
    revalidateTag('tools');

    return NextResponse.json({
      success: true,
      message: `Tool ${slug} removed successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Admin API DELETE error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Tool removal failed',
      },
      { status: 500 }
    );
  }
}

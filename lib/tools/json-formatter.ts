export interface JsonResult {
  success: boolean;
  result?: string;
  error?: string;
}

export function formatJson(input: string): JsonResult {
  try {
    if (!input?.trim()) {
      return { success: false, error: 'Input is required' };
    }

    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);

    return { success: true, result: formatted };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON format',
    };
  }
}

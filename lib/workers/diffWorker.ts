import {
  computeDiff,
  generateUnifiedDiff,
  generateSideBySideHTML,
  detectFileType,
  DiffOptions,
  DiffResult,
} from '../tools/textDiff';

// Worker message types
export interface DiffWorkerMessage {
  type: 'compute' | 'generatePatch' | 'generateHTML' | 'detectType';
  id: string;
  payload: any;
}

export interface DiffWorkerResponse {
  type: 'result' | 'error' | 'progress';
  id: string;
  result?: any;
  error?: string;
  progress?: number;
}

// Handle incoming messages
self.onmessage = async (event: MessageEvent<DiffWorkerMessage>) => {
  const { type, id, payload } = event.data;

  try {
    let result: any;

    switch (type) {
      case 'compute': {
        const { text1, text2, options } = payload;

        // Send progress updates for large texts
        if (text1.length > 100000 || text2.length > 100000) {
          self.postMessage({
            type: 'progress',
            id,
            progress: 10,
          } as DiffWorkerResponse);
        }

        result = computeDiff(text1, text2, options as DiffOptions);

        if (text1.length > 100000 || text2.length > 100000) {
          self.postMessage({
            type: 'progress',
            id,
            progress: 90,
          } as DiffWorkerResponse);
        }

        break;
      }

      case 'generatePatch': {
        const { filename, text1, text2, options } = payload;
        result = generateUnifiedDiff(
          filename,
          text1,
          text2,
          options as DiffOptions
        );
        break;
      }

      case 'generateHTML': {
        const { changes } = payload;
        result = generateSideBySideHTML(changes);
        break;
      }

      case 'detectType': {
        const { content } = payload;
        result = detectFileType(content);
        break;
      }

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    // Send result back to main thread
    self.postMessage({
      type: 'result',
      id,
      result,
    } as DiffWorkerResponse);
  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    } as DiffWorkerResponse);
  }
};

// Export for TypeScript
export {};

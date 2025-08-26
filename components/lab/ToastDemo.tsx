'use client';

import { labToasts } from '@/lib/utils/toasts';

// Componente demo per testare le toast (rimuovere in produzione)
export function ToastDemo() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-lg border bg-white p-4 shadow-lg dark:bg-gray-800">
      <h3 className="mb-3 text-sm font-bold">🧪 Toast Demo</h3>
      <div className="space-y-2 text-xs">
        <button
          onClick={() => labToasts.addToLab('JSON Formatter')}
          className="block w-full rounded bg-green-500 px-2 py-1 text-left text-white hover:bg-green-600"
        >
          Add to Lab
        </button>
        <button
          onClick={() => labToasts.removeFromLab('JSON Formatter')}
          className="block w-full rounded bg-red-500 px-2 py-1 text-left text-white hover:bg-red-600"
        >
          Remove from Lab
        </button>
        <button
          onClick={() => labToasts.welcomeToLab()}
          className="block w-full rounded bg-purple-500 px-2 py-1 text-left text-white hover:bg-purple-600"
        >
          Welcome
        </button>
        <button
          onClick={() => labToasts.labLimitReached('tools', 50)}
          className="block w-full rounded bg-yellow-500 px-2 py-1 text-left text-white hover:bg-yellow-600"
        >
          Limit Reached
        </button>
        <button
          onClick={() => labToasts.error('Something went wrong!')}
          className="block w-full rounded bg-red-600 px-2 py-1 text-left text-white hover:bg-red-700"
        >
          Error
        </button>
        <button
          onClick={() =>
            labToasts.info(
              'Did you know?',
              'You can have up to 50 favorite tools'
            )
          }
          className="block w-full rounded bg-blue-500 px-2 py-1 text-left text-white hover:bg-blue-600"
        >
          Info
        </button>
      </div>
    </div>
  );
}

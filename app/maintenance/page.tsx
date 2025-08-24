import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance Mode | ToolsLab',
  description: "ToolsLab is currently under maintenance. We'll be back soon!",
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        {/* Animated Laboratory Icon */}
        <div className="relative mb-8">
          <div className="mx-auto flex h-32 w-32 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
            <span className="text-6xl">🔧</span>
          </div>
          <div className="absolute inset-0 mx-auto h-32 w-32 animate-ping rounded-full bg-gradient-to-br from-amber-500 to-orange-600 opacity-30"></div>
        </div>

        {/* Maintenance Message */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          Laboratory Under Maintenance
        </h1>

        <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
          ToolsLab is currently undergoing scheduled maintenance to calibrate
          our instruments and optimize performance.
        </p>

        {/* Status Box */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Laboratory Maintenance Protocol Active
            </span>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-gray-600 dark:text-gray-400">
                Backing up experimental data
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-gray-600 dark:text-gray-400">
                Calibrating instruments
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Installing new laboratory equipment...
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Estimated completion:</strong> Laboratory will resume
            operations shortly.
            <br />
            Please check back in a few minutes.
          </p>
        </div>

        {/* What to Expect */}
        <div className="mx-auto mb-8 max-w-md text-left">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Improvements Being Implemented:
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2 text-amber-500">•</span>
              <span>Enhanced algorithm optimization</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-amber-500">•</span>
              <span>New precision tools</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-amber-500">•</span>
              <span>Improved laboratory interface</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-amber-500">•</span>
              <span>Advanced quality control systems</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need urgent assistance?{' '}
            <a
              href="mailto:support@toolslab.dev"
              className="text-amber-600 hover:underline dark:text-amber-400"
            >
              Contact Laboratory Support
            </a>
          </p>
        </div>

        {/* Auto-refresh notice */}
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-500">
          This page will automatically refresh when maintenance is complete.
        </div>
      </div>

      {/* Auto-refresh script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Auto-refresh every 30 seconds to check if maintenance is complete
            setTimeout(function() {
              window.location.reload();
            }, 30000);
          `,
        }}
      />
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance Mode | OctoTools',
  description: "OctoTools is currently under maintenance. We'll be back soon!",
};

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        {/* Animated Octopus Icon */}
        <div className="relative mb-8">
          <div className="mx-auto flex h-32 w-32 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-6xl">🐙</span>
          </div>
          <div className="absolute inset-0 mx-auto h-32 w-32 animate-ping rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-30"></div>
        </div>

        {/* Maintenance Message */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
          We&apos;re Making Things Better!
        </h1>

        <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
          OctoTools is currently undergoing scheduled maintenance to bring you
          new features and improvements.
        </p>

        {/* Status Box */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Maintenance in Progress
            </span>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-gray-600 dark:text-gray-400">
                Backing up data
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span className="text-gray-600 dark:text-gray-400">
                Updating systems
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Deploying new features...
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Estimated completion:</strong> We expect to be back online
            shortly.
            <br />
            Please check back in a few minutes.
          </p>
        </div>

        {/* What to Expect */}
        <div className="mx-auto mb-8 max-w-md text-left">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            What&apos;s Coming:
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">•</span>
              <span>Faster processing speeds</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">•</span>
              <span>New developer tools</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">•</span>
              <span>Improved user interface</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-500">•</span>
              <span>Enhanced security features</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need urgent assistance?{' '}
            <a
              href="mailto:support@octotools.org"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Contact Support
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

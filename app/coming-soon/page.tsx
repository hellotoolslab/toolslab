import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon | ToolsLab - Your Developer Tools Laboratory',
  description:
    'ToolsLab is launching soon! Professional developer tools crafted with scientific precision. No signup, no limits, just tools that work.',
};

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-emerald-950 dark:to-cyan-950">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        {/* Animated Laboratory Flask */}
        <div className="relative mb-12">
          <div className="mx-auto flex h-40 w-40 items-center justify-center">
            {/* Main flask */}
            <div className="absolute animate-pulse">
              <span className="text-8xl">⚗️</span>
            </div>
            {/* Floating molecules/atoms */}
            <div className="absolute -top-4 left-8 animate-bounce">
              <span className="text-2xl opacity-60">⚛️</span>
            </div>
            <div
              className="absolute -top-8 right-10 animate-bounce"
              style={{ animationDelay: '0.5s' }}
            >
              <span className="text-xl opacity-40">🧬</span>
            </div>
            <div
              className="absolute right-4 top-0 animate-bounce"
              style={{ animationDelay: '1s' }}
            >
              <span className="text-3xl opacity-50">🔬</span>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="mb-6 text-5xl font-bold md:text-7xl">
          <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Experiments in Progress
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">
            Launch Imminent!
          </span>
        </h1>

        <p className="mb-12 text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
          Our laboratory is synthesizing the most
          <br className="hidden md:block" />
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {' '}
            precisely-engineered{' '}
          </span>
          developer tools for your experiments!
        </p>

        {/* Countdown-ish Box */}
        <div className="mb-12 inline-block rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80">
          <div className="mb-6 text-lg font-medium text-gray-700 dark:text-gray-300">
            Laboratory Analysis Time Remaining:
          </div>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-3xl font-bold text-white shadow-lg">
                ?
              </div>
              <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Days
              </span>
            </div>
            <span className="text-3xl text-gray-400">:</span>
            <div className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl font-bold text-white shadow-lg">
                ?
              </div>
              <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Hours
              </span>
            </div>
            <span className="text-3xl text-gray-400">:</span>
            <div className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white shadow-lg">
                ?
              </div>
              <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Minutes
              </span>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            (Experiments are volatile... results coming soon! 🧪)
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-12">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Laboratory Features Under Development:
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="transform rounded-xl bg-white/60 p-6 backdrop-blur-sm transition-transform hover:scale-105 dark:bg-gray-800/60">
              <div className="mb-3 text-4xl">⚡</div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Laboratory-Grade Speed
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optimized algorithms for instant results
              </p>
            </div>
            <div className="transform rounded-xl bg-white/60 p-6 backdrop-blur-sm transition-transform hover:scale-105 dark:bg-gray-800/60">
              <div className="mb-3 text-4xl">🧪</div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Pure & Simple
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No contaminants, just clean tools
              </p>
            </div>
            <div className="transform rounded-xl bg-white/60 p-6 backdrop-blur-sm transition-transform hover:scale-105 dark:bg-gray-800/60">
              <div className="mb-3 text-4xl">🔬</div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Scientifically Tested
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each tool rigorously tested for accuracy
              </p>
            </div>
          </div>
        </div>

        {/* Fun Messages */}
        <div className="mb-12 space-y-3">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              while(experimenting) {'{'}
            </span>
          </p>
          <p className="ml-8 text-gray-600 dark:text-gray-400">
            <span className="font-mono">
              console.log(&quot;Calibrating instruments...&quot;);
            </span>
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {'}'}
            </span>
          </p>
        </div>

        {/* Teaser List */}
        <div className="mb-12 inline-block rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-left dark:border-emerald-700 dark:bg-emerald-950/20">
          <h3 className="mb-4 text-center text-lg font-semibold text-emerald-900 dark:text-emerald-300">
            🧬 Laboratory Tools in Final Testing Phase:
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center">
              <span className="mr-3 text-emerald-500">⚛️</span>
              JSON Formatter (precision-engineered parser)
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-emerald-500">⚛️</span>
              Base64 Encoder/Decoder (molecular-level accuracy)
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-emerald-500">⚛️</span>
              JWT Decoder (cryptographic analysis tool)
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-emerald-500">⚛️</span>
              And 50+ more laboratory instruments...
            </li>
          </ul>
        </div>

        {/* Bottom Message */}
        <div className="space-y-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Get ready to say goodbye to:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 line-through dark:bg-red-950/30 dark:text-red-400">
              Annoying ads
            </span>
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 line-through dark:bg-red-950/30 dark:text-red-400">
              Buy me a coffee popups
            </span>
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 line-through dark:bg-red-950/30 dark:text-red-400">
              Sign up to continue
            </span>
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 line-through dark:bg-red-950/30 dark:text-red-400">
              Premium only features
            </span>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="mt-16 text-sm text-gray-500 dark:text-gray-500">
          <p className="mb-2">
            🧪 Laboratory experiments in progress. Safety goggles recommended.
          </p>
          <p className="text-xs">
            P.S. All experiments conducted under strict quality control
            standards.
          </p>
        </div>

        {/* Auto-refresh script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Auto-refresh every 60 seconds to check if site is live
              setTimeout(function() {
                window.location.reload();
              }, 60000);
            `,
          }}
        />
      </div>
    </div>
  );
}

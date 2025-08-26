import { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Lightbulb, Zap, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Need Tools? - Suggest New Developer Tools | ToolsLab',
  description:
    "Have an idea for a new developer tool? Suggest it on X (Twitter) and we'll consider adding it to ToolsLab. Help us build the tools you need.",
};

export default function NeedToolsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
          <Lightbulb className="h-10 w-10" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
          Need Tools?
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          We&apos;re always looking for new tools to add to ToolsLab. Have an
          idea? Let us know!
        </p>
      </div>

      {/* Main CTA Section */}
      <div className="mb-16 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 dark:border-gray-800 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="mb-6 flex justify-center">
          <svg
            className="h-12 w-12 text-black dark:text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Suggest Tools on X
        </h2>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          Tweet us your tool suggestions and we&apos;ll review them for
          implementation. We&apos;re building the tools developers actually
          need!
        </p>
        <div className="flex justify-center">
          <Link
            href="https://x.com/tools_lab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @tools_lab
          </Link>
        </div>
      </div>

      {/* What We're Looking For */}
      <div className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          What We&apos;re Looking For
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/30">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Developer Utilities
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tools that solve real problems developers face daily. Formatters,
              converters, generators, validators - anything that makes coding
              easier.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Quick & Simple
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tools that work instantly in the browser. No sign-ups, no
              installations, no complications. Just paste, click, and get
              results.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          How It Works
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-bold text-white">
              1
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                Tweet Your Idea
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send us a tweet at{' '}
                <Link
                  href="https://x.com/tools_lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-500 hover:underline"
                >
                  @tools_lab
                </Link>{' '}
                with your tool suggestion. Describe what it should do and why
                it&apos;s useful.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-bold text-white">
              2
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                We Review
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team reviews all suggestions. We prioritize tools based on
                community demand and development complexity.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-bold text-white">
              3
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                We Build
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                If selected, we&apos;ll build your tool and add it to ToolsLab.
                We&apos;ll tweet you when it&apos;s live!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
        <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-600 dark:text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Got Questions?
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Feel free to reach out on X. We&apos;re here to build the tools you
          need!
        </p>
        <Link
          href="https://x.com/tools_lab"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-blue-500 hover:underline"
        >
          Contact us on X
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

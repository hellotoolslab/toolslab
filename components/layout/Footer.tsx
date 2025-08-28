'use client';

import Link from 'next/link';
import { Coffee, Heart, Github } from 'lucide-react';
import { useUmami } from '@/components/analytics/UmamiProvider';

export function Footer() {
  const { trackConversion, trackSocial, trackEngagement } = useUmami();
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Buy Me a Coffee - Smaller Section */}
        <div className="mb-8">
          <div className="rounded-lg border border-yellow-400/20 bg-gradient-to-r from-yellow-400/5 via-orange-400/5 to-yellow-400/5 p-4 text-center">
            <div className="mx-auto max-w-xl">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Coffee className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-lg font-semibold">Support ToolsLab</h2>
                <Coffee className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                If you find ToolsLab helpful, consider supporting our research.
                Your support keeps the laboratory running!
              </p>
              <div className="flex flex-col items-center gap-2">
                <a
                  href="https://buymeacoffee.com/toolslab"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackConversion('donation', 'footer-widget')}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Coffee className="h-4 w-4" />
                  Buy Me a Coffee
                </a>
                <Link
                  href="/about"
                  onClick={() =>
                    trackEngagement('why-donate-clicked', { from: 'footer' })
                  }
                  className="text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  Why donate?
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Every contribution fuels our research! ⚗️ Thank you! 🧪
              </p>
            </div>
          </div>
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-3 font-semibold">About ToolsLab</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              No BS developer tools built by developers, for developers. Fast,
              private, and completely free.
            </p>
            <div className="mb-4">
              <Link
                href="/about"
                className="text-sm font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Learn about our mission →
              </Link>
            </div>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://x.com/tools_lab"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial('twitter', 'footer-about')}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="X (formerly Twitter)"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/hellotoolslab/toolslab"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial('github', 'footer-about')}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/category/data"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Data Conversion
                </Link>
              </li>
              <li>
                <Link
                  href="/category/encoding"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Encoding & Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/text-format"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Text & Format
                </Link>
              </li>
              <li>
                <Link
                  href="/category/generators"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Generators
                </Link>
              </li>
              <li>
                <Link
                  href="/category/web-design"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Web & Design
                </Link>
              </li>
              <li>
                <Link
                  href="/category/dev-utilities"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dev Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="mb-3 font-semibold">Popular Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tools/json-formatter"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/regex-tester"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Regex Tester
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/uuid-generator"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  UUID Generator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 ToolsLab. Crafted with ⚗️ in our digital laboratory.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms of Service
              </Link>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                <span>for developers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

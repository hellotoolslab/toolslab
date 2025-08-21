import Link from 'next/link';
import { Coffee, Twitter, Heart, GitBranch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Buy Me a Coffee - Full Width Section */}
        <div className="mb-12">
          <div className="rounded-xl border-2 border-yellow-400/30 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 p-8 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 flex items-center justify-center gap-3">
                <Coffee className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-2xl font-bold">Support OctoTools</h2>
                <Coffee className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="mb-6 text-lg text-muted-foreground">
                If you find OctoTools helpful, consider buying us a coffee! Your
                support helps us keep the tools free for everyone.
              </p>
              <a
                href="https://buymeacoffee.com/octotools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:from-yellow-600 hover:to-orange-600"
              >
                <Coffee className="h-6 w-6" />
                Buy Me a Coffee
              </a>
              <p className="mt-4 text-sm text-muted-foreground">
                Every coffee counts! ☕ Thank you for your support! 🙏
              </p>
            </div>
          </div>
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-3 font-semibold">About OctoTools</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              A comprehensive collection of developer tools designed to make
              your workflow faster and more efficient.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://x.com/octotoolsonx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://bitbucket.org/octotools/octotools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Bitbucket"
              >
                <GitBranch className="h-5 w-5" />
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
                  href="/category/data-conversion"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Data Conversion
                </Link>
              </li>
              <li>
                <Link
                  href="/category/encoding-security"
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
                  href="/tools/base64-encoder"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Base64 Encoder
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
              <li>
                <Link
                  href="/tools/jwt-decoder"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  JWT Decoder
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 OctoTools. All rights reserved.
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

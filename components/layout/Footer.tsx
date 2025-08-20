import Link from 'next/link';
import { Coffee, Github, Twitter, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        {/* Buy Me a Coffee - Full Width Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 border-2 border-yellow-400/30 rounded-xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Coffee className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-2xl font-bold">Support OctoTools</h2>
                <Coffee className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                If you find OctoTools helpful, consider buying us a coffee! Your support helps us keep the tools free and ad-free for everyone.
              </p>
              <a
                href="https://buymeacoffee.com/octotools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all hover:scale-105 shadow-xl"
              >
                <Coffee className="h-6 w-6" />
                Buy Me a Coffee
              </a>
              <p className="text-sm text-muted-foreground mt-4">
                Every coffee counts! ☕ Thank you for your support! 🙏
              </p>
            </div>
          </div>
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold mb-3">About OctoTools</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A comprehensive collection of developer tools designed to make your workflow faster and more efficient.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://github.com/octotools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/octotools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/category/data-conversion" className="text-muted-foreground hover:text-foreground transition-colors">
                  Data Conversion
                </Link>
              </li>
              <li>
                <Link href="/category/encoding-security" className="text-muted-foreground hover:text-foreground transition-colors">
                  Encoding & Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/text-format" className="text-muted-foreground hover:text-foreground transition-colors">
                  Text & Format
                </Link>
              </li>
              <li>
                <Link href="/category/generators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Generators
                </Link>
              </li>
              <li>
                <Link href="/category/web-design" className="text-muted-foreground hover:text-foreground transition-colors">
                  Web & Design
                </Link>
              </li>
              <li>
                <Link href="/category/dev-utilities" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dev Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="font-semibold mb-3">Popular Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/json-formatter" className="text-muted-foreground hover:text-foreground transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link href="/tools/base64-encoder" className="text-muted-foreground hover:text-foreground transition-colors">
                  Base64 Encoder
                </Link>
              </li>
              <li>
                <Link href="/tools/uuid-generator" className="text-muted-foreground hover:text-foreground transition-colors">
                  UUID Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/jwt-decoder" className="text-muted-foreground hover:text-foreground transition-colors">
                  JWT Decoder
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 OctoTools. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                <span>for developers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
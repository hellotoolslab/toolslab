'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { useUmami } from '@/components/analytics/OptimizedUmamiProvider';

export function Footer() {
  const { trackConversion, trackSocial, trackEngagement } = useUmami();

  return (
    <footer className="border-slate-200/8 border-t bg-gradient-to-b from-slate-900/40 to-slate-900/60 backdrop-blur-[10px] supports-[backdrop-filter]:bg-slate-900/60">
      <div className="footer-container mx-auto max-w-[1200px] px-6 py-16 sm:px-8 sm:py-14 lg:px-6 lg:py-16">
        {/* Main Footer Content - 4 Column Grid */}
        <div className="footer-content mb-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: About */}
          <div className="footer-column">
            <h3 className="relative mb-5 text-xs font-bold uppercase tracking-[0.08em] text-slate-200 after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-gradient-to-r after:from-purple-500 after:to-transparent">
              About ToolsLab
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-slate-400">
              No BS developer tools built by developers, for developers. Fast,
              private, and completely free.
            </p>
            <Link
              href="/about"
              onClick={() =>
                trackEngagement('about-mission-clicked', { from: 'footer' })
              }
              className="mission-link inline-flex items-center gap-1 text-sm font-medium text-purple-300 transition-all duration-200 hover:gap-2 hover:text-purple-200"
            >
              Learn about our mission
              <span className="arrow transition-transform duration-200 hover:translate-x-1">
                →
              </span>
            </Link>

            {/* Social Links */}
            <div className="social-links mt-4 flex gap-3">
              <a
                href="https://x.com/tools_lab"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial('x', 'footer-about')}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-4.5 h-4.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/hellotoolslab/toolslab"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocial('github', 'footer-about')}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h3 className="relative mb-5 text-xs font-bold uppercase tracking-[0.08em] text-slate-200 after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-gradient-to-r after:from-purple-500 after:to-transparent">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/lab"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Your Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-column">
            <h3 className="relative mb-5 text-xs font-bold uppercase tracking-[0.08em] text-slate-200 after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-gradient-to-r after:from-purple-500 after:to-transparent">
              Categories
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/category/data"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Data & Conversion
                </Link>
              </li>
              <li>
                <Link
                  href="/category/encoding"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Encoding & Security
                </Link>
              </li>
              <li>
                <Link
                  href="/category/text"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Text & Format
                </Link>
              </li>
              <li>
                <Link
                  href="/category/generators"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Generators
                </Link>
              </li>
              <li>
                <Link
                  href="/category/dev"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Dev Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Tools */}
          <div className="footer-column">
            <h3 className="relative mb-5 text-xs font-bold uppercase tracking-[0.08em] text-slate-200 after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-gradient-to-r after:from-purple-500 after:to-transparent">
              Popular Tools
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/tools/json-formatter"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/regex-tester"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Regex Tester
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/uuid-generator"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  UUID Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/base64-encode"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Base64 Encoder
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/hash-generator"
                  className="block py-1.5 text-sm leading-relaxed text-slate-400 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Hash Generator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-400/8 my-0 border-t border-none" />

        {/* Bottom Section */}
        <div className="footer-bottom flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="footer-copyright">
            <p className="m-0 text-sm tracking-[0.01em] text-slate-500">
              © 2025 ToolsLab. Crafted with{' '}
              <span className="heart-icon inline-block animate-pulse text-purple-400">
                💜
              </span>{' '}
              in our digital laboratory
            </p>
          </div>

          <div className="footer-links flex flex-wrap items-center gap-5 text-sm">
            <Link
              href="/privacy"
              className="text-slate-500 transition-colors duration-200 hover:text-white"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 transition-colors duration-200 hover:text-white"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>
            <span className="footer-separator hidden text-slate-600 sm:block">
              •
            </span>
            <a
              href="https://buymeacoffee.com/toolslab"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion('donation', 'footer-support-link')}
              className="support-link bg-purple-500/8 group relative inline-flex items-center gap-1.5 rounded-lg border border-purple-500/15 px-4 py-2 text-sm font-medium text-purple-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-purple-500/15 hover:text-purple-200 hover:shadow-lg hover:shadow-purple-500/10"
              style={
                {
                  /* Tooltip styling with CSS-in-JS style object for complex pseudo-elements */
                }
              }
            >
              <span className="coffee-icon text-base transition-transform duration-200 group-hover:rotate-[-10deg] group-hover:scale-110">
                ☕
              </span>
              <span>Support us</span>
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md border border-purple-500/30 bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100">
                Buy us a coffee
                <span className="absolute left-1/2 top-full -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .footer-container {
            padding: 56px 32px 28px;
          }
          .footer-content {
            gap: 40px;
            margin-bottom: 48px;
          }
        }

        @media (max-width: 640px) {
          .footer-container {
            padding: 48px 20px 24px;
          }
          .footer-content {
            gap: 32px;
            margin-bottom: 40px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 24px;
          }
          .footer-links {
            flex-direction: column;
            gap: 12px;
          }
          .footer-separator {
            display: none !important;
          }
          .support-link {
            width: 100%;
            justify-content: center;
            padding: 12px 24px;
          }
        }

        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          10% {
            transform: scale(1.1);
          }
          20% {
            transform: scale(1);
          }
        }

        .heart-icon {
          animation: heartbeat 2s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}

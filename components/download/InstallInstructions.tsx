'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Terminal,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function InstallInstructions() {
  const [openPlatform, setOpenPlatform] = useState<string | null>(null);

  const togglePlatform = (platform: string) => {
    setOpenPlatform(openPlatform === platform ? null : platform);
  };

  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      icon: '🪟',
      instructions: [
        'Download the .exe installer file',
        'Run the installer as Administrator if required',
        'Follow the installation wizard',
        'Launch ToolsLab from Start Menu or Desktop shortcut',
        'The app will automatically check for updates',
      ],
      notes: [
        'Windows Defender may show a warning for unsigned apps - click "More info" then "Run anyway"',
        'MSI package available for enterprise deployments',
        'Requires Windows 10 or later',
      ],
    },
    {
      id: 'macos',
      name: 'macOS',
      icon: '🍎',
      instructions: [
        'Download the appropriate .dmg file (Intel or Apple Silicon)',
        'Open the .dmg file',
        'Drag ToolsLab to your Applications folder',
        'Launch ToolsLab from Applications or Spotlight',
        'Allow the app in System Preferences > Security if prompted',
      ],
      notes: [
        'macOS may show "unidentified developer" warning - Control+click the app and select "Open"',
        'Choose the correct version: Apple Silicon (M1/M2) or Intel',
        'Requires macOS 10.15 (Catalina) or later',
      ],
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: '🐧',
      instructions: [
        'Download the AppImage or .deb file',
        'For AppImage: Make executable with chmod +x ToolsLab*.AppImage',
        'For Debian/Ubuntu: Install with sudo dpkg -i ToolsLab*.deb',
        'Run from terminal or applications menu',
        'AppImage requires FUSE to run',
      ],
      notes: [
        'AppImage works on most Linux distributions without installation',
        '.deb packages work on Debian, Ubuntu, and derivatives',
        'May require installing webkit2gtk and additional dependencies',
      ],
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Installation Instructions
      </h2>

      <div className="space-y-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => togglePlatform(platform.id)}
              className="dark:hover:bg-gray-750 flex w-full items-center justify-between rounded-xl p-4 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platform.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {platform.name}
                </h3>
              </div>
              {openPlatform === platform.id ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                openPlatform === platform.id ? 'max-h-96' : 'max-h-0'
              )}
            >
              <div className="p-4 pt-0">
                <div className="mb-4">
                  <h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                    <Terminal className="h-4 w-4" />
                    Installation Steps
                  </h4>
                  <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {platform.instructions.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-medium text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {platform.notes.length > 0 && (
                  <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <h4 className="mb-2 flex items-center gap-2 font-medium text-yellow-900 dark:text-yellow-100">
                      <AlertTriangle className="h-4 w-4" />
                      Important Notes
                    </h4>
                    <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                      {platform.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="mt-1 text-yellow-600 dark:text-yellow-400">
                            •
                          </span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <h4 className="font-medium text-blue-900 dark:text-blue-100">
          Need Help?
        </h4>
        <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
          If you encounter any issues during installation, check our{' '}
          <a
            href="https://github.com/gianlucaricaldone/toolslab/issues"
            className="underline hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>{' '}
          page or create a new issue for support.
        </p>
      </div>
    </div>
  );
}

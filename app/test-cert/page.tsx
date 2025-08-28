'use client';

import { useEffect, useState } from 'react';

interface CertInfo {
  hostname: string;
  protocol: string;
  isSecure: boolean;
  headers: Record<string, string>;
  timestamp: string;
}

export default function TestCert() {
  const [certInfo, setCertInfo] = useState<CertInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/cert-info');
        if (!response.ok) {
          throw new Error('Failed to fetch certificate info');
        }
        const data = await response.json();
        setCertInfo(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-4 w-2/3 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Certificate & Connection Test</h1>

      {certInfo && (
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Connection Details</h2>

          <dl className="space-y-4">
            <div className="border-b pb-2">
              <dt className="font-bold text-gray-700 dark:text-gray-300">
                Hostname:
              </dt>
              <dd
                className={`text-lg ${
                  certInfo.hostname === 'toolslab.dev'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {certInfo.hostname}
                {certInfo.hostname === 'toolslab.dev' && ' ✅'}
                {certInfo.hostname !== 'toolslab.dev' && ' ⚠️'}
              </dd>
            </div>

            <div className="border-b pb-2">
              <dt className="font-bold text-gray-700 dark:text-gray-300">
                Protocol:
              </dt>
              <dd className="text-lg">{certInfo.protocol}</dd>
            </div>

            <div className="border-b pb-2">
              <dt className="font-bold text-gray-700 dark:text-gray-300">
                Secure Connection:
              </dt>
              <dd className="text-lg">
                {certInfo.isSecure ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✅ Yes (HTTPS)
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ❌ No (HTTP)
                  </span>
                )}
              </dd>
            </div>

            <div className="border-b pb-2">
              <dt className="font-bold text-gray-700 dark:text-gray-300">
                Test Time:
              </dt>
              <dd className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(certInfo.timestamp).toLocaleString()}
              </dd>
            </div>
          </dl>

          {/* Warning for wrong certificate */}
          {certInfo.hostname !== 'toolslab.dev' && (
            <div className="mt-6 rounded-lg border-2 border-yellow-400 bg-yellow-100 p-4 dark:border-yellow-600 dark:bg-yellow-900/30">
              <p className="mb-2 text-lg font-bold text-yellow-800 dark:text-yellow-200">
                ⚠️ Wrong Certificate Detected!
              </p>
              <p className="mb-3 text-yellow-700 dark:text-yellow-300">
                Your connection is using the certificate for{' '}
                <strong>{certInfo.hostname}</strong> instead of{' '}
                <strong>toolslab.dev</strong>.
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                This typically happens with:
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-yellow-600 dark:text-yellow-400">
                <li>
                  Corporate VPNs that don&apos;t properly handle SNI (Server
                  Name Indication)
                </li>
                <li>Enterprise proxy servers</li>
                <li>Network security appliances</li>
              </ul>

              <div className="mt-4 rounded bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="mb-1 font-semibold text-blue-800 dark:text-blue-300">
                  💡 Solution:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Please contact your IT department and ask them to:
                </p>
                <ol className="mt-2 list-inside list-decimal text-sm text-blue-700 dark:text-blue-400">
                  <li>
                    Whitelist{' '}
                    <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">
                      toolslab.dev
                    </code>
                  </li>
                  <li>Ensure proper SNI forwarding for this domain</li>
                  <li>Or bypass SSL inspection for this domain</li>
                </ol>
              </div>
            </div>
          )}

          {/* Success message */}
          {certInfo.hostname === 'toolslab.dev' && certInfo.isSecure && (
            <div className="mt-6 rounded-lg border-2 border-green-400 bg-green-100 p-4 dark:border-green-600 dark:bg-green-900/30">
              <p className="text-lg font-bold text-green-800 dark:text-green-200">
                ✅ Certificate Valid!
              </p>
              <p className="mt-2 text-green-700 dark:text-green-300">
                Your connection is properly secured with the correct certificate
                for toolslab.dev.
              </p>
            </div>
          )}

          {/* Technical Details */}
          <details className="mt-6">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              📋 Technical Headers (click to expand)
            </summary>
            <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(certInfo.headers, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}

      {/* Additional Information */}
      <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
          ℹ️ About This Test
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          This page verifies that your browser is connecting to the correct
          server with the proper SSL certificate. Corporate VPNs and proxy
          servers sometimes interfere with SSL connections, causing certificate
          mismatches.
        </p>
      </div>
    </div>
  );
}

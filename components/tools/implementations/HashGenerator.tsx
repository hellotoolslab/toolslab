'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Shield, Hash } from 'lucide-react';
import { useMultiCopy } from '@/lib/hooks/useCopy';
import { useToolProcessor } from '@/lib/hooks/useToolProcessor';
import { BaseToolProps, HashAlgorithm } from '@/lib/types/tools';

interface HashGeneratorProps extends BaseToolProps {}

export default function HashGenerator({ categoryColor }: HashGeneratorProps) {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [salt, setSalt] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareHash, setCompareHash] = useState('');
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  // Use unified hooks
  const { copy, isCopied } = useMultiCopy<string>();
  const { isProcessing, error, processSync } = useToolProcessor<
    string,
    Record<string, string>
  >();

  const algorithms: HashAlgorithm[] = [
    'SHA-1',
    'SHA-256',
    'SHA-384',
    'SHA-512',
    'MD5',
    'CRC32',
  ];

  useEffect(() => {
    if (input) {
      generateHashes();
    } else {
      setHashes({});
    }
  }, [input, salt]);

  const md5 = (input: string): string => {
    const rotateLeft = (n: number, s: number): number => {
      return (n << s) | (n >>> (32 - s));
    };

    const addUnsigned = (x: number, y: number): number => {
      return (
        ((x & 0x7fffffff) + (y & 0x7fffffff)) ^
        (x & 0x80000000) ^
        (y & 0x80000000)
      );
    };

    const F = (x: number, y: number, z: number): number => {
      return (x & y) | (~x & z);
    };

    const G = (x: number, y: number, z: number): number => {
      return (x & z) | (y & ~z);
    };

    const H = (x: number, y: number, z: number): number => {
      return x ^ y ^ z;
    };

    const I = (x: number, y: number, z: number): number => {
      return y ^ (x | ~z);
    };

    const FF = (
      a: number,
      b: number,
      c: number,
      d: number,
      x: number,
      s: number,
      ac: number
    ): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const GG = (
      a: number,
      b: number,
      c: number,
      d: number,
      x: number,
      s: number,
      ac: number
    ): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const HH = (
      a: number,
      b: number,
      c: number,
      d: number,
      x: number,
      s: number,
      ac: number
    ): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const II = (
      a: number,
      b: number,
      c: number,
      d: number,
      x: number,
      s: number,
      ac: number
    ): number => {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };

    const convertToWordArray = (str: string): number[] => {
      let lWordCount: number;
      const lMessageLength = str.length;
      const lNumberOfWords_temp1 = lMessageLength + 8;
      const lNumberOfWords_temp2 =
        (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      const lWordArray = new Array(lNumberOfWords - 1);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] |
          (str.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };

    const wordToHex = (lValue: number): string => {
      let WordToHexValue = '';
      let WordToHexValue_temp = '';
      let lByte: number, lCount: number;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = '0' + lByte.toString(16);
        WordToHexValue =
          WordToHexValue +
          WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    };

    const x = convertToWordArray(input);
    let a = 0x67452301,
      b = 0xefcdab89,
      c = 0x98badcfe,
      d = 0x10325476;

    for (let k = 0; k < x.length; k += 16) {
      const AA = a,
        BB = b,
        CC = c,
        DD = d;
      a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
      d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
      c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
      b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
      a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
      d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
      c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
      b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
      a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
      d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
      c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
      b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
      a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
      d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
      c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
      b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);
      a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
      d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
      c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
      b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
      a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
      d = GG(d, a, b, c, x[k + 10], 9, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
      b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
      a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
      d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
      c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
      b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
      a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
      d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
      c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
      b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
      a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
      d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
      c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
      b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
      a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
      d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
      c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
      b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
      a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
      d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
      c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
      b = HH(b, c, d, a, x[k + 6], 23, 0x4881d05);
      a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
      d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
      c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
      b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);
      a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
      d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
      c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
      b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
      a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
      d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
      c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
      b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
      a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
      d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
      c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
      b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
      a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
      d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
      c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
      b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }

    return (
      wordToHex(a) +
      wordToHex(b) +
      wordToHex(c) +
      wordToHex(d)
    ).toLowerCase();
  };

  const crc32 = (input: string): string => {
    const crcTable: number[] = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTable[i] = c;
    }

    let crc = 0 ^ -1;
    for (let i = 0; i < input.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ input.charCodeAt(i)) & 0xff];
    }

    return ((crc ^ -1) >>> 0).toString(16).padStart(8, '0');
  };

  const generateHashes = async () => {
    if (!input) {
      setHashes({});
      return;
    }

    try {
      const result = await processSync(input, (inputText) => {
        const newHashes: Record<string, string> = {};
        const textToHash = salt ? `${salt}${inputText}` : inputText;

        // Generate hash for selected algorithm
        const encoder = new TextEncoder();
        const data = encoder.encode(textToHash);

        if (algorithm === 'MD5') {
          newHashes[algorithm] = md5(textToHash);
        } else if (algorithm === 'CRC32') {
          newHashes[algorithm] = crc32(textToHash);
        } else {
          // For crypto.subtle, we need to handle async in a different way
          // This is a sync wrapper - in real implementation, you might want to use processAsync
          throw new Error('Async crypto operations need different handling');
        }

        // Generate other common hashes synchronously
        for (const algo of algorithms) {
          if (algo !== algorithm) {
            if (algo === 'MD5') {
              newHashes[algo] = md5(textToHash);
            } else if (algo === 'CRC32') {
              newHashes[algo] = crc32(textToHash);
            }
            // Skip crypto.subtle algorithms for sync processing
          }
        }

        return newHashes;
      });

      // For crypto.subtle algorithms, we still need async processing
      if (['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].includes(algorithm)) {
        const textToHash = salt ? `${salt}${input}` : input;
        const encoder = new TextEncoder();
        const data = encoder.encode(textToHash);

        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        result[algorithm] = hashHex;

        // Generate other SHA algorithms
        for (const algo of algorithms) {
          if (
            algo !== algorithm &&
            ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].includes(algo)
          ) {
            const algoBuffer = await crypto.subtle.digest(algo, data);
            const algoArray = Array.from(new Uint8Array(algoBuffer));
            const algoHex = algoArray
              .map((b) => b.toString(16).padStart(2, '0'))
              .join('');
            result[algo] = algoHex;
          }
        }
      }

      setHashes(result);
    } catch (err) {
      // Error is handled by useToolProcessor
    }
  };

  const handleCopy = async (hash: string, algo: string) => {
    await copy(hash, algo);
  };

  const handleCompare = () => {
    if (compareHash && hashes[algorithm]) {
      setIsMatch(compareHash.toLowerCase() === hashes[algorithm].toLowerCase());
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Tool Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5" style={{ color: categoryColor }} />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Hash Generator
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`rounded-lg px-3 py-1 text-sm transition-colors ${
              compareMode
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Compare Mode
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Text to Hash
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to generate hash..."
              className="h-32 w-full resize-none rounded-lg border-2 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none dark:bg-gray-900 dark:text-white"
              style={{
                borderColor: `${categoryColor}30`,
              }}
              onFocus={(e) => (e.target.style.borderColor = categoryColor)}
              onBlur={(e) =>
                (e.target.style.borderColor = `${categoryColor}30`)
              }
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{input.length} characters</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                {algorithms.map((algo) => (
                  <option key={algo} value={algo}>
                    {algo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Salt (Optional)
              </label>
              <input
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                placeholder="Add salt to hash"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Compare Mode */}
        {compareMode && input && hashes[algorithm] && (
          <div className="space-y-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compare with Hash
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={compareHash}
                onChange={(e) => setCompareHash(e.target.value)}
                placeholder="Paste hash to compare..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={handleCompare}
                className="rounded-lg px-4 py-2 font-medium text-white transition-all hover:scale-105"
                style={{ backgroundColor: categoryColor }}
              >
                Compare
              </button>
            </div>
            {isMatch !== null && (
              <div
                className={`text-sm font-medium ${isMatch ? 'text-green-600' : 'text-red-600'}`}
              >
                {isMatch ? '✓ Hashes match!' : '✗ Hashes do not match'}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Hash Results */}
        {Object.keys(hashes).length > 0 && (
          <div className="animate-slideIn space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Hashes
            </label>

            {/* Primary Hash */}
            {hashes[algorithm] && (
              <div
                className="rounded-lg border-2 bg-gradient-to-r from-transparent to-transparent p-4 transition-all hover:from-gray-50 hover:to-gray-50 dark:hover:from-gray-900 dark:hover:to-gray-900"
                style={{ borderColor: categoryColor }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {algorithm}
                  </span>
                  <button
                    onClick={() => handleCopy(hashes[algorithm], algorithm)}
                    className="rounded p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {isCopied(algorithm) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <code className="block break-all font-mono text-xs text-gray-700 dark:text-gray-300">
                  {hashes[algorithm]}
                </code>
              </div>
            )}

            {/* Other Hashes */}
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  <Hash className="h-4 w-4" />
                  <span>Show other algorithms</span>
                </div>
              </summary>
              <div className="mt-3 space-y-2">
                {Object.entries(hashes).map(([algo, hash]) => {
                  if (algo === algorithm) return null;
                  return (
                    <div
                      key={algo}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {algo}
                        </span>
                        <button
                          onClick={() => handleCopy(hash, algo)}
                          className="rounded p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {isCopied(algo) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <code className="block break-all font-mono text-xs text-gray-600 dark:text-gray-400">
                        {hash}
                      </code>
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        )}

        {/* Info */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Cryptographic hash functions produce a fixed-size output from any
            input. The same input always produces the same hash, but it&rsquo;s
            computationally infeasible to reverse.
          </p>
        </div>
      </div>
    </div>
  );
}

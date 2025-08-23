export const TEST_JSON = {
  valid: {
    simple: '{"name":"OctoTools","version":"1.0.0"}',
    nested:
      '{"project":"OctoTools","tools":[{"id":1,"name":"JSON Formatter"}]}',
    complex:
      '{"octotools":{"metadata":{"name":"OctoTools.org"},"tools":[{"name":"JSON Formatter","searches":165000}]}}',
  },
  invalid: {
    syntaxError: '{"name":"OctoTools",}',
    incomplete: '{"name":"OctoTools"',
    malformed: '{"name":OctoTools}',
  },
  edge: {
    empty: '{}',
    largeFile: JSON.stringify(new Array(10000).fill({ data: 'test' })),
    unicode: '{"emoji":"🐙","chinese":"中文","arabic":"العربية"}',
    specialChars: '{"path":"C:\\\\Users\\\\test","quote":"\\"hello\\""}',
  },
};

export const TEST_JWT = {
  valid:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik9jdG9Ub29scyIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  expired:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik9jdG9Ub29scyIsImV4cCI6MTUxNjIzOTAyMn0.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ',
  malformed: 'not.a.jwt',
};

export const TEST_BASE64 = {
  encoded: 'T2N0b1Rvb2xzIC0gRGV2ZWxvcGVyIFRvb2xz',
  decoded: 'OctoTools - Developer Tools',
  unicode: '8J+ZgCBPY3RvVG9vbHMg8J+Zgg==',
  binary: Buffer.from([0xff, 0xd8, 0xff, 0xe0]).toString('base64'),
};

export const TEST_URL = {
  simple: 'https://octotools.org',
  withParams:
    'https://octotools.org/tools/json-formatter?theme=dark&format=true',
  encoded: 'https%3A%2F%2Foctotools.org%2Ftools%2Fjson-formatter',
  withSpecialChars: 'https://octotools.org/search?q=test+query&filter=all',
};

export const TEST_UUID = {
  v4: '550e8400-e29b-41d4-a716-446655440000',
  v1: 'c232ab00-9414-11ec-b3c8-0242ac120002',
  invalid: 'not-a-valid-uuid',
};

export const TEST_HASH = {
  input: 'OctoTools',
  md5: '7f5b1a3d8e9c4f2a6b8c1d3e5f7a9b1c',
  sha1: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
  sha256: '9b74c9897bac770ffc029102a200c5de7e2791ec5b4c5c5e5b5a5b5c5b5a5b5c',
};

export const TEST_TIMESTAMP = {
  unix: 1616239022,
  iso: '2021-03-20T10:30:22.000Z',
  readable: 'March 20, 2021 10:30:22 AM',
  milliseconds: 1616239022000,
};

export const TEST_SQL = {
  simple: 'SELECT * FROM users WHERE id = 1',
  complex: `
    SELECT u.name, u.email, COUNT(o.id) as order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.created_at > '2021-01-01'
    GROUP BY u.id, u.name, u.email
    HAVING COUNT(o.id) > 5
    ORDER BY order_count DESC
  `,
  invalid: 'SELCT * FORM users',
};

export const TEST_CSV = {
  simple: 'name,age,city\\nJohn,30,New York\\nJane,25,Los Angeles',
  withHeaders:
    'id,name,email\\n1,John Doe,john@octotools.org\\n2,Jane Smith,jane@octotools.org',
  withCommas: '"Last, First",Age,"City, State"\\n"Doe, John",30,"New York, NY"',
};

export const TEST_XML = {
  simple: '<root><name>OctoTools</name><version>1.0.0</version></root>',
  complex: `
    <?xml version="1.0" encoding="UTF-8"?>
    <project>
      <name>OctoTools</name>
      <tools>
        <tool id="1">
          <name>JSON Formatter</name>
          <category>Data Conversion</category>
        </tool>
      </tools>
    </project>
  `,
  invalid: '<root><unclosed>',
};

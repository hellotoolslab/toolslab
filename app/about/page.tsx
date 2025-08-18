import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - OctoTools',
  description: 'Learn more about OctoTools, our mission, and commitment to privacy-first developer tools.',
};

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🐙</div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">About OctoTools</h1>
          <p className="text-lg text-muted-foreground">
            Essential developer tools that work offline and respect your privacy
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>Our Mission</h2>
          <p>
            OctoTools was built with a simple mission: to provide developers with essential tools that are fast, 
            reliable, and respectful of your privacy. Every tool is designed to work offline, ensuring your data 
            never leaves your browser.
          </p>

          <h2>Privacy First</h2>
          <p>
            We believe your data should stay with you. That's why:
          </p>
          <ul>
            <li>All processing happens in your browser</li>
            <li>No data is sent to our servers</li>
            <li>No tracking or analytics without consent</li>
            <li>Open source and transparent</li>
          </ul>

          <h2>Built for Developers</h2>
          <p>
            Every tool is crafted with the developer experience in mind. We focus on:
          </p>
          <ul>
            <li>Lightning-fast performance</li>
            <li>Clean, intuitive interfaces</li>
            <li>Keyboard shortcuts and power-user features</li>
            <li>Dark mode support</li>
            <li>Mobile-responsive design</li>
          </ul>

          <h2>Features</h2>
          <ul>
            <li><strong>JSON Formatter:</strong> Format, validate, and beautify JSON with syntax highlighting</li>
            <li><strong>Base64 Encoder/Decoder:</strong> Encode and decode Base64 strings and files</li>
            <li><strong>URL Encoder/Decoder:</strong> Safely encode and decode URLs and URI components</li>
            <li><strong>JWT Decoder:</strong> Inspect JSON Web Token headers and payloads</li>
            <li><strong>UUID Generator:</strong> Generate various types of UUIDs and GUIDs</li>
            <li><strong>Hash Generator:</strong> Create MD5, SHA1, SHA256, and other hash values</li>
            <li><strong>Timestamp Converter:</strong> Convert between Unix timestamps and readable dates</li>
          </ul>

          <h2>Open Source</h2>
          <p>
            OctoTools is open source and built with modern web technologies including Next.js 14, 
            TypeScript, and Tailwind CSS. We welcome contributions and feedback from the community.
          </p>
        </div>
      </div>
    </div>
  );
}
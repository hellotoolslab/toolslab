# 🧰 ToolsLab

**Professional developer tools for everyday tasks** - Transform, format, generate, and analyze your data with a comprehensive suite of web-based utilities.

![ToolsLab Banner](https://img.shields.io/badge/ToolsLab-Developer%20Tools-blue?style=for-the-badge)

## 🌟 Features

- **🏃‍♂️ Instant Processing** - All tools work locally in your browser, no server processing
- **🎨 Modern Interface** - Clean, responsive design with dark/light theme support
- **🔐 Privacy First** - Your data never leaves your browser
- **⚡ Fast & Reliable** - Optimized for performance with minimal bundle size
- **🔗 Tool Chaining** - Connect multiple tools for complex workflows
- **📱 Mobile Ready** - Fully responsive across all devices

## 🛠️ Available Tools

### 📊 Data & Conversion

- **[JSON Formatter](https://toolslab.dev/tools/json-formatter)** - Format, validate and beautify JSON data with syntax highlighting
- **[Regex Tester](https://toolslab.dev/tools/regex-tester)** - Test and debug regular expressions with live matching

### 🔐 Encoding & Security

- **[Base64 Encoder/Decoder](https://toolslab.dev/tools/base64-encode)** - Encode and decode Base64 strings with file support
- **[Hash Generator](https://toolslab.dev/tools/hash-generator)** - Generate MD5, SHA1, SHA256 and other hash functions

### ⚡ Generators

- **[UUID Generator](https://toolslab.dev/tools/uuid-generator)** - Generate UUID/GUID in various formats (v1, v4, etc.)
- **[Password Generator](https://toolslab.dev/tools/password-generator)** - Generate secure passwords with customizable options

### 🎨 Web & Design

- **[Favicon Generator](https://toolslab.dev/tools/favicon-generator)** - Generate complete favicon packages with all sizes and formats

### 🔧 Dev Utilities

- **[Crontab Expression Builder](https://toolslab.dev/tools/crontab-builder)** - Parse, build, and validate cron expressions with visual builder, presets, and next execution times

## 🚀 Quick Start

1. **Visit**: [toolslab.dev](https://toolslab.dev)
2. **Choose a tool** from the categories or use the search
3. **Input your data** and get instant results
4. **Chain tools** together for complex workflows using the Lab feature

## 🧪 The Lab Experience

ToolsLab introduces the **Lab** concept - a unique workflow system that allows you to:

- **Connect Tools**: Chain multiple tools together for complex data transformations
- **Save Workflows**: Bookmark your most-used tool combinations
- **Batch Processing**: Process multiple inputs through the same workflow
- **Visual Pipeline**: See your data flow through each transformation step

### Example Lab Workflow

```
Raw Data → JSON Formatter → Base64 Encoder → Hash Generator → Final Result
```

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Code Editor**: CodeMirror 6
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel
- **Analytics**: Umami (privacy-focused)

## 🔧 Development

### Prerequisites

- Node.js 18.17.0+
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/toolslab
cd toolslab
npm install
```

### Development Server

```bash
npm run dev
# Opens http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests in watch mode
npm run test:ci      # Run tests with coverage
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📝 Adding New Tools

ToolsLab uses a systematic approach for adding new tools:

1. **Register the tool** in `lib/tools.ts` with metadata
2. **Create tests** in `__tests__/unit/tools/[tool-name].test.ts`
3. **Implement logic** in `lib/tools/[tool-name].ts`
4. **Build UI** in `components/tools/implementations/[ToolName].tsx`
5. **Add route** in `app/tools/[tool-slug]/page.tsx`

The sitemap updates automatically when new tools are added.

## 🎯 Tool Categories

- **📊 Data & Conversion**: Transform data between formats (JSON, CSV, XML, SQL)
- **🔐 Encoding & Security**: Encode, decode, hash, and secure data
- **📝 Text & Format**: Process, compare, and format text content
- **⚡ Generators**: Create UUIDs, passwords, QR codes, and more
- **🎨 Web & Design**: Tools for colors, images, and web assets
- **🔧 Dev Utilities**: API testing, validation, debugging tools
- **🪄 Formatters**: Beautify code, SQL, JSON, XML, and structured data

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code standards and conventions
- Testing requirements
- Pull request process
- Development workflow

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/hellotoolslab/toolslab/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hellotoolslab/toolslab/discussions)
- **Website**: [toolslab.dev](https://toolslab.dev)

---

**Built with ❤️ for developers by developers**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/hellotoolslab/toolslab)

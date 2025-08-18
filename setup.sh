# OctoTools - Optimized Project Structure

## Quick Setup Script

```bash
#!/bin/bash

# Create Next.js project with optimizations
npx create-next-app@latest octotools \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git

cd octotools

# Copy configuration files from octotools-optimized
cp ../octotools-optimized/package.json .
cp ../octotools-optimized/next.config.js .
cp ../octotools-optimized/tsconfig.json .
cp ../octotools-optimized/tailwind.config.ts .

# Install all dependencies
npm install

# Setup shadcn/ui
npx shadcn-ui@latest init -y

# Add essential shadcn components
npx shadcn-ui@latest add button card dialog dropdown-menu input label popover select separator tabs toast tooltip

# Create project structure
mkdir -p {app/{api/tools,tools},components/{ads,layout,providers,tools,ui,workspace},lib/{store,tools/{json,base64,url,jwt,shared},utils,workers},public/workers,hooks,types,config}

# Initialize Git
git init
git add .
git commit -m "Initial commit: OctoTools optimized setup"

echo "✅ OctoTools setup complete! Run 'npm run dev' to start."
```
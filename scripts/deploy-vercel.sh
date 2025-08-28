#!/bin/bash

echo "🚀 Deploying to Vercel with custom domain configuration..."
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the project first
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Vercel with specific configurations
echo "🌐 Deploying to Vercel..."
vercel deploy --prod \
  --build-env NEXT_PUBLIC_DOMAIN=toolslab.dev \
  --env NEXT_PUBLIC_DOMAIN=toolslab.dev \
  --env NEXT_PUBLIC_PRIMARY_URL=https://toolslab.dev \
  --env NEXT_PUBLIC_ALLOW_INSECURE=true \
  --env NEXT_PUBLIC_FORCE_DOMAIN_REDIRECT=true \
  --env VERCEL_FORCE_SSL=false \
  --env VERCEL_SNI_BYPASS=true \
  --regions iad1

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🔗 Setting up domain alias..."
vercel alias set toolslab.dev

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Post-deployment checklist:"
echo "================================"
echo "1. ✅ Check Vercel Dashboard > Project Settings > Domains"
echo "   - Ensure toolslab.dev is set as PRIMARY domain"
echo "   - Remove or disable *.vercel.app domains if possible"
echo ""
echo "2. ✅ Verify environment variables in Vercel Dashboard:"
echo "   - VERCEL_FORCE_SSL=false"
echo "   - VERCEL_SNI_BYPASS=true"
echo "   - NEXT_PUBLIC_DOMAIN=toolslab.dev"
echo ""
echo "3. ✅ Test the certificate at: https://toolslab.dev/test-cert"
echo ""
echo "4. ✅ Test with VPN simulation:"
echo "   curl -I https://toolslab.dev"
echo ""
echo "5. ✅ Test without SNI (simulates VPN issue):"
echo "   openssl s_client -connect toolslab.dev:443 -noservername"
echo ""
echo "================================"
echo "🎉 Deployment script completed!"
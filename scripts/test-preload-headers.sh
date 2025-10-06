#!/bin/bash

# Script per testare i preload headers del middleware
# Verifica che i Link headers siano presenti per le pagine localizzate

echo "🧪 Testing Dictionary Preload Headers"
echo "======================================"
echo ""

BASE_URL="http://localhost:3001"

# Test 1: Homepage IT
echo "📄 Test 1: Homepage IT (/it)"
echo "Expected sections: common, home, footer"
curl -I "$BASE_URL/it" 2>/dev/null | grep -i "link:\|x-dictionary"
echo ""

# Test 2: Tools page IT
echo "📄 Test 2: Tools Page IT (/it/tools)"
echo "Expected sections: common, tools, categories, footer"
curl -I "$BASE_URL/it/tools" 2>/dev/null | grep -i "link:\|x-dictionary"
echo ""

# Test 3: Individual tool page IT
echo "📄 Test 3: Tool Page IT (/it/tools/json-formatter)"
echo "Expected sections: common, tools, footer"
curl -I "$BASE_URL/it/tools/json-formatter" 2>/dev/null | grep -i "link:\|x-dictionary"
echo ""

# Test 4: Lab page IT
echo "📄 Test 4: Lab Page IT (/it/lab)"
echo "Expected sections: common, tools, footer"
curl -I "$BASE_URL/it/lab" 2>/dev/null | grep -i "link:\|x-dictionary"
echo ""

# Test 5: Homepage EN (default, no prefix)
echo "📄 Test 5: Homepage EN (/)"
echo "Expected sections: common, home, footer"
curl -I "$BASE_URL/" 2>/dev/null | grep -i "link:\|x-dictionary"
echo ""

# Test 6: Cookie persistence
echo "🍪 Test 6: Cookie Persistence"
echo "Testing if preferred-locale cookie is set..."
curl -I "$BASE_URL/it" 2>/dev/null | grep -i "set-cookie.*preferred-locale"
echo ""

echo "✅ Test completed!"
echo ""
echo "💡 How to verify:"
echo "1. Check that Link headers contain preload directives"
echo "2. Check X-Dictionary-Sections header shows correct sections"
echo "3. Check X-Dictionary-Locale header shows correct locale"
echo "4. Check Set-Cookie header for preferred-locale"

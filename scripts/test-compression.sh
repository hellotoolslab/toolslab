#!/bin/bash

# Dictionary Compression Test Script
# Tests compression ratios for dictionary API on production

DOMAIN="https://toolslab.dev"

echo "🗜️  Dictionary Compression Analysis"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test full dictionary
echo "📦 1. Full EN dictionary:"
FULL_SIZE=$(curl -sS \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  -w "%{size_download}" \
  -o /tmp/dict-full.json \
  "$DOMAIN/api/dictionary/en")

# Get encoding
ENCODING=$(curl -sS \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "User-Agent: Mozilla/5.0" \
  -I "$DOMAIN/api/dictionary/en" | grep -i "content-encoding" | awk '{print $2}' | tr -d '\r')

UNCOMPRESSED=$(wc -c < /tmp/dict-full.json)
RATIO=$(awk "BEGIN {printf \"%.1f\", (1-$FULL_SIZE/$UNCOMPRESSED)*100}")

echo "   Compressed size: ${GREEN}$FULL_SIZE bytes${NC}"
echo "   Uncompressed: $UNCOMPRESSED bytes"
echo "   Compression: ${GREEN}$ENCODING${NC}"
echo "   Ratio: ${GREEN}${RATIO}%${NC} reduction"
echo ""

# Test Italian dictionary
echo "📦 2. Full IT dictionary:"
IT_SIZE=$(curl -sS \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  -w "%{size_download}" \
  -o /tmp/dict-it.json \
  "$DOMAIN/api/dictionary/it")

IT_UNCOMPRESSED=$(wc -c < /tmp/dict-it.json)
IT_RATIO=$(awk "BEGIN {printf \"%.1f\", (1-$IT_SIZE/$IT_UNCOMPRESSED)*100}")

echo "   Compressed size: ${GREEN}$IT_SIZE bytes${NC}"
echo "   Uncompressed: $IT_UNCOMPRESSED bytes"
echo "   Ratio: ${GREEN}${IT_RATIO}%${NC} reduction"
echo ""

# Test section request (home page)
echo "📦 3. Section request (home,common,footer):"
SECTION_SIZE=$(curl -sS \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  -w "%{size_download}" \
  -o /tmp/dict-section.json \
  "$DOMAIN/api/dictionary/en?sections=home,common,footer")

SECTION_UNCOMPRESSED=$(wc -c < /tmp/dict-section.json)
SECTION_RATIO=$(awk "BEGIN {printf \"%.1f\", (1-$SECTION_SIZE/$SECTION_UNCOMPRESSED)*100}")

echo "   Compressed size: ${GREEN}$SECTION_SIZE bytes${NC}"
echo "   Uncompressed: $SECTION_UNCOMPRESSED bytes"
echo "   Ratio: ${GREEN}${SECTION_RATIO}%${NC} reduction"
echo ""

# Test individual sections
echo "📦 4. Individual sections:"

for section in common home tools categories footer seo; do
  SEC_SIZE=$(curl -sS \
    -H "Accept-Encoding: gzip, deflate, br" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    -w "%{size_download}" \
    -o /tmp/dict-$section.json \
    "$DOMAIN/api/dictionary/en?sections=$section")

  SEC_UNCOMPRESSED=$(wc -c < /tmp/dict-$section.json)
  SEC_RATIO=$(awk "BEGIN {printf \"%.1f\", (1-$SEC_SIZE/$SEC_UNCOMPRESSED)*100}")

  printf "   %-12s: %6s bytes (uncompressed: %6s) - ${GREEN}%5s%%${NC} reduction\n" \
    "$section" "$SEC_SIZE" "$SEC_UNCOMPRESSED" "$SEC_RATIO"
done

echo ""

# Summary
echo "📊 Summary:"
echo "==========="
echo "   Full dictionary compression: ${GREEN}${RATIO}%${NC}"
echo "   Section loading compression: ${GREEN}${SECTION_RATIO}%${NC}"
echo "   Encoding method: ${GREEN}${ENCODING}${NC}"
echo ""

# Performance estimates
echo "⚡ Performance Impact (3G network ~100 KB/s):"
echo "   Full dictionary:"
echo "     - Before: ~$(awk "BEGIN {printf \"%.0f\", $UNCOMPRESSED/102.4}")ms"
echo "     - After:  ~$(awk "BEGIN {printf \"%.0f\", $FULL_SIZE/102.4}")ms"
echo "     - Saved:  ${GREEN}~$(awk "BEGIN {printf \"%.0f\", ($UNCOMPRESSED-$FULL_SIZE)/102.4}")ms${NC}"
echo ""
echo "   Home page sections:"
echo "     - Before: ~$(awk "BEGIN {printf \"%.0f\", $SECTION_UNCOMPRESSED/102.4}")ms"
echo "     - After:  ~$(awk "BEGIN {printf \"%.0f\", $SECTION_SIZE/102.4}")ms"
echo "     - Saved:  ${GREEN}~$(awk "BEGIN {printf \"%.0f\", ($SECTION_UNCOMPRESSED-$SECTION_SIZE)/102.4}")ms${NC}"
echo ""

# Check if compression is optimal
if (( $(echo "$RATIO < 75" | bc -l) )); then
  echo "${YELLOW}⚠️  Warning: Compression ratio below expected 80%${NC}"
else
  echo "${GREEN}✅ Compression working optimally${NC}"
fi

# Cleanup
rm -f /tmp/dict-*.json

echo ""
echo "✨ Test completed!"

import {
  formatXml,
  minifyXml,
  validateXml,
  parseXmlMetadata,
  searchXmlElements,
  XmlFormatterOptions,
} from '@/lib/tools/xml-formatter';

describe('XML Formatter', () => {
  describe('formatXml', () => {
    it('should format simple XML with proper indentation', () => {
      const input = '<root><child>content</child></root>';
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.formatted).toBe(
        '<root>\n  <child>content</child>\n</root>'
      );
    });

    it('should format XML with attributes', () => {
      const input =
        '<root id="1" name="test"><child attr="value">content</child></root>';
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('id="1"');
      expect(result.formatted).toContain('name="test"');
      expect(result.formatted).toContain('attr="value"');
    });

    it('should handle nested XML elements', () => {
      const input =
        '<root><parent><child><grandchild>deep</grandchild></child></parent></root>';
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.formatted?.split('\n').length).toBeGreaterThan(4);
    });

    it('should preserve XML declaration', () => {
      const input =
        '<?xml version="1.0" encoding="UTF-8"?><root><child>content</child></root>';
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain(
        '<?xml version="1.0" encoding="UTF-8"?>'
      );
    });

    it('should handle CDATA sections', () => {
      const input =
        '<root><data><![CDATA[<special>&characters</special>]]></data></root>';
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain(
        '<![CDATA[<special>&characters</special>]]>'
      );
    });

    it('should handle XML comments when preserveComments is true', () => {
      const input =
        '<root><!-- This is a comment --><child>content</child></root>';
      const options: XmlFormatterOptions = { preserveComments: true };
      const result = formatXml(input, options);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('<!-- This is a comment -->');
    });

    it('should remove XML comments when preserveComments is false', () => {
      const input =
        '<root><!-- This is a comment --><child>content</child></root>';
      const options: XmlFormatterOptions = { preserveComments: false };
      const result = formatXml(input, options);

      expect(result.success).toBe(true);
      expect(result.formatted).not.toContain('<!-- This is a comment -->');
    });

    it('should sort attributes alphabetically when sortAttributes is true', () => {
      const input = '<element zebra="last" alpha="first" middle="center"/>';
      const options: XmlFormatterOptions = { sortAttributes: true };
      const result = formatXml(input, options);

      expect(result.success).toBe(true);
      const formatted = result.formatted || '';
      const alphaIndex = formatted.indexOf('alpha');
      const middleIndex = formatted.indexOf('middle');
      const zebraIndex = formatted.indexOf('zebra');

      expect(alphaIndex).toBeLessThan(middleIndex);
      expect(middleIndex).toBeLessThan(zebraIndex);
    });

    it('should handle namespaces', () => {
      const input =
        '<root xmlns:custom="http://example.com"><custom:element>content</custom:element></root>';
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('xmlns:custom="http://example.com"');
      expect(result.formatted).toContain('<custom:element>');
    });

    it('should handle self-closing tags', () => {
      const input = '<root><empty/><another /></root>';
      const result = formatXml(input);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('<empty/>');
      expect(result.formatted).toContain('<another />');
    });

    it('should handle malformed XML', () => {
      const input = '<root><unclosed>';
      const result = formatXml(input);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('unclosed');
    });

    it('should handle empty input', () => {
      const result = formatXml('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Input is required');
    });

    it('should use custom indentation size', () => {
      const input = '<root><child>content</child></root>';
      const options: XmlFormatterOptions = { indentSize: 4 };
      const result = formatXml(input, options);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('    <child>'); // 4 spaces
    });
  });

  describe('minifyXml', () => {
    it('should minify XML by removing unnecessary whitespace', () => {
      const input = `<root>
        <child>
          content
        </child>
      </root>`;
      const result = minifyXml(input);

      expect(result.success).toBe(true);
      expect(result.minified).toBe('<root><child>content</child></root>');
    });

    it('should preserve whitespace in text content', () => {
      const input = '<root><child>preserve this spacing</child></root>';
      const result = minifyXml(input);

      expect(result.success).toBe(true);
      expect(result.minified).toContain('preserve this spacing');
    });

    it('should handle attributes during minification', () => {
      const input =
        '<root id="1" name="test"><child attr="value">content</child></root>';
      const result = minifyXml(input);

      expect(result.success).toBe(true);
      expect(result.minified).toBe(
        '<root id="1" name="test"><child attr="value">content</child></root>'
      );
    });

    it('should preserve CDATA sections', () => {
      const input =
        '<root><data><![CDATA[  preserve  spaces  ]]></data></root>';
      const result = minifyXml(input);

      expect(result.success).toBe(true);
      expect(result.minified).toContain('<![CDATA[  preserve  spaces  ]]>');
    });
  });

  describe('validateXml', () => {
    it('should validate well-formed XML', () => {
      const input = '<root><child>content</child></root>';
      const result = validateXml(input);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect unclosed tags', () => {
      const input = '<root><child>content</root>';
      const result = validateXml(input);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('child');
    });

    it('should detect mismatched tags', () => {
      const input = '<root><child>content</wrong></root>';
      const result = validateXml(input);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('mismatch');
    });

    it('should detect invalid attribute syntax', () => {
      const input = '<root attr=unquoted>content</root>';
      const result = validateXml(input);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should validate XML with declaration', () => {
      const input =
        '<?xml version="1.0" encoding="UTF-8"?><root><child>content</child></root>';
      const result = validateXml(input);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate namespace declarations', () => {
      const input =
        '<root xmlns:custom="http://example.com"><custom:element>content</custom:element></root>';
      const result = validateXml(input);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect undefined namespace prefixes', () => {
      const input =
        '<root><undefined:element>content</undefined:element></root>';
      const result = validateXml(input);

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('namespace');
    });
  });

  describe('parseXmlMetadata', () => {
    it('should extract element count', () => {
      const input = '<root><child1/><child2><nested/></child2></root>';
      const metadata = parseXmlMetadata(input);

      expect(metadata.elementCount).toBe(4);
    });

    it('should extract unique element types', () => {
      const input = '<root><item/><item/><other/></root>';
      const metadata = parseXmlMetadata(input);

      expect(metadata.uniqueElements).toContain('root');
      expect(metadata.uniqueElements).toContain('item');
      expect(metadata.uniqueElements).toContain('other');
      expect(metadata.uniqueElements.length).toBe(3);
    });

    it('should count attributes', () => {
      const input = '<root id="1"><child attr1="a" attr2="b"/></root>';
      const metadata = parseXmlMetadata(input);

      expect(metadata.attributeCount).toBe(3);
    });

    it('should calculate maximum nesting depth', () => {
      const input = '<a><b><c><d><e>deep</e></d></c></b></a>';
      const metadata = parseXmlMetadata(input);

      expect(metadata.maxDepth).toBe(5);
    });

    it('should detect namespaces', () => {
      const input =
        '<root xmlns:ns1="http://example1.com" xmlns:ns2="http://example2.com"><ns1:element/></root>';
      const metadata = parseXmlMetadata(input);

      expect(metadata.namespaces).toHaveLength(2);
      expect(metadata.namespaces).toContain('ns1');
      expect(metadata.namespaces).toContain('ns2');
    });

    it('should detect XML version and encoding', () => {
      const input = '<?xml version="1.0" encoding="UTF-8"?><root/>';
      const metadata = parseXmlMetadata(input);

      expect(metadata.version).toBe('1.0');
      expect(metadata.encoding).toBe('UTF-8');
    });

    it('should count comments and CDATA sections', () => {
      const input =
        '<root><!-- comment --><data><![CDATA[data]]></data><!-- another --></root>';
      const metadata = parseXmlMetadata(input);

      expect(metadata.commentCount).toBe(2);
      expect(metadata.cdataCount).toBe(1);
    });
  });

  describe('searchXmlElements', () => {
    const sampleXml = `
      <users>
        <user id="1" name="Alice">
          <email>alice@example.com</email>
        </user>
        <user id="2" name="Bob">
          <email>bob@example.com</email>
        </user>
      </users>
    `;

    it('should find elements by name', () => {
      const results = searchXmlElements(sampleXml, 'user');

      expect(results.length).toBe(2);
      expect(results[0].path).toContain('user');
    });

    it('should find attributes with @ prefix', () => {
      const results = searchXmlElements(sampleXml, '@id');

      expect(results.length).toBe(2);
      expect(results[0].value).toBe('1');
      expect(results[1].value).toBe('2');
    });

    it('should support XPath-style searches', () => {
      const results = searchXmlElements(sampleXml, '//user/@name');

      expect(results.length).toBe(2);
      expect(results[0].value).toBe('Alice');
      expect(results[1].value).toBe('Bob');
    });

    it('should find nested elements', () => {
      const results = searchXmlElements(sampleXml, 'email');

      expect(results.length).toBe(2);
      expect(results[0].value).toBe('alice@example.com');
      expect(results[1].value).toBe('bob@example.com');
    });

    it('should return empty array for non-existent elements', () => {
      const results = searchXmlElements(sampleXml, 'nonexistent');

      expect(results).toHaveLength(0);
    });

    it('should handle case-sensitive searches', () => {
      const results = searchXmlElements(sampleXml, 'USER');

      expect(results).toHaveLength(0);
    });
  });

  describe('Real-world XML scenarios', () => {
    it('should format RSS feed', () => {
      const rss = `<?xml version="1.0"?><rss version="2.0"><channel><title>Blog</title><item><title>Post</title><description>Content</description></item></channel></rss>`;
      const result = formatXml(rss);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('<rss version="2.0">');
      expect(result.formatted).toContain('<channel>');
      expect(result.formatted).toContain('<item>');
    });

    it('should format SVG graphics', () => {
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"/></svg>';
      const result = formatXml(svg);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(result.formatted).toContain('<circle');
    });

    it('should format SOAP envelope', () => {
      const soap = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetUser><Id>123</Id></GetUser></soap:Body></soap:Envelope>`;
      const result = formatXml(soap);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('<soap:Envelope');
      expect(result.formatted).toContain('<soap:Body>');
    });

    it('should format Android layout', () => {
      const layout =
        '<LinearLayout android:layout_width="match_parent" android:layout_height="match_parent"><TextView android:text="Hello"/></LinearLayout>';
      const result = formatXml(layout);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('<LinearLayout');
      expect(result.formatted).toContain('<TextView');
    });

    it('should format Maven POM', () => {
      const pom =
        '<project><groupId>com.example</groupId><artifactId>app</artifactId><version>1.0</version></project>';
      const result = formatXml(pom);

      expect(result.success).toBe(true);
      expect(result.formatted).toContain('<groupId>com.example</groupId>');
      expect(result.formatted).toContain('<artifactId>app</artifactId>');
    });
  });
});

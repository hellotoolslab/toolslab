// Simple but robust XML formatter
export function formatXmlSimple(input: string, indentSize: number = 2): string {
  if (!input || !input.trim()) {
    return '';
  }

  let xml = input.trim();

  // Remove all whitespace between tags
  xml = xml.replace(/>\s+</g, '><');

  let result = '';
  let indent = 0;
  const indentStr = ' '.repeat(indentSize);

  // Process character by character
  let i = 0;
  while (i < xml.length) {
    if (xml[i] === '<') {
      // Find the end of the tag
      let tagEnd = xml.indexOf('>', i);
      if (tagEnd === -1) break;

      let tag = xml.substring(i, tagEnd + 1);

      // Handle XML declaration
      if (tag.startsWith('<?xml')) {
        result += tag + '\n';
        i = tagEnd + 1;
        continue;
      }

      // Handle comments
      if (tag.startsWith('<!--')) {
        result += indentStr.repeat(indent) + tag + '\n';
        i = tagEnd + 1;
        continue;
      }

      // Handle CDATA
      if (tag.includes('<![CDATA[')) {
        result += indentStr.repeat(indent) + tag + '\n';
        i = tagEnd + 1;
        continue;
      }

      // Handle closing tags
      if (tag.startsWith('</')) {
        indent = Math.max(0, indent - 1);
        result += indentStr.repeat(indent) + tag + '\n';
        i = tagEnd + 1;
        continue;
      }

      // Handle self-closing tags
      if (tag.endsWith('/>')) {
        result += indentStr.repeat(indent) + tag + '\n';
        i = tagEnd + 1;
        continue;
      }

      // Handle opening tags
      result += indentStr.repeat(indent) + tag;
      i = tagEnd + 1;

      // Check if there's text content immediately after
      let textStart = i;
      let textEnd = xml.indexOf('<', i);

      if (textEnd > textStart) {
        let textContent = xml.substring(textStart, textEnd).trim();
        if (textContent) {
          // This is an inline element with text content
          result += textContent;
          i = textEnd;

          // Find the closing tag
          let closingTagEnd = xml.indexOf('>', i);
          if (closingTagEnd !== -1) {
            let closingTag = xml.substring(i, closingTagEnd + 1);
            result += closingTag + '\n';
            i = closingTagEnd + 1;
          }
          continue;
        }
      }

      // No text content, this is a container element
      result += '\n';
      indent++;
    } else {
      i++;
    }
  }

  return result.trim();
}

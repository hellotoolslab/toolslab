/**
 * XML to JSON Converter
 * Converts XML documents to JSON format with various options
 */

export interface XmlToJsonOptions {
  prettyPrint?: boolean;
  attributeMode?: 'verbose' | 'compact' | 'inline'; // verbose: @attributes, compact: @attr, inline: attr (no prefix)
  removeNamespaces?: boolean;
  arrayMode?: boolean;
  convertTypes?: boolean;
  indentSize?: number;
}

export interface XmlToJsonResult {
  success: boolean;
  result?: string;
  error?: string;
  metadata?: {
    xmlSize: number;
    jsonSize: number;
    processingTime: number;
    elementCount?: number;
  };
}

interface XmlNode {
  [key: string]: any;
}

/**
 * Main function to convert XML to JSON
 */
export function xmlToJson(
  xml: string,
  options: XmlToJsonOptions = {}
): XmlToJsonResult {
  const startTime = Date.now();

  try {
    // Validate input
    if (!xml || typeof xml !== 'string') {
      return {
        success: false,
        error: 'XML input is required and must be a string',
      };
    }

    const trimmedXml = xml.trim();
    if (trimmedXml.length === 0) {
      return {
        success: false,
        error: 'XML input is required',
      };
    }

    // Set default options
    const config: Required<XmlToJsonOptions> = {
      prettyPrint: options.prettyPrint ?? true,
      attributeMode: options.attributeMode ?? 'inline',
      removeNamespaces: options.removeNamespaces ?? false,
      arrayMode: options.arrayMode ?? true,
      convertTypes: options.convertTypes ?? false,
      indentSize: options.indentSize ?? 2,
    };

    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(trimmedXml, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      return {
        success: false,
        error: `XML parsing error: ${parserError.textContent || 'Invalid XML format'}`,
      };
    }

    // Convert XML to JSON object
    const rootNode = xmlDoc.documentElement;
    let rootName = rootNode.nodeName;

    // Handle namespace in root element name
    if (config.removeNamespaces && rootName.includes(':')) {
      rootName = rootName.split(':')[1];
    }

    const rootContent = xmlNodeToJson(rootNode, config);

    // Wrap the result with root element name
    const jsonObj = { [rootName]: rootContent };

    // Count elements
    const elementCount = countElements(xmlDoc.documentElement);

    // Stringify with or without formatting
    const jsonString = config.prettyPrint
      ? JSON.stringify(jsonObj, null, config.indentSize)
      : JSON.stringify(jsonObj);

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      result: jsonString,
      metadata: {
        xmlSize: trimmedXml.length,
        jsonSize: jsonString.length,
        processingTime,
        elementCount,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Convert XML node to JSON object recursively
 */
function xmlNodeToJson(
  node: Element,
  config: Required<XmlToJsonOptions>
): XmlNode {
  const obj: XmlNode = {};

  // Get node name (with or without namespace)
  let nodeName = node.nodeName;
  if (config.removeNamespaces && nodeName.includes(':')) {
    nodeName = nodeName.split(':')[1];
  }

  // Handle attributes
  if (node.attributes && node.attributes.length > 0) {
    const attributes: { [key: string]: string } = {};

    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      let attrName = attr.nodeName;

      // Skip xmlns attributes when removing namespaces
      if (config.removeNamespaces && attrName.startsWith('xmlns')) {
        continue;
      }

      if (config.removeNamespaces && attrName.includes(':')) {
        attrName = attrName.split(':')[1];
      }

      attributes[attrName] = attr.nodeValue || '';
    }

    if (Object.keys(attributes).length > 0) {
      if (config.attributeMode === 'verbose') {
        // Verbose mode: @attributes object
        obj['@attributes'] = attributes;
      } else if (config.attributeMode === 'compact') {
        // Compact mode: @attributeName
        Object.keys(attributes).forEach((key) => {
          obj[`@${key}`] = convertValue(attributes[key], config);
        });
      } else {
        // Inline mode: attributeName (no prefix)
        Object.keys(attributes).forEach((key) => {
          obj[key] = convertValue(attributes[key], config);
        });
      }
    }
  }

  // Process child nodes
  const children: { [key: string]: any[] } = {};
  let hasTextContent = false;
  let textContent = '';

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];

    if (
      child.nodeType === Node.TEXT_NODE ||
      child.nodeType === Node.CDATA_SECTION_NODE
    ) {
      const text = child.nodeValue?.trim() || '';
      if (text) {
        hasTextContent = true;
        textContent += text;
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      let childName = child.nodeName;
      if (config.removeNamespaces && childName.includes(':')) {
        childName = childName.split(':')[1];
      }

      if (!children[childName]) {
        children[childName] = [];
      }

      children[childName].push(xmlNodeToJson(child as Element, config));
    }
  }

  // Handle text content
  if (hasTextContent) {
    if (Object.keys(children).length === 0) {
      // Element has only text content and possibly attributes
      if (Object.keys(obj).length > 0) {
        // Has attributes
        obj['#text'] = convertValue(textContent, config);
      } else {
        // No attributes, return text directly
        return convertValue(textContent, config);
      }
    } else {
      // Has both text and child elements
      obj['#text'] = convertValue(textContent, config);
    }
  }

  // Add child elements
  Object.keys(children).forEach((childName) => {
    const childArray = children[childName];

    if (config.arrayMode && childArray.length > 1) {
      // Multiple children with same name -> array
      obj[childName] = childArray;
    } else if (childArray.length === 1) {
      // Single child -> direct value
      obj[childName] = childArray[0];
    }
  });

  // If object is empty, return empty object
  if (Object.keys(obj).length === 0) {
    return {};
  }

  return obj;
}

/**
 * Convert string value to appropriate type if enabled
 */
function convertValue(value: string, config: Required<XmlToJsonOptions>): any {
  if (!config.convertTypes) {
    return value;
  }

  // Try to convert to number
  if (/^-?\d+\.?\d*$/.test(value)) {
    const num = Number(value);
    if (!isNaN(num)) {
      return num;
    }
  }

  // Try to convert to boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Try to convert to null
  if (value === 'null') return null;

  return value;
}

/**
 * Count total number of elements in XML
 */
function countElements(node: Element): number {
  let count = 1; // Count current element

  for (let i = 0; i < node.children.length; i++) {
    count += countElements(node.children[i]);
  }

  return count;
}

/**
 * Browser's DOMParser implementation
 */
class DOMParser {
  parseFromString(xmlString: string, mimeType: string): Document {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new window.DOMParser();
      return parser.parseFromString(
        xmlString,
        mimeType as DOMParserSupportedType
      );
    }

    // Fallback for server-side rendering or environments without DOMParser
    throw new Error('DOMParser is not available in this environment');
  }
}

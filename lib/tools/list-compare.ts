export interface ListItem {
  value: string;
  index: number;
  listId: string;
}

export interface ComparisonOptions {
  mode: 'set' | 'sequential' | 'smart' | 'fuzzy' | 'developer';
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  fuzzyThreshold?: number;
  sortBeforeCompare?: boolean;
  removeDuplicates?: boolean;
  filterPattern?: string;
  transformFunction?: string;
}

export interface ComparisonResult {
  success: boolean;
  error?: string;
  union?: string[];
  intersection?: string[];
  difference?: string[];
  symmetricDifference?: string[];
  unique?: Record<string, string[]>;
  statistics?: ComparisonStatistics;
  metadata?: {
    processingTime: number;
    totalItems: number;
    listsProcessed: number;
  };
}

export interface ComparisonStatistics {
  totalUnique: number;
  totalDuplicates: number;
  overlapPercentage: number;
  listSizes: Record<string, number>;
  similarityMatrix?: Record<string, Record<string, number>>;
}

export interface ParseListOptions {
  separator?: 'auto' | 'newline' | 'comma' | 'semicolon' | 'tab' | 'pipe';
  trimLines?: boolean;
  removeEmptyLines?: boolean;
  filterPattern?: string;
}

export interface ParseListResult {
  success: boolean;
  items?: string[];
  error?: string;
  metadata?: {
    originalLength: number;
    filteredLength: number;
    detectedSeparator?: string;
  };
}

export interface FuzzyMatchOptions {
  threshold: number;
  algorithm: 'levenshtein' | 'jaro' | 'jaroWinkler' | 'similarity';
}

export interface FuzzyMatchResult {
  matches: Array<{
    item1: string;
    item2: string;
    similarity: number;
    listId1: string;
    listId2: string;
  }>;
  clusters: Array<{
    representative: string;
    members: Array<{
      value: string;
      listId: string;
      similarity: number;
    }>;
  }>;
}

export interface TransformOptions {
  sort?: 'alphabetical' | 'numerical' | 'length';
  case?: 'upper' | 'lower' | 'title';
  trim?: boolean;
  removeDuplicates?: boolean;
  filterPattern?: string;
  prefixSuffix?: { prefix?: string; suffix?: string };
}

export interface PackageVersionInfo {
  name: string;
  version: string;
  valid: boolean;
  issues?: string[];
}

export interface UrlInfo {
  original: string;
  normalized: string;
  protocol?: string;
  domain?: string;
  path?: string;
}

/**
 * Detect the most likely separator in a text input
 */
export function detectSeparator(input: string): ParseListOptions['separator'] {
  if (!input || input.trim() === '') {
    return 'newline';
  }

  const separators = {
    newline: (input.match(/\n/g) || []).length,
    comma: (input.match(/,/g) || []).length,
    semicolon: (input.match(/;/g) || []).length,
    tab: (input.match(/\t/g) || []).length,
    pipe: (input.match(/\|/g) || []).length,
  };

  // If newlines are present and significant, prefer them
  if (separators.newline > 1) {
    return 'newline';
  }

  // Find the separator with the highest count
  const maxCount = Math.max(...Object.values(separators));
  if (maxCount === 0) {
    return 'newline'; // Default fallback
  }

  const detectedSeparatorEntry = Object.entries(separators).find(
    ([_, count]) => count === maxCount
  );
  const detectedSeparator =
    detectedSeparatorEntry?.[0] as ParseListOptions['separator'];
  return detectedSeparator || 'newline';
}

/**
 * Parse a text input into a list of items
 */
export function parseList(
  input: string,
  options: ParseListOptions = {}
): ParseListResult {
  const startTime = performance.now();

  if (!input || input.trim() === '') {
    return {
      success: false,
      error: 'Input is required',
    };
  }

  const {
    separator = 'auto',
    trimLines = true,
    removeEmptyLines = true,
    filterPattern,
  } = options;

  try {
    let detectedSeparator: Exclude<ParseListOptions['separator'], 'auto'> =
      'newline';
    if (separator === 'auto') {
      detectedSeparator = detectSeparator(input) as Exclude<
        ParseListOptions['separator'],
        'auto'
      >;
    } else if (separator) {
      detectedSeparator = separator;
    }

    let separatorChar: string;
    switch (detectedSeparator) {
      case 'comma':
        separatorChar = ',';
        break;
      case 'semicolon':
        separatorChar = ';';
        break;
      case 'tab':
        separatorChar = '\t';
        break;
      case 'pipe':
        separatorChar = '|';
        break;
      case 'newline':
      default:
        separatorChar = '\n';
        break;
    }

    let items = input.split(separatorChar);
    const originalLength = items.length;

    // Apply transformations
    if (trimLines) {
      items = items.map((item) => item.trim());
    }

    if (removeEmptyLines) {
      items = items.filter((item) => item !== '');
    }

    if (filterPattern) {
      const regex = new RegExp(filterPattern, 'gi');
      items = items.filter((item) => regex.test(item));
    }

    return {
      success: true,
      items,
      metadata: {
        originalLength,
        filteredLength: items.length,
        detectedSeparator: separator === 'auto' ? detectedSeparator : undefined,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse list: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Transform a list of items based on specified options
 */
export function transformList(
  items: string[],
  transformations: TransformOptions
): string[] {
  let result = [...items];

  // Apply transformations in order
  if (transformations.trim) {
    result = result.map((item) => item.trim());
  }

  if (transformations.case) {
    switch (transformations.case) {
      case 'upper':
        result = result.map((item) => item.toUpperCase());
        break;
      case 'lower':
        result = result.map((item) => item.toLowerCase());
        break;
      case 'title':
        result = result.map((item) =>
          item.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
        );
        break;
    }
  }

  if (transformations.prefixSuffix) {
    const { prefix = '', suffix = '' } = transformations.prefixSuffix;
    result = result.map((item) => `${prefix}${item}${suffix}`);
  }

  if (transformations.filterPattern) {
    const regex = new RegExp(transformations.filterPattern, 'gi');
    result = result.filter((item) => regex.test(item));
  }

  if (transformations.removeDuplicates) {
    result = [...new Set(result)];
  }

  if (transformations.sort) {
    switch (transformations.sort) {
      case 'alphabetical':
        result.sort((a, b) => a.localeCompare(b));
        break;
      case 'numerical':
        result.sort((a, b) => {
          const numA = parseFloat(a);
          const numB = parseFloat(b);
          if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
          if (isNaN(numA)) return 1;
          if (isNaN(numB)) return -1;
          return numA - numB;
        });
        break;
      case 'length':
        result.sort((a, b) => a.length - b.length);
        break;
    }
  }

  return result;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate Jaro similarity between two strings
 */
function jaroSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;

  const matchWindow = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
  if (matchWindow < 0) return 0.0;

  const str1Matches = new Array(str1.length).fill(false);
  const str2Matches = new Array(str2.length).fill(false);

  let matches = 0;
  let transpositions = 0;

  // Find matches
  for (let i = 0; i < str1.length; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, str2.length);

    for (let j = start; j < end; j++) {
      if (str2Matches[j] || str1[i] !== str2[j]) continue;
      str1Matches[i] = true;
      str2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  // Find transpositions
  let k = 0;
  for (let i = 0; i < str1.length; i++) {
    if (!str1Matches[i]) continue;
    while (!str2Matches[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  return (
    (matches / str1.length +
      matches / str2.length +
      (matches - transpositions / 2) / matches) /
    3.0
  );
}

/**
 * Calculate Jaro-Winkler similarity between two strings
 */
function jaroWinklerSimilarity(str1: string, str2: string): number {
  const jaro = jaroSimilarity(str1, str2);
  if (jaro < 0.7) return jaro;

  const prefix = Math.min(4, Math.min(str1.length, str2.length));
  let commonPrefix = 0;
  for (let i = 0; i < prefix; i++) {
    if (str1[i] === str2[i]) {
      commonPrefix++;
    } else {
      break;
    }
  }

  return jaro + 0.1 * commonPrefix * (1 - jaro);
}

/**
 * Calculate similarity between two strings using specified algorithm
 */
export function calculateSimilarity(
  str1: string,
  str2: string,
  algorithm: string
): number {
  if (str1 === str2) return 1.0;
  if (str1.length === 0 && str2.length === 0) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;

  switch (algorithm) {
    case 'levenshtein':
      const distance = levenshteinDistance(str1, str2);
      const maxLength = Math.max(str1.length, str2.length);
      return 1 - distance / maxLength;

    case 'jaro':
      return jaroSimilarity(str1, str2);

    case 'jaroWinkler':
      return jaroWinklerSimilarity(str1, str2);

    case 'similarity':
    default:
      // Simple character-based similarity
      const longer = str1.length > str2.length ? str1 : str2;
      const shorter = str1.length > str2.length ? str2 : str1;
      const editDistance = levenshteinDistance(longer, shorter);
      return (longer.length - editDistance) / longer.length;
  }
}

/**
 * Perform fuzzy matching between lists
 */
export function fuzzyMatch(
  lists: Record<string, string[]>,
  options: FuzzyMatchOptions
): FuzzyMatchResult {
  const { threshold, algorithm } = options;
  const matches: FuzzyMatchResult['matches'] = [];
  const clusters: FuzzyMatchResult['clusters'] = [];
  const listIds = Object.keys(lists);

  // Find matches between all pairs of lists
  for (let i = 0; i < listIds.length; i++) {
    for (let j = i + 1; j < listIds.length; j++) {
      const list1Id = listIds[i];
      const list2Id = listIds[j];
      const list1 = lists[list1Id];
      const list2 = lists[list2Id];

      for (const item1 of list1) {
        for (const item2 of list2) {
          const similarity = calculateSimilarity(item1, item2, algorithm);
          if (similarity >= threshold) {
            matches.push({
              item1,
              item2,
              similarity,
              listId1: list1Id,
              listId2: list2Id,
            });
          }
        }
      }
    }
  }

  // Create clusters of similar items
  const processed = new Set<string>();
  const allItems = Object.entries(lists).flatMap(([listId, items]) =>
    items.map((item) => ({ value: item, listId }))
  );

  for (const item of allItems) {
    if (processed.has(`${item.listId}:${item.value}`)) continue;

    const cluster = {
      representative: item.value,
      members: [{ value: item.value, listId: item.listId, similarity: 1.0 }],
    };

    processed.add(`${item.listId}:${item.value}`);

    // Find similar items across all lists
    for (const otherItem of allItems) {
      if (processed.has(`${otherItem.listId}:${otherItem.value}`)) continue;

      const similarity = calculateSimilarity(
        item.value,
        otherItem.value,
        algorithm
      );
      if (similarity >= threshold) {
        cluster.members.push({
          value: otherItem.value,
          listId: otherItem.listId,
          similarity,
        });
        processed.add(`${otherItem.listId}:${otherItem.value}`);
      }
    }

    if (cluster.members.length > 1) {
      clusters.push(cluster);
    }
  }

  return { matches, clusters };
}

/**
 * Validate package version strings
 */
export function validatePackageVersions(items: string[]): PackageVersionInfo[] {
  const versionRegex =
    /^(@?[a-zA-Z0-9\-_.]+)@([0-9]+\.[0-9]+\.[0-9]+(?:\-[a-zA-Z0-9\-_.]+)?)$/;

  return items.map((item) => {
    const match = item.match(versionRegex);

    if (!match) {
      return {
        name: item,
        version: '',
        valid: false,
        issues: ['Invalid package@version format'],
      };
    }

    const [, name, version] = match;
    const issues: string[] = [];

    // Check for common version issues
    if (version.includes('..')) {
      issues.push('Invalid version format: contains double dots');
    }

    if (version.startsWith('-') || version.endsWith('-')) {
      issues.push('Invalid version format: starts or ends with dash');
    }

    // Check for valid semver
    const semverParts = version.split('.');
    if (semverParts.length < 3) {
      issues.push(
        'Version should follow semantic versioning (major.minor.patch)'
      );
    }

    return {
      name,
      version,
      valid: issues.length === 0,
      issues: issues.length > 0 ? issues : undefined,
    };
  });
}

/**
 * Normalize URLs for comparison
 */
export function normalizeUrls(items: string[]): UrlInfo[] {
  return items.map((url) => {
    try {
      const urlObj = new URL(url);

      // Normalize the URL
      let normalized = urlObj.protocol + '//' + urlObj.hostname;

      // Add port if non-standard
      if (
        urlObj.port &&
        !(
          (urlObj.protocol === 'http:' && urlObj.port === '80') ||
          (urlObj.protocol === 'https:' && urlObj.port === '443')
        )
      ) {
        normalized += ':' + urlObj.port;
      }

      // Add pathname, removing trailing slash unless it's root
      let pathname = urlObj.pathname;
      if (pathname !== '/' && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
      }
      normalized += pathname;

      // Add search params (sorted for consistency)
      if (urlObj.search) {
        const params = new URLSearchParams(urlObj.search);
        const sortedParams = new URLSearchParams();
        Array.from(params.keys())
          .sort()
          .forEach((key) => {
            params
              .getAll(key)
              .forEach((value) => sortedParams.append(key, value));
          });
        normalized += '?' + sortedParams.toString();
      }

      // Add hash
      if (urlObj.hash) {
        normalized += urlObj.hash;
      }

      return {
        original: url,
        normalized,
        protocol: urlObj.protocol,
        domain: urlObj.hostname,
        path: urlObj.pathname,
      };
    } catch (error) {
      return {
        original: url,
        normalized: url, // Keep original if parsing fails
        protocol: undefined,
        domain: undefined,
        path: undefined,
      };
    }
  });
}

/**
 * Preprocess lists based on options
 */
function preprocessLists(
  lists: Record<string, string[]>,
  options: ComparisonOptions
): Record<string, string[]> {
  const processed: Record<string, string[]> = {};

  for (const [listId, items] of Object.entries(lists)) {
    let processedItems = [...items];

    // Filter null/undefined values
    processedItems = processedItems.filter((item) => item != null).map(String);

    // Apply basic transformations
    if (options.trimWhitespace) {
      processedItems = processedItems.map((item) => item.trim());
    }

    if (!options.caseSensitive) {
      processedItems = processedItems.map((item) => item.toLowerCase());
    }

    if (options.removeDuplicates) {
      processedItems = [...new Set(processedItems)];
    }

    if (options.sortBeforeCompare) {
      processedItems.sort();
    }

    if (options.filterPattern) {
      const regex = new RegExp(
        options.filterPattern,
        options.caseSensitive ? 'g' : 'gi'
      );
      processedItems = processedItems.filter((item) => regex.test(item));
    }

    processed[listId] = processedItems;
  }

  return processed;
}

/**
 * Calculate comprehensive statistics for comparison results
 */
function calculateStatistics(
  lists: Record<string, string[]>,
  result: ComparisonResult
): ComparisonStatistics {
  const listSizes: Record<string, number> = {};
  let totalItems = 0;

  for (const [listId, items] of Object.entries(lists)) {
    listSizes[listId] = items.length;
    totalItems += items.length;
  }

  const allUniqueItems = new Set<string>();
  Object.values(lists).forEach((items) => {
    items.forEach((item) => allUniqueItems.add(item));
  });

  const totalUnique = allUniqueItems.size;
  const totalDuplicates = totalItems - totalUnique;

  // Calculate overlap percentage
  const intersectionSize = result.intersection?.length || 0;
  const overlapPercentage =
    totalUnique > 0 ? (intersectionSize / totalUnique) * 100 : 0;

  // Calculate similarity matrix for multiple lists
  const listIds = Object.keys(lists);
  const similarityMatrix: Record<string, Record<string, number>> = {};

  if (listIds.length > 1) {
    for (const listId1 of listIds) {
      similarityMatrix[listId1] = {};
      for (const listId2 of listIds) {
        if (listId1 === listId2) {
          similarityMatrix[listId1][listId2] = 1.0;
        } else {
          const list1Set = new Set(lists[listId1]);
          const list2Set = new Set(lists[listId2]);
          const intersection = new Set(
            [...list1Set].filter((x) => list2Set.has(x))
          );
          const union = new Set([...list1Set, ...list2Set]);
          similarityMatrix[listId1][listId2] =
            union.size > 0 ? intersection.size / union.size : 0;
        }
      }
    }
  }

  return {
    totalUnique,
    totalDuplicates,
    overlapPercentage: Math.round(overlapPercentage * 100) / 100,
    listSizes,
    similarityMatrix,
  };
}

/**
 * Main comparison function
 */
export function compareLists(
  lists: Record<string, string[]>,
  options: ComparisonOptions = { mode: 'set' }
): ComparisonResult {
  const startTime = performance.now();

  try {
    if (!lists || Object.keys(lists).length === 0) {
      return {
        success: false,
        error: 'No lists provided for comparison',
      };
    }

    // Preprocess lists
    const processedLists = preprocessLists(lists, options);
    const listIds = Object.keys(processedLists);

    if (listIds.length === 1) {
      const singleList = processedLists[listIds[0]];
      return {
        success: true,
        union: [...new Set(singleList)],
        intersection: [],
        difference: singleList,
        symmetricDifference: singleList,
        unique: { [listIds[0]]: singleList },
        metadata: {
          processingTime:
            Math.round((performance.now() - startTime) * 100) / 100,
          totalItems: singleList.length,
          listsProcessed: 1,
        },
      };
    }

    let result: Partial<ComparisonResult> = { success: true };

    switch (options.mode) {
      case 'set':
        result = performSetOperations(processedLists);
        break;
      case 'sequential':
        result = performSequentialComparison(processedLists);
        break;
      case 'smart':
        result = performSmartComparison(processedLists);
        break;
      case 'fuzzy':
        if (options.fuzzyThreshold) {
          result = performFuzzyComparison(
            processedLists,
            options.fuzzyThreshold
          );
        } else {
          return {
            success: false,
            error: 'Fuzzy threshold is required for fuzzy mode',
          };
        }
        break;
      case 'developer':
        result = performDeveloperComparison(processedLists);
        break;
      default:
        return {
          success: false,
          error: `Invalid comparison mode: ${options.mode}`,
        };
    }

    const finalResult = result as ComparisonResult;
    finalResult.statistics = calculateStatistics(processedLists, finalResult);
    finalResult.metadata = {
      processingTime: Math.round((performance.now() - startTime) * 100) / 100,
      totalItems: Object.values(processedLists).reduce(
        (sum, list) => sum + list.length,
        0
      ),
      listsProcessed: listIds.length,
    };

    return finalResult;
  } catch (error) {
    return {
      success: false,
      error: `Comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Perform set operations (union, intersection, difference, etc.)
 */
function performSetOperations(
  lists: Record<string, string[]>
): Partial<ComparisonResult> {
  const listValues = Object.values(lists);
  const allItems = listValues.flat();
  const allItemsSet = new Set(allItems);

  // Union: all unique items
  const union = Array.from(allItemsSet);

  // Intersection: items present in ALL lists
  let intersection = new Set(listValues[0]);
  for (let i = 1; i < listValues.length; i++) {
    const currentSet = new Set(listValues[i]);
    intersection = new Set([...intersection].filter((x) => currentSet.has(x)));
  }

  // Difference: items in first list but not in others
  const firstListSet = new Set(listValues[0]);
  const otherItemsSet = new Set(listValues.slice(1).flat());
  const difference = Array.from(firstListSet).filter(
    (x) => !otherItemsSet.has(x)
  );

  // Symmetric difference: items that appear in exactly one list
  const itemCounts = new Map<string, number>();
  allItems.forEach((item) => {
    itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
  });
  const symmetricDifference = Array.from(itemCounts.entries())
    .filter(([_, count]) => count === 1)
    .map(([item, _]) => item);

  // Unique items per list
  const unique: Record<string, string[]> = {};
  Object.entries(lists).forEach(([listId, items]) => {
    const listSet = new Set(items);
    const otherLists = Object.entries(lists)
      .filter(([id, _]) => id !== listId)
      .map(([_, items]) => items)
      .flat();
    const otherSet = new Set(otherLists);
    unique[listId] = Array.from(listSet).filter((x) => !otherSet.has(x));
  });

  return {
    success: true,
    union,
    intersection: Array.from(intersection),
    difference,
    symmetricDifference,
    unique,
  };
}

/**
 * Perform sequential comparison (position-based)
 */
function performSequentialComparison(
  lists: Record<string, string[]>
): Partial<ComparisonResult> {
  const listEntries = Object.entries(lists);
  const maxLength = Math.max(...listEntries.map(([_, items]) => items.length));

  const differences: string[] = [];
  const unique: Record<string, string[]> = {};

  // Initialize unique arrays
  listEntries.forEach(([listId, _]) => {
    unique[listId] = [];
  });

  // Compare position by position
  for (let i = 0; i < maxLength; i++) {
    const itemsAtPosition = listEntries.map(([listId, items]) => ({
      listId,
      item: i < items.length ? items[i] : undefined,
    }));

    // Check if all items at this position are the same
    const definedItems = itemsAtPosition.filter(
      ({ item }) => item !== undefined
    );
    if (definedItems.length > 1) {
      const firstItem = definedItems[0].item;
      const allSame = definedItems.every(({ item }) => item === firstItem);

      if (!allSame) {
        definedItems.forEach(({ listId, item }) => {
          if (item) {
            differences.push(`Position ${i}: ${listId} = "${item}"`);
            unique[listId].push(item);
          }
        });
      }
    }
  }

  return {
    success: true,
    difference: differences,
    unique,
  };
}

/**
 * Perform smart comparison with normalization
 */
function performSmartComparison(
  lists: Record<string, string[]>
): Partial<ComparisonResult> {
  // Normalize all items for smart comparison
  const normalizedLists: Record<string, string[]> = {};

  Object.entries(lists).forEach(([listId, items]) => {
    normalizedLists[listId] = items.map(
      (item) =>
        item
          .toLowerCase()
          .trim()
          .replace(/[-_\s]+/g, '_') // Normalize separators
          .replace(/[^\w]/g, '') // Remove special characters
    );
  });

  return performSetOperations(normalizedLists);
}

/**
 * Perform fuzzy comparison
 */
function performFuzzyComparison(
  lists: Record<string, string[]>,
  threshold: number
): Partial<ComparisonResult> {
  const fuzzyResult = fuzzyMatch(lists, { threshold, algorithm: 'similarity' });

  // Extract unique matches for union
  const matchedItems = new Set<string>();
  fuzzyResult.matches.forEach((match) => {
    matchedItems.add(match.item1);
    matchedItems.add(match.item2);
  });

  // Items that appear in clusters (intersection-like)
  const clusteredItems = new Set<string>();
  fuzzyResult.clusters.forEach((cluster) => {
    cluster.members.forEach((member) => {
      clusteredItems.add(member.value);
    });
  });

  return {
    success: true,
    union: Array.from(matchedItems),
    intersection: Array.from(clusteredItems),
  };
}

/**
 * Perform developer-specific comparison
 */
function performDeveloperComparison(
  lists: Record<string, string[]>
): Partial<ComparisonResult> {
  // Check if items look like package versions
  const allItems = Object.values(lists).flat();
  const hasPackageVersions = allItems.some(
    (item) => item.includes('@') && item.match(/\d+\.\d+\.\d+/)
  );

  if (hasPackageVersions) {
    // Normalize package names for comparison
    const normalizedLists: Record<string, string[]> = {};
    Object.entries(lists).forEach(([listId, items]) => {
      normalizedLists[listId] = items.map((item) => {
        const match = item.match(/^(.+)@/);
        return match ? match[1] : item;
      });
    });
    return performSetOperations(normalizedLists);
  }

  // Check if items look like URLs
  const hasUrls = allItems.some((item) => item.match(/^https?:\/\//));
  if (hasUrls) {
    const normalizedUrlLists: Record<string, string[]> = {};
    Object.entries(lists).forEach(([listId, items]) => {
      const urlInfos = normalizeUrls(items);
      normalizedUrlLists[listId] = urlInfos.map((info) => info.normalized);
    });
    return performSetOperations(normalizedUrlLists);
  }

  // Default to smart comparison for developer mode
  return performSmartComparison(lists);
}

/**
 * Export comparison results in various formats
 */
export function exportResults(
  result: ComparisonResult,
  format:
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'sql'
    | 'json'
    | 'csv'
    | 'markdown'
): string {
  if (!result.success) {
    throw new Error(result.error || 'Comparison failed');
  }

  switch (format) {
    case 'javascript':
      return `// Comparison Results
const union = ${JSON.stringify(result.union || [], null, 2)};
const intersection = ${JSON.stringify(result.intersection || [], null, 2)};
const difference = ${JSON.stringify(result.difference || [], null, 2)};
const unique = ${JSON.stringify(result.unique || {}, null, 2)};`;

    case 'typescript':
      return `// Comparison Results
const union: string[] = ${JSON.stringify(result.union || [], null, 2)};
const intersection: string[] = ${JSON.stringify(result.intersection || [], null, 2)};
const difference: string[] = ${JSON.stringify(result.difference || [], null, 2)};
const unique: Record<string, string[]> = ${JSON.stringify(result.unique || {}, null, 2)};`;

    case 'python':
      return `# Comparison Results
union = ${JSON.stringify(result.union || []).replace(/"/g, "'")}
intersection = ${JSON.stringify(result.intersection || []).replace(/"/g, "'")}
difference = ${JSON.stringify(result.difference || []).replace(/"/g, "'")}
unique = ${JSON.stringify(result.unique || {}).replace(/"/g, "'")}`;

    case 'sql':
      const unionItems = result.union || [];
      if (unionItems.length === 0) return '-- No items to generate SQL for';
      const quotedItems = unionItems
        .map((item) => `'${item.replace(/'/g, "''")}'`)
        .join(',\n  ');
      return `-- SQL IN clause for union results
SELECT * FROM table_name
WHERE column_name IN (
  ${quotedItems}
);`;

    case 'json':
      return JSON.stringify(
        {
          union: result.union || [],
          intersection: result.intersection || [],
          difference: result.difference || [],
          symmetricDifference: result.symmetricDifference || [],
          unique: result.unique || {},
          statistics: result.statistics,
          metadata: result.metadata,
        },
        null,
        2
      );

    case 'csv':
      const maxLength = Math.max(
        result.union?.length || 0,
        result.intersection?.length || 0,
        result.difference?.length || 0
      );
      let csv = 'Union,Intersection,Difference\n';
      for (let i = 0; i < maxLength; i++) {
        const union =
          result.union && i < result.union.length ? result.union[i] : '';
        const intersection =
          result.intersection && i < result.intersection.length
            ? result.intersection[i]
            : '';
        const difference =
          result.difference && i < result.difference.length
            ? result.difference[i]
            : '';
        csv += `"${union}","${intersection}","${difference}"\n`;
      }
      return csv;

    case 'markdown':
      let md = '# List Comparison Results\n\n';

      if (result.union && result.union.length > 0) {
        md += '## Union\n';
        result.union.forEach((item) => (md += `- ${item}\n`));
        md += '\n';
      }

      if (result.intersection && result.intersection.length > 0) {
        md += '## Intersection\n';
        result.intersection.forEach((item) => (md += `- ${item}\n`));
        md += '\n';
      }

      if (result.difference && result.difference.length > 0) {
        md += '## Difference\n';
        result.difference.forEach((item) => (md += `- ${item}\n`));
        md += '\n';
      }

      if (result.statistics) {
        md += '## Statistics\n';
        md += `- Total Unique Items: ${result.statistics.totalUnique}\n`;
        md += `- Total Duplicates: ${result.statistics.totalDuplicates}\n`;
        md += `- Overlap Percentage: ${result.statistics.overlapPercentage}%\n`;
      }

      return md;

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

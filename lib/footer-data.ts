import { getAllCemeteries, getAllTypes, createStateSlug, createTypeSlug } from './data';

// Interfaces for footer data
export interface FooterState {
  name: string;
  slug: string;
  count: number;
}

export interface FooterType {
  name: string;
  slug: string;
  count: number;
}

export interface FooterGuide {
  href: string;
  label: string;
  description?: string;
}

// Static guides content (pillar pages)
export const guides: FooterGuide[] = [
  {
    href: '/guides/cemetery-types',
    label: 'Types of Cemeteries',
    description: 'Understand different cemetery types'
  },
  {
    href: '/guides/famous-cemeteries',
    label: 'Famous Cemeteries',
    description: 'Explore notable cemeteries in America'
  },
  {
    href: '/guides/funeral-planning',
    label: 'Funeral Planning',
    description: 'Complete guide to funeral planning'
  },
  {
    href: '/guides/veterans-burial',
    label: 'Veterans Burial',
    description: 'Military burial benefits and options'
  },
  {
    href: '/guides/green-burial',
    label: 'Green Burial',
    description: 'Eco-friendly burial options'
  }
];

// Cache for footer data
let statesCacheFooter: FooterState[] | null = null;
let typesCacheFooter: FooterType[] | null = null;

/**
 * Get top states by cemetery count
 * @param limit - Maximum number of states to return (default 8)
 * @returns Array of states sorted by cemetery count (descending)
 */
export async function getTopStatesByCemeteryCount(limit: number = 8): Promise<FooterState[]> {
  if (statesCacheFooter && statesCacheFooter.length >= limit) {
    return statesCacheFooter.slice(0, limit);
  }

  try {
    const cemeteries = await getAllCemeteries();

    // Count cemeteries per state
    const stateCounts = new Map<string, number>();

    for (const cemetery of cemeteries) {
      if (cemetery.state && cemetery.state.trim()) {
        const state = cemetery.state.trim();
        stateCounts.set(state, (stateCounts.get(state) || 0) + 1);
      }
    }

    // Convert to array and sort by count
    const sortedStates: FooterState[] = Array.from(stateCounts.entries())
      .map(([name, count]) => ({
        name,
        slug: createStateSlug(name),
        count
      }))
      .sort((a, b) => b.count - a.count);

    // Cache the full list
    statesCacheFooter = sortedStates;

    return sortedStates.slice(0, limit);
  } catch (error) {
    console.error('Error getting top states:', error);
    return [];
  }
}

/**
 * Get top cemetery types by count
 * @param limit - Maximum number of types to return (default 8)
 * @returns Array of types sorted by cemetery count (descending)
 */
export async function getTopTypesByCemeteryCount(limit: number = 8): Promise<FooterType[]> {
  if (typesCacheFooter && typesCacheFooter.length >= limit) {
    return typesCacheFooter.slice(0, limit);
  }

  try {
    const cemeteries = await getAllCemeteries();
    const allTypes = await getAllTypes();

    // Count cemeteries per type
    const typeCounts = new Map<string, number>();
    const typeNames = new Map<string, string>();

    // Build a lookup for type names
    for (const type of allTypes) {
      typeNames.set(type.slug, type.name);
    }

    for (const cemetery of cemeteries) {
      if (cemetery.type_slug && cemetery.type_slug.trim()) {
        const typeSlug = cemetery.type_slug.trim();
        typeCounts.set(typeSlug, (typeCounts.get(typeSlug) || 0) + 1);

        // Store display name if we have it
        if (cemetery.type && !typeNames.has(typeSlug)) {
          typeNames.set(typeSlug, cemetery.type);
        }
      } else if (cemetery.type && cemetery.type.trim()) {
        const typeSlug = createTypeSlug(cemetery.type.trim());
        typeCounts.set(typeSlug, (typeCounts.get(typeSlug) || 0) + 1);
        typeNames.set(typeSlug, cemetery.type.trim());
      }
    }

    // Convert to array and sort by count
    const sortedTypes: FooterType[] = Array.from(typeCounts.entries())
      .map(([slug, count]) => ({
        name: formatTypeName(typeNames.get(slug) || slug),
        slug,
        count
      }))
      .sort((a, b) => b.count - a.count);

    // Cache the full list
    typesCacheFooter = sortedTypes;

    return sortedTypes.slice(0, limit);
  } catch (error) {
    console.error('Error getting top types:', error);
    return [];
  }
}

/**
 * Format type name for display
 */
function formatTypeName(name: string): string {
  // Convert slug-style names to title case
  if (name.includes('-')) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Capitalize first letter of each word
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get all footer data in a single call (for server components)
 */
export async function getFooterData(stateLimit: number = 8, typeLimit: number = 8) {
  const [topStates, topTypes] = await Promise.all([
    getTopStatesByCemeteryCount(stateLimit),
    getTopTypesByCemeteryCount(typeLimit)
  ]);

  return {
    states: topStates,
    types: topTypes,
    guides
  };
}

/**
 * Clear cache (useful for development/testing)
 */
export function clearFooterCache() {
  statesCacheFooter = null;
  typesCacheFooter = null;
}

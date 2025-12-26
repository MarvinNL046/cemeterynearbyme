/**
 * Deaths Data Library
 *
 * Helper functions for working with famous deaths data
 */

import famousDeathsData from '@/data/famous-deaths.json';

export interface FamousDeath {
  name: string;
  birth_date: string | null;
  death_date: string;
  death_day: number;
  death_month: number;
  profession: string;
  description: string;
  cemetery: string | null;
  city: string | null;
  state: string | null;
  country: string;
  wikipedia: string | null;
  cemetery_slug: string | null;
  wikidata_id: string;
}

/**
 * Get notable burials at a specific cemetery
 * @param slug - The cemetery slug to look up
 * @returns Array of famous deaths buried at this cemetery
 */
export function getNotableBurialsAtCemetery(slug: string): FamousDeath[] {
  return famousDeathsData.deaths.filter(
    (death) => death.cemetery_slug === slug
  ).sort((a, b) => {
    // Sort by death date descending (most recent first)
    const dateA = a.death_date ? new Date(a.death_date).getTime() : 0;
    const dateB = b.death_date ? new Date(b.death_date).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Get all famous deaths that have a cemetery_slug populated
 * @returns Array of famous deaths with cemetery links
 */
export function getFamousDeathsWithCemeteryLink(): FamousDeath[] {
  return famousDeathsData.deaths.filter(
    (death) => death.cemetery_slug !== null
  );
}

/**
 * Get famous deaths for a specific date
 * @param day - Day of month (1-31)
 * @param month - Month number (1-12)
 * @returns Array of famous deaths on this date
 */
export function getFamousDeathsByDate(day: number, month: number): FamousDeath[] {
  return famousDeathsData.deaths
    .filter(person => person.death_day === day && person.death_month === month && person.death_date)
    .sort((a, b) => {
      const yearA = a.death_date ? parseInt(a.death_date.split('-')[0]) : 0;
      const yearB = b.death_date ? parseInt(b.death_date.split('-')[0]) : 0;
      return yearB - yearA;
    });
}

/**
 * Get count of notable burials at a cemetery
 * @param slug - The cemetery slug
 * @returns Number of notable burials
 */
export function getNotableBurialsCount(slug: string): number {
  return famousDeathsData.deaths.filter(
    (death) => death.cemetery_slug === slug
  ).length;
}

/**
 * Get all cemetery slugs that have notable burials
 * @returns Array of unique cemetery slugs with burial counts
 */
export function getCemeteriesWithNotableBurials(): { slug: string; count: number }[] {
  const countMap = new Map<string, number>();

  for (const death of famousDeathsData.deaths) {
    if (death.cemetery_slug) {
      countMap.set(
        death.cemetery_slug,
        (countMap.get(death.cemetery_slug) || 0) + 1
      );
    }
  }

  return Array.from(countMap.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate age from birth and death dates
 * @param birthDate - Birth date string (YYYY-MM-DD)
 * @param deathDate - Death date string (YYYY-MM-DD)
 * @returns Age at death or null if dates are invalid
 */
export function calculateAge(birthDate: string | null, deathDate: string | null): number | null {
  if (!birthDate || !deathDate) return null;

  const birth = new Date(birthDate);
  const death = new Date(deathDate);

  if (isNaN(birth.getTime()) || isNaN(death.getTime())) return null;

  let age = death.getFullYear() - birth.getFullYear();
  const monthDiff = death.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get year from date string
 * @param dateString - Date string (YYYY-MM-DD)
 * @returns Year as string
 */
export function getYear(dateString: string | null): string {
  if (!dateString) return '';
  return dateString.split('-')[0];
}

/**
 * Format birth-death years for display
 * @param death - Famous death object
 * @returns Formatted string like "1920-2023"
 */
export function formatLifespan(death: FamousDeath): string {
  const birthYear = getYear(death.birth_date);
  const deathYear = getYear(death.death_date);

  if (birthYear && deathYear) {
    return `${birthYear}-${deathYear}`;
  }
  if (deathYear) {
    return `d. ${deathYear}`;
  }
  return '';
}

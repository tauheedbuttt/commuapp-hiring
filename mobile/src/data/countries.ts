import countries from 'world-countries';

export const COUNTRY_NAMES: readonly string[] = countries
  .map((country) => country.name.common)
  .sort((a, b) => a.localeCompare(b));

/** commu is a Finnish product — defaults the picker to the home market. */
export const DEFAULT_COUNTRY = 'Finland';

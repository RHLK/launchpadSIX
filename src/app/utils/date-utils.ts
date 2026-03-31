/**
 * Date Utility Functions
 */

/**
 * Checks if a given date string is in the past relative to now.
 * @param dateUtc The UTC date string to check.
 * @returns True if the date is in the past, false otherwise.
 */
export function isPast(dateUtc: string | null | undefined): boolean {
    if (!dateUtc) return false;
    return new Date(dateUtc) < new Date();
  }
  
  /**
   * Formats a UTC date string into a localized date string based on the browser's locale.
   * @param dateUtc The UTC date string to format.
   * @returns The localized date string.
   */
  export function formatLocalizedDate(dateUtc: string | null | undefined): string {
    if (!dateUtc) return '';
    return new Date(dateUtc).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  
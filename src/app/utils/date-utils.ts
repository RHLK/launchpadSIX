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

/**
 * Formats a countdown string from a target date and current time.
 * @param targetDate The target date to count down to.
 * @param currentTime The current timestamp in milliseconds.
 * @returns A formatted countdown string (e.g., "T-01d 12:34:56" or "LIFTOFF").
 */
export function formatCountdown(
  targetDate: string | number | Date | null | undefined,
  currentTime: number,
): string {
  if (!targetDate) return 'T-00:00:00';

  const launchDate = new Date(targetDate).getTime();
  const diff = launchDate - currentTime;

  if (diff <= 0) return 'LIFTOFF';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const dStr = days > 0 ? `${days}d ` : '';
  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  const sStr = seconds.toString().padStart(2, '0');

  return `T-${dStr}${hStr}:${mStr}:${sStr}`;
}

/**
 * Formats a UTC date string into a localized string for Local time .
 * @param dateUtc The UTC date string to format.
 * @returns The formatted date string in Local time.
 */
export function formatToLocalTime(dateUtc: string | null | undefined): string {
  if (!dateUtc) return '';
  return (
    new Date(dateUtc).toLocaleTimeString(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' Local'
  );
}

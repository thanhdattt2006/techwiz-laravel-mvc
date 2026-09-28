/**
 * Pickup Calendar Utilities
 * Date calculation helpers for the pre-order checkout flow.
 * Extracted from usePreOrderCheckout for DRY and SRP compliance.
 */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Generate upcoming calendar dates matching the stall's pickup days
 * @param {Array<number>} pickupDays - Array of JS day-of-week indices (0=Sun...6=Sat)
 * @param {number} maxResults - Maximum number of dates to return
 * @returns {Array<object>} Array of date objects with dateStr, dayName, relativeLabel, etc.
 */
export function getUpcomingPickupDates(pickupDays = [], maxResults = 8) {
  if (!Array.isArray(pickupDays) || pickupDays.length === 0) return [];

  const results = [];
  const today = new Date();

  for (let i = 0; i < 35 && results.length < maxResults; i++) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + i);

    const dayOfWeek = candidate.getDay();
    if (pickupDays.includes(dayOfWeek)) {
      const year = candidate.getFullYear();
      const month = String(candidate.getMonth() + 1).padStart(2, '0');
      const day = String(candidate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      let relativeLabel = '';
      if (i === 0) relativeLabel = 'Today';
      else if (i === 1) relativeLabel = 'Tomorrow';
      else if (i <= 6) relativeLabel = `This ${SHORT_DAY_NAMES[dayOfWeek]}`;
      else relativeLabel = `Next ${SHORT_DAY_NAMES[dayOfWeek]}`;

      results.push({
        dateStr,
        dayOfWeek,
        dayName: DAY_NAMES[dayOfWeek],
        shortDay: SHORT_DAY_NAMES[dayOfWeek],
        monthDay: candidate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        relativeLabel,
        isToday: i === 0,
      });
    }
  }

  return results;
}

/**
 * Site-wide stats — review and update quarterly.
 */

export const stats = {
  // Rounded-down, defensible count of patient encounters documented in Stream
  encounters: '30,000',

  // Homepage metrics bar — set to a string to show the stat, keep null to hide it
  noteMinutes: null,  // e.g. '4' → "4 min average time to complete a note"
  retention90: null,  // e.g. '92' → "92% of users still active after 90 days"
};

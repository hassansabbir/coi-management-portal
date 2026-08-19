/**
 * COI Field Map — ACORD 25 (2016/03) coordinate configuration.
 *
 * IMPORTANT: These are PLACEHOLDER coordinates. You MUST run the calibration
 * scripts against your actual PDF before shipping:
 *
 *   1. Place your PDF at: assets/sample-coi.pdf
 *   2. Run: npx tsx scripts/calibrate-coi-fields.ts
 *      → Opens sample-coi-grid.pdf — read off approximate x/y for each field
 *   3. Run: npx tsx scripts/test-coi-coordinates.ts
 *      → Opens sample-coi-test.pdf — adjust until markers land correctly
 *   4. Replace the placeholder values below with your calibrated values.
 *
 * pdf-lib coordinate origin: bottom-left corner of the page.
 * Units: PDF points (1 pt = 1/72 inch).
 * Standard ACORD 25 letter page: 612 × 792 pts.
 */
export const COI_FIELD_MAP = {
  /** Page index (0-based) */
  page: 0,

  /** DATE (MM/DD/YYYY) — top-right header area */
  date: {
    x: 525,
    y: 748,
    size: 9,
  },

  /** CERTIFICATE HOLDER — name + address, bottom-left box */
  certificateHolder: {
    x: 28,
    y: 120,
    maxWidth: 240,
    lineHeight: 12,
    size: 9,
  },

  /** ADDITIONAL INSURED checkbox — General Liability row */
  additionalInsuredGL: {
    x: 185,
    y: 450,
  },

  /** ADDITIONAL INSURED checkbox — Auto Liability row */
  additionalInsuredAuto: {
    x: 185,
    y: 390,
  },

  /** DESCRIPTION OF OPERATIONS — large text area, full box */
  descriptionOfOperations: {
    x: 28,
    y: 205,
    maxWidth: 590,
    lineHeight: 11,
    size: 8,
    /** Safety cap: how many lines the box can hold visually */
    maxLines: 8,
  },
} as const;

export type COIFieldMap = typeof COI_FIELD_MAP;
